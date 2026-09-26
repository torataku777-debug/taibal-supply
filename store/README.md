# TAIBAL SUPPLY storefront

Hosted on the existing GitHub Pages site at `/store/`. The root B2B site is separate.

## Catalog and cart

The primary catalog contains lower and higher damage counters, each 6 pieces for JPY 5,480 including tax. Each lower/higher pair receives JPY 480 off. The discount repeats for matched pairs; identical products alone receive no discount. All amounts are planned retail prices, not live order offers. Ability and condition markers are JPY 3,280 each (two pieces per product); their pair receives JPY 580 off, totaling JPY 5,980. Each complete lower/higher/ability/condition group receives another JPY 480 off, totaling JPY 15,980. The case is JPY 9,480 and excluded from discounts. Discounts repeat for matched quantities without counting the same item twice within a rule.

The cart supports adding, changing quantities, removing, and persistence between pages using localStorage. Public and test carts have separate storage. It does not reserve inventory or place orders. Current status remains pre-launch; live payments are disabled.

## Source and checks

`python scripts/build-store.py` builds the homepage and four detail/legacy pages. Edit the generator rather than the generated HTML. CSS and JavaScript are edited directly.

`node scripts/test-cart.cjs` checks five-product discount arithmetic, quantity normalization and safe checkout routing. `node --check store/app.js` checks UI JavaScript syntax.

`cart-model.js` owns prices and discount rules. Keep it consistent with the page generator and the payment provider. Browser cart prices are display-only and must never be trusted as server-side prices.

## Payment integration

Existing Stripe links remain in `checkout-config.js`. With `?test=1`, only exact matching carts can open these links: one lower, one higher, or one of each (the existing damageFull link). Other quantities cannot use those links because the charged items would differ. The old tournamentFull link is no longer exposed.

A full live cart with arbitrary quantities requires server-created Checkout Sessions or exact preconfigured links for each supported combination. Validate SKUs, quantities, inventory and the pair discount on the server. Do not simply forward a multi-item cart to a single-product link. No new backend or live payment activation has been performed.

After inventory arrives, confirm actual colors and product photos, shipping and returns, business disclosures, and the live payment setup before enabling purchases. Product cards use manufacturer reference photos. The hero uses the owner-supplied tabletop styling image and explicitly distinguishes the illustrated case/markers from each six-piece product. The visual direction follows the owner-supplied September 26 reference: light stone, charcoal, Japanese serif display typography, and colorful metal products.

## Planned pricing basis — 2026-09-26

Lower/higher prices (5,480 each), damage pair (10,480), marker pair (5,980) and all-four total (15,980) preserve the provisional values in TAIBAL_SUPPLY_handoff_2026-09-25.md and the September 25 product copy. Marker singles (3,280) and case (9,480) are new provisional estimates, not previously approved final prices. No live checkout has been enabled.

Cost scenario: 40% wholesale discount; FX 158 JPY/USD; entire order USD 426.40; international shipping USD 100; customs 2,500 JPY, import tax 8,500 JPY, handling/remittance 3,000 JPY. These are assumptions from the previous planning model, not current quotes or verified tax calculations. Shared overhead is allocated by wholesale value. Domestic shipping assumption: 230 JPY for markers/counters, 750 JPY for the case; packing 80 JPY. Use previous conservative platform cost assumption 6.6% + 40 JPY, not a claim about current Stripe pricing.

Approximate cash contribution after those costs (including assumed import tax as a cash outflow): marker single 801 JPY / 24.4%; marker pair 1,410 JPY / 23.6%; all-four group 3,642 JPY / 22.8%; case 2,106 JPY / 22.2%. These are not accounting net profit, exclude labor/advertising/returns, and must be recalculated once shipment and tax treatment are known. The case does not include the separately sold insert or displayed dice/markers.

## Color cart — 2026-09-26

Counter cart lines now preserve the selected color and quantity, merging identical product/color pairs. The aggregate per-product cap stays 99. Discounts use product totals across colors. Product images and names follow the chosen color. Homepage additions and migrated v1 carts remain explicitly color-unselected; colors can be selected inside the cart. The v2 localStorage format migrates the old cart without inventing color choices. Adding a displayed counter color stops autoplay; failed manual image loads revert to the actual displayed color.

All variant cart checkout is disabled, including legacy test links: these Payment Links cannot carry the selected line-item colors. Existing aggregate checkout helper tests cover the old price protection only; the storefront never calls that old helper for variant lines. Marker/case color selection remains unimplemented; their galleries are reference photos, not SKU choices.
