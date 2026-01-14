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

        // Validate zip code
        if (!zipCode || zipCode.length < 5) {
          return new Response(JSON.stringify({ error: "Invalid zip code" }), {
            status: 400,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          });
        }

        // Calculate package details from cart
        const totalWeight = calculateWeight(items);
        const dimensions = calculateDimensions(items);

        // Call Shippo API for rates (zip only)
        const shippoResponse = await fetch("https://api.goshippo.com/shipments/", {
          method: "POST",
          headers: {
            "Authorization": `ShippoToken ${env.SHIPPO_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            address_from: {
              name: "Evan Rene",
              street1: "123 N Hollywood Way", // Evan's address in Burbank
              city: "Burbank",
              state: "CA",
              zip: "91505",
              country: "US",
            },
            address_to: {
              name: "Customer",
              street1: "123 Main St", // Dummy address, zip matters for rate
              city: zipCodeToCity(zipCode, country),
              state: zipCodeToState(zipCode, country),
              zip: zipCode,
              country: country,
            },
            parcels: [
              {
                length: dimensions.length,
                width: dimensions.width,
                height: dimensions.height,
                distance_unit: "in",
                weight: totalWeight,
                mass_unit: "oz",
              },
            ],
            async: false,
          }),
        });

        const shipment = await shippoResponse.json();

        // Extract and format rates
        const rates = shipment.rates
          .filter((r) => r.provider !== "UPS") // Remove carriers you don't want
          .map((r) => ({
            provider: r.provider,
            servicelevel_name: r.servicelevel.name,
            amount: parseFloat(r.amount),
            estimated_days: r.estimated_days,
            object_id: r.object_id,
          }))
          .sort((a, b) => a.amount - b.amount);

        return new Response(JSON.stringify({ rates }), {
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }

      // ===== CREATE CHECKOUT SESSION =====
      if (path === "/checkout") {
        const { items, shipping_rate_id } = await request.json();

        const body = new URLSearchParams();

        // Add line items
        items.forEach((item, index) => {
          body.append(`line_items[${index}][price]`, item.price);
          body.append(`line_items[${index}][quantity]`, item.quantity);
        });

        // Add shipping as a line item (or use Stripe shipping if available)
        // For now, we'll add it as a separate line item
        // You could also use Stripe's built-in shipping

        body.append("mode", "payment");
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

      // ===== ORIGINAL CHECKOUT (backward compat) =====
      const { items } = await request.json();

      const body = new URLSearchParams();
      items.forEach((item, index) => {
        body.append(`line_items[${index}][price]`, item.price);
        body.append(`line_items[${index}][quantity]`, item.quantity);
      });
      body.append("mode", "payment");
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

    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }
  },
};

// Helper: Calculate total weight from cart items
function calculateWeight(items) {
  // Each 16x20 print ~ 8oz framed, ~2oz unframed
  // You'll want to store this per product
  const weightPerItem = 8; // ounces
  return items.reduce((total, item) => total + (weightPerItem * item.quantity), 0);
}

// Helper: Calculate package dimensions
function calculateDimensions(items) {
  // For framed prints, assume ~20x24x2 inches
  // You can make this more sophisticated based on frame options
  return {
    length: 24,
    width: 20,
    height: 2,
  };
}

// Helper: Get state from US zip code (first 3 digits determine region)
function zipCodeToState(zip, country = "US") {
  if (country !== "US") return "";
  const prefix = parseInt(zip.substring(0, 3));

  // Rough state mapping by zip prefix
  if (prefix >= 900 && prefix <= 966) return "CA";
  if (prefix >= 100 && prefix <= 149) return "NY";
  if (prefix >= 700 && prefix <= 799) return "TX";
  if (prefix >= 600 && prefix <= 699) return "IL";
  if (prefix >= 326 && prefix <= 349) return "FL";
  if (prefix >= 400 && prefix <= 427) return "KY";
  if (prefix >= 750 && prefix <= 799) return "TX";
  if (prefix >= 800 && prefix <= 819) return "CO";

  // Default to CA for simplicity (most shipments will be west coast)
  return "CA";
}

// Helper: Get city from zip (dummy, Shippo mostly uses zip/state for rates)
function zipCodeToCity(zip, country = "US") {
  if (country === "US") return "Los Angeles";
  return "City";
}
