# TAIBAL SUPPLY Store
Consumer-facing storefront for TAIBAL SUPPLY.

## Current status
- TCEvolutions First Drop landing/storefront
- Four initial SKUs
- Checkout buttons are disabled until Stripe Payment Links are connected
- Existing B2B GitHub Pages site remains unchanged at repository root

## Enable checkout
Edit `store/checkout-config.js` and paste one Stripe Payment Link per SKU.

```js
window.TAIBAL_CHECKOUT = {
  lower: "https://buy.stripe.com/...",
  higher: "https://buy.stripe.com/...",
  damageFull: "https://buy.stripe.com/...",
  tournamentFull: "https://buy.stripe.com/..."
};
```

Stripe should be configured to enable cards, Apple Pay and PayPay where eligible.

## Pre-launch checks
- Replace temporary TCE stock photography with TAIBAL original photography after inventory arrives
- Finalize color variants
- Finalize legal disclosure before sales open
- Add shipping policy and return policy
