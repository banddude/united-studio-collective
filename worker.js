export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    // CORS headers
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405, headers: corsHeaders });
    }

    try {
      // ===== GET SHIPPING RATES =====
      if (path === "/rates") {
        const { items, zipCode, country = "US" } = await request.json();

        // Validate input
        if (!zipCode || zipCode.length < 3) {
          return new Response(JSON.stringify({ error: "Invalid postal code" }), {
            status: 400,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          });
        }

        // Separate framed and frameless items
        let framedQty = 0;
        let framelessQty = 0;
        items.forEach(item => {
          const qty = item.quantity || 1;
          if (item.isFramed) {
            framedQty += qty;
          } else {
            framelessQty += qty;
          }
        });

        const totalQty = framedQty + framelessQty;

        // Calculate parcels for each type
        const parcels = [
          ...calculateFramedParcels(framedQty),
          ...calculateTubeParcels(framelessQty),
        ];

        // Get rates for each box type and sum them
        // (Shippo multi-parcel doesn't work well with test accounts)
        const boxCounts = {};
        parcels.forEach(p => {
          const key = `${p.weight}`;
          boxCounts[key] = (boxCounts[key] || 0) + 1;
        });

        // Get unique box configurations
        const uniqueParcels = [...new Set(parcels.map(p => JSON.stringify(p)))].map(p => JSON.parse(p));

        // Fetch rates for each unique box size
        const ratesByService = {};

        for (const parcel of uniqueParcels) {
          const shippoRequest = {
            address_from: {
              name: "United Studio Collective",
              street1: "123 N Hollywood Way",
              city: "Burbank",
              state: "CA",
              zip: "91505",
              country: "US",
            },
            address_to: {
              name: "Customer",
              street1: "123 Main St",
              city: "City",
              state: "",
              zip: zipCode,
              country: country,
            },
            parcels: [parcel],
            async: false,
          };

          const shippoResponse = await fetch("https://api.goshippo.com/shipments/", {
            method: "POST",
            headers: {
              "Authorization": `ShippoToken ${env.SHIPPO_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(shippoRequest),
          });

          const shipment = await shippoResponse.json();

          if (shipment.rates) {
            // Count how many boxes of this type we have
            const boxCount = parcels.filter(p => p.weight === parcel.weight).length;

            shipment.rates
              .filter((r) => r.provider === "USPS")
              .filter((r) => !r.servicelevel.name.includes("Express"))
              .forEach((r) => {
                const serviceKey = r.servicelevel.name;
                if (!ratesByService[serviceKey]) {
                  ratesByService[serviceKey] = {
                    id: r.object_id,
                    provider: r.provider,
                    service: r.servicelevel.name,
                    price: 0,
                    days: r.estimated_days,
                    description: r.duration_terms,
                  };
                }
                ratesByService[serviceKey].price += parseFloat(r.amount) * boxCount;
              });
          }
        }

        const rates = Object.values(ratesByService).sort((a, b) => a.price - b.price);

        if (rates.length === 0) {
          return new Response(JSON.stringify({
            error: "No shipping rates available for this destination",
          }), {
            status: 400,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          });
        }

        return new Response(JSON.stringify({
          rates,
          parcels: parcels.length,
          totalQty,
        }), {
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }

      // ===== CREATE CHECKOUT SESSION WITH SHIPPING =====
      if (path === "/checkout") {
        const { items, shippingCost, shippingService } = await request.json();

        // Validate
        if (!items || items.length === 0) {
          return new Response(JSON.stringify({ error: "No items in cart" }), {
            status: 400,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          });
        }

        if (shippingCost === undefined || shippingCost < 0) {
          return new Response(JSON.stringify({ error: "Invalid shipping cost" }), {
            status: 400,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          });
        }

        const body = new URLSearchParams();

        // Add product line items
        items.forEach((item, index) => {
          body.append(`line_items[${index}][price]`, item.priceId);
          body.append(`line_items[${index}][quantity]`, item.quantity);
        });

        // Add shipping as a line item with price_data
        const shippingIndex = items.length;
        body.append(`line_items[${shippingIndex}][price_data][currency]`, "usd");
        body.append(`line_items[${shippingIndex}][price_data][product_data][name]`, `Shipping (${shippingService || "Standard"})`);
        body.append(`line_items[${shippingIndex}][price_data][unit_amount]`, Math.round(shippingCost * 100)); // Convert to cents
        body.append(`line_items[${shippingIndex}][quantity]`, "1");

        // Checkout configuration
        body.append("mode", "payment");
        // TODO: Could fetch supported countries from Shippo API instead of hardcoding
        // https://docs.goshippo.com/docs/addresses/international/
        const allowedCountries = [
          "US", "CA", "MX", "GB", "IE", "DE", "FR", "IT", "ES", "NL",
          "BE", "AT", "CH", "SE", "NO", "DK", "FI", "PL", "PT", "AU",
          "NZ", "JP", "KR", "SG", "HK", "IL", "BR", "AR", "CL"
        ];
        allowedCountries.forEach((code, i) => {
          body.append(`shipping_address_collection[allowed_countries][${i}]`, code);
        });
        body.append("success_url", "https://unitedstudiocollective.com/store?success=true");
        body.append("cancel_url", "https://unitedstudiocollective.com/cart?canceled=true");

        const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${env.STRIPE_SECRET_KEY}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: body,
        });

        const json = await response.json();

        if (json.error) {
          throw new Error(json.error.message);
        }

        return new Response(JSON.stringify({ url: json.url }), {
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }

      // Unknown endpoint
      return new Response(JSON.stringify({ error: "Not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });

    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }
  },
};

// Calculate parcels for framed prints (max 3 per box)
function calculateFramedParcels(qty) {
  if (qty === 0) return [];
  const parcels = [];
  let remaining = qty;

  while (remaining > 0) {
    const inThisBox = Math.min(remaining, 3);
    parcels.push(getFramedBoxDimensions(inThisBox));
    remaining -= inThisBox;
  }

  return parcels;
}

// Calculate parcels for frameless prints in tubes (max 5 per tube)
function calculateTubeParcels(qty) {
  if (qty === 0) return [];
  const parcels = [];
  let remaining = qty;

  while (remaining > 0) {
    const inThisTube = Math.min(remaining, 5);
    parcels.push(getTubeDimensions(inThisTube));
    remaining -= inThisTube;
  }

  return parcels;
}

// Get box dimensions for framed prints
function getFramedBoxDimensions(printCount) {
  // 16x20 framed print specs:
  // - Each print is roughly 20x24" framed
  // - Thickness: ~2.5" per print (frame depth + packing)
  // - Weight: ~7 lbs per framed print
  return {
    length: 24,
    width: 20,
    height: 1 + (2.5 * printCount),
    distance_unit: "in",
    weight: 7 * printCount,
    mass_unit: "lb",
  };
}

// Get tube dimensions for frameless prints
function getTubeDimensions(printCount) {
  // Frameless 16x20 prints rolled in a tube:
  // - Tube: 24" long x 4" diameter
  // - Weight: ~1.5 lbs base + 0.5 lb per additional print
  return {
    length: 24,
    width: 4,
    height: 4,
    distance_unit: "in",
    weight: 1 + (0.5 * printCount),
    mass_unit: "lb",
  };
}

