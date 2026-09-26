# TAIBAL SUPPLY Store
Consumer-facing storefront for TAIBAL SUPPLY.

## Current status
- TCEvolutions First Drop landing/storefront
- Four initial SKUs
- Four Stripe test Payment Links are connected. Test checkout is available with `?test=1`; public purchase buttons remain disabled while inventory, product colors, legal details, and live Stripe verification are pending.
- Existing B2B GitHub Pages site remains unchanged at repository root

## Enable live checkout
After confirming inventory, colors, shipping and return terms, and live Stripe account status, replace all four test links in `store/checkout-config.js` with live Payment Links, set `mode` to `live` and `enabled` to `true`. Confirm the SKU names, prices, taxes, shipping collection, and payment methods in Stripe before publishing.

```js
window.TAIBAL_CHECKOUT = {
  mode: "live",
  enabled: true,
  lower: "https://buy.stripe.com/...",
  higher: "https://buy.stripe.com/...",
  damageFull: "https://buy.stripe.com/...",
  tournamentFull: "https://buy.stripe.com/..."
};
```

Stripe should be configured to enable cards, Apple Pay and PayPay where eligible.

## Pre-launch checks
- Replace TCE reference photography with photos of the actual received items after inventory arrives. Current set layouts show each component separately; they are not photos of the assembled bundle.
- Finalize color variants
- Finalize legal disclosure before sales open
- Add shipping policy and return policy
