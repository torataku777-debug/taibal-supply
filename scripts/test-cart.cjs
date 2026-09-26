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
  [{ability:1},3280,0,3280],
  [{condition:2},6560,0,6560],
  [{ability:1,condition:1},6560,580,5980],
  [{lower:1,higher:1,ability:1,condition:1},17520,1540,15980],
  [{lower:2,higher:2,ability:1,condition:1},28480,2020,26460],
  [{lower:1,higher:1,ability:2,condition:2},24080,2120,21960],
  [{lower:2,higher:2,ability:2,condition:2},35040,3080,31960],
  [{lower:1,higher:1,ability:1,condition:1,case:1},27000,1540,25460],
  [{lower:1,higher:1,ability:1},14240,480,13760],
  [{case:2},18960,0,18960],
];
for(const [cart,subtotal,discount,total] of scenarios){
 const s=calculate(cart); assert.equal(s.subtotal,subtotal); assert.equal(s.discount,discount); assert.equal(s.total,total);
}
assert.deepEqual(normalize({lower:-1,higher:Infinity,unknown:100}),{lower:0,higher:0,ability:0,condition:0,case:0});
assert.deepEqual(normalize({lower:'2',higher:1000}),{lower:0,higher:99,ability:0,condition:0,case:0});
assert.equal(checkoutKey({lower:2,higher:1}),null);
const cfg={mode:'test',enabled:false,lower:'https://buy.stripe.com/test_lower',higher:'https://buy.stripe.com/test_higher',damageFull:'https://buy.stripe.com/test_pair'};
assert.equal(checkoutUrl({lower:1},cfg,false),null);
assert.equal(checkoutUrl({lower:1,higher:1},cfg,true),cfg.damageFull);
assert.equal(checkoutUrl({lower:2,higher:1},cfg,true),null);
assert.equal(checkoutUrl({lower:1},{...cfg,lower:'https://evil.example/test_lower'},true),null);
assert.equal(checkoutUrl({lower:1},{mode:'live',enabled:true,lower:cfg.lower},false),null);
assert.equal(checkoutUrl({lower:1},{mode:'live',enabled:true,lower:'https://buy.stripe.com/live_lower'},false),'https://buy.stripe.com/live_lower');
console.log('PASS: cart totals, same-type exclusions, repeated pairs, removal, input normalization, checkout amount protection, and test/live separation');

for(const id of ['ability','condition','case']) { assert.equal(checkoutUrl({lower:1,[id]:1},cfg,true),null);assert.equal(checkoutUrl({lower:1,higher:1,[id]:1},cfg,true),null); }
console.log('PASS: marker/full discounts, repeated and unequal quantities, case exclusions, accessory checkout protection');
