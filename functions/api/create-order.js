/**
 * Razorpay Order Creation — Cloudflare Pages Function
 *
 * Why this exists:
 *   Client-side checkout passes `amount` from devtools-editable JS. A sophisticated
 *   visitor could change ₹14,800 → ₹100. This function moves the price table to a
 *   server-trusted location, calls Razorpay API to create an order with the locked
 *   amount, and returns just the order_id + display data back to the browser.
 *
 * Environment variables required (Cloudflare Pages → Settings → Environment variables):
 *   RAZORPAY_KEY_ID       — public key (rzp_live_xxx or rzp_test_xxx)
 *   RAZORPAY_KEY_SECRET   — secret key (NEVER expose in client JS)
 *
 * Activation:
 *   In store.html, set USE_SERVER_ORDER = true. Until then, this file is dormant.
 */

const STUDIO_PRODUCTS = {
  'kuri-pendant':      { name: 'Kuri Pendant',      amount: 1480000 }, // ₹14,800
  'bhoomi-wall-light': { name: 'Bhoomi Wall Light', amount:  950000 }, // ₹9,500
  'matti-table-light': { name: 'Matti Table Light', amount:  720000 }, // ₹7,200
};

export async function onRequestPost({ request, env }) {
  let body;
  try {
    body = await request.json();
  } catch {
    return jsonError('Invalid request body', 400);
  }

  const productId = body.product_id;
  const product = STUDIO_PRODUCTS[productId];
  if (!product) {
    return jsonError('Unknown product', 400);
  }

  if (!env.RAZORPAY_KEY_ID || !env.RAZORPAY_KEY_SECRET) {
    return jsonError('Razorpay credentials not configured', 500);
  }

  const credentials = btoa(`${env.RAZORPAY_KEY_ID}:${env.RAZORPAY_KEY_SECRET}`);
  const receiptId = `${productId.slice(0, 20)}-${Date.now()}`;

  const orderRes = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: product.amount,
      currency: 'INR',
      receipt: receiptId,
      notes: {
        product_id: productId,
        product_name: product.name,
        source: 'studionalme.com',
      },
    }),
  });

  if (!orderRes.ok) {
    const errText = await orderRes.text().catch(() => '');
    return jsonError(`Razorpay API error: ${errText.slice(0, 200)}`, 502);
  }

  const order = await orderRes.json();

  return new Response(JSON.stringify({
    order_id: order.id,
    amount: order.amount,
    currency: order.currency,
    key_id: env.RAZORPAY_KEY_ID,    // safe — public key
    product_name: product.name,
    receipt: order.receipt,
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
  });
}

function jsonError(message, status) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
