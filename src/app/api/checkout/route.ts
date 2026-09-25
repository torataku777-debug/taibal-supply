import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getProduct } from "@/lib/products";

export async function POST(request: Request) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const checkoutEnabled = process.env.ENABLE_CHECKOUT === "true";

  if (!checkoutEnabled) {
    return NextResponse.json(
      { error: "Checkout is currently disabled." },
      { status: 403 }
    );
  }

  if (!secretKey) {
    return NextResponse.json(
      { error: "Stripe is not configured." },
      { status: 500 }
    );
  }

  const { slug, quantity = 1 } = await request.json();
  const product = getProduct(slug);
  if (!product) {
    return NextResponse.json({ error: "Product not found." }, { status: 404 });
  }

  const safeQuantity = Math.max(1, Math.min(Number(quantity) || 1, 5));
  const stripe = new Stripe(secretKey);
  const origin = new URL(request.url).origin;

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    locale: "ja",
    phone_number_collection: { enabled: true },
    shipping_address_collection: { allowed_countries: ["JP"] },
    line_items: [
      {
        quantity: safeQuantity,
        price_data: {
          currency: "jpy",
          unit_amount: product.price,
          product_data: {
            name: product.name,
            description: product.subtitle,
            metadata: { slug: product.slug },
          },
        },
      },
    ],
    metadata: {
      source: "taibal-supply-store",
      product_slug: product.slug,
    },
    success_url: `${origin}/thanks?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/products/${product.slug}`,
  });

  return NextResponse.json({ url: session.url });
}