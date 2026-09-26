const assert = require('node:assert/strict');
const {calculate,normalize,checkoutUrl,checkoutKey} = require('../store/cart-model.js');
const scenarios = [
  [{},0,0,0],
  [{lower:1},5480,0,5480],
  [{higher:1},5480,0,5480],
  [{lower:2},10960,0,10960],
  [{higher:2},10960,0,10960],
  [{lower:1,higher:1},10960,480,10480],
  [{lower:2,higher:1},16440,480,15960],
  [{lower:2,higher:2},21920,960,20960],
  [{lower:0,higher:1},5480,0,5480],
];
for(const [cart,subtotal,discount,total] of scenarios){
 const s=calculate(cart); assert.equal(s.subtotal,subtotal); assert.equal(s.discount,discount); assert.equal(s.total,total);
}
assert.deepEqual(normalize({lower:-1,higher:Infinity,unknown:100}),{lower:0,higher:0});
assert.deepEqual(normalize({lower:'2',higher:1000}),{lower:0,higher:99});
assert.equal(checkoutKey({lower:2,higher:1}),null);
const cfg={mode:'test',enabled:false,lower:'https://buy.stripe.com/test_lower',higher:'https://buy.stripe.com/test_higher',damageFull:'https://buy.stripe.com/test_pair'};
assert.equal(checkoutUrl({lower:1},cfg,false),null);
assert.equal(checkoutUrl({lower:1,higher:1},cfg,true),cfg.damageFull);
assert.equal(checkoutUrl({lower:2,higher:1},cfg,true),null);
assert.equal(checkoutUrl({lower:1},{...cfg,lower:'https://evil.example/test_lower'},true),null);
assert.equal(checkoutUrl({lower:1},{mode:'live',enabled:true,lower:cfg.lower},false),null);
assert.equal(checkoutUrl({lower:1},{mode:'live',enabled:true,lower:'https://buy.stripe.com/live_lower'},false),'https://buy.stripe.com/live_lower');
console.log('PASS: cart totals, same-type exclusions, repeated pairs, removal, input normalization, checkout amount protection, and test/live separation');
