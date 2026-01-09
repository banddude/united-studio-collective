export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    try {
      const { items } = await request.json();
      
      // Items should be: [{ price: "price_123...", quantity: 1 }]
      
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
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });

    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }
  },
};
