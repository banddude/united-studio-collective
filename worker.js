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

        // Calculate total quantity of prints
        const totalQty = items.reduce((sum, item) => sum + (item.quantity || 1), 0);

        // Calculate boxes needed (max 3 prints per box)
        const parcels = calculateParcels(totalQty);

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
        body.append("shipping_address_collection[allowed_countries][0]", "US");
        body.append("shipping_address_collection[allowed_countries][1]", "CA");
        body.append("shipping_address_collection[allowed_countries][2]", "GB");
        body.append("shipping_address_collection[allowed_countries][3]", "AU");
        body.append("shipping_address_collection[allowed_countries][4]", "DE");
        body.append("shipping_address_collection[allowed_countries][5]", "FR");
        body.append("shipping_address_collection[allowed_countries][6]", "JP");
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

// Calculate parcels based on quantity (max 3 prints per box)
function calculateParcels(totalQty) {
  const parcels = [];
  let remaining = totalQty;

  while (remaining > 0) {
    const inThisBox = Math.min(remaining, 3);
    parcels.push(getBoxDimensions(inThisBox));
    remaining -= inThisBox;
  }

  return parcels;
}

// Get box dimensions and weight for N prints
function getBoxDimensions(printCount) {
  // 16x20 framed print specs:
  // - Each print is roughly 20x24" framed
  // - Thickness: ~2" per print (frame depth + packing)
  // - Weight: ~7 lbs per framed print

  const baseLength = 24; // inches
  const baseWidth = 20;  // inches
  const heightPerPrint = 2.5; // inches per print (frame + padding)
  const baseHeight = 1; // box padding
  const weightPerPrint = 7; // lbs per framed print

  return {
    length: baseLength,
    width: baseWidth,
    height: baseHeight + (heightPerPrint * printCount),
    distance_unit: "in",
    weight: weightPerPrint * printCount,
    mass_unit: "lb",
  };
}

