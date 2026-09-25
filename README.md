# TAIBAL SUPPLY Store

Independent storefront for TAIBAL SUPPLY.

## Stack
- Next.js App Router
- Stripe Checkout
- Card / Apple Pay / PayPay via Stripe payment-method configuration
- TCEvolutions First Drop

## Local
```bash
cp .env.example .env.local
npm run dev
```

Keep `ENABLE_CHECKOUT=false` until inventory, colors, shipping and Stripe production settings are finalized.

## Launch checklist
1. Replace TCE stock images with TAIBAL photography after arrival.
2. Reconcile legal page with the existing BASE disclosure.
3. Configure Stripe account and production keys.
4. Submit/complete PayPay review in Stripe.
5. Verify Apple Pay / card checkout.
6. Confirm shipping policy and inventory.
7. Set ENABLE_CHECKOUT=true.