# TAIBAL SUPPLY storefront

Hosted on the existing GitHub Pages site at `/store/`. The root B2B site is separate.

## Catalog and cart

The primary catalog contains lower and higher damage counters, each 6 pieces for JPY 5,480 including tax. Each lower/higher pair receives JPY 480 off. The discount repeats for matched pairs; identical products alone receive no discount. Marker prices are not defined, so markers are preview-only.

The cart supports adding, changing quantities, removing, and persistence between pages using localStorage. Public and test carts have separate storage. It does not reserve inventory or place orders. Current status remains pre-launch; live payments are disabled.

## Source and checks

`python scripts/build-store.py` builds the homepage and four detail/legacy pages. Edit the generator rather than the generated HTML. CSS and JavaScript are edited directly.

`node scripts/test-cart.cjs` checks discount arithmetic, quantity normalization and safe checkout routing. `node --check store/app.js` checks UI JavaScript syntax.

`cart-model.js` owns prices and discount rules. Keep it consistent with the page generator and the payment provider. Browser cart prices are display-only and must never be trusted as server-side prices.

## Payment integration

Existing Stripe links remain in `checkout-config.js`. With `?test=1`, only exact matching carts can open these links: one lower, one higher, or one of each (the existing damageFull link). Other quantities cannot use those links because the charged items would differ. The old tournamentFull link is no longer exposed.

A full live cart with arbitrary quantities requires server-created Checkout Sessions or exact preconfigured links for each supported combination. Validate SKUs, quantities, inventory and the pair discount on the server. Do not simply forward a multi-item cart to a single-product link. No new backend or live payment activation has been performed.

After inventory arrives, confirm actual colors and product photos, shipping and returns, business disclosures, and the live payment setup before enabling purchases. Reference photos currently come from TCEvolutions; no generated product imagery is used.
