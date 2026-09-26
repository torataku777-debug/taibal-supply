const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const m=require('../store/cart-model.js');
const context={window:{}};
vm.runInNewContext(fs.readFileSync(require.resolve('../store/checkout-config.js'),'utf8'),context);
const cfg=context.window.TAIBAL_CHECKOUT;
const ids=['lower','higher','ability','condition','case'];
const accepted=new Map([
 ['10000',['lower',5830]],['01000',['higher',5830]],
 ['00100',['ability',3630]],['00010',['condition',3630]],
 ['00001',['case',10980]],['11000',['damageFull',10480]],
 ['00110',['markerPair',6330]],['11110',['tournamentFull',15980]]
]);
for(let n=0;n<243;n++){
 let rest=n; const quantities=ids.map(()=>{const q=rest%3;rest=Math.floor(rest/3);return q;});
 const lines=ids.map((id,i)=>({id,quantity:quantities[i],color:id==='lower'?'red':id==='higher'?'gold':''}));
 const expected=accepted.get(quantities.join(''));
 const target=m.checkoutLinesUrl(lines,cfg);
 if(!expected){assert.equal(target,null,quantities.join(''));continue;}
 const url=new URL(target);
 assert.equal(url.origin+url.pathname,cfg[expected[0]]);
 assert.equal(url.searchParams.get('locale'),'ja');
 assert.match(url.searchParams.get('client_reference_id'),/^tce_[a-z0-9_]+$/);
 assert(!url.pathname.startsWith('/test_'));
 const state=m.calculateLines(lines);
 assert.equal(state.total+(state.total<10000?350:0),expected[1]);
}
for(const color of Object.keys(m.colors)){
 const lines=[{id:'lower',color,quantity:1}];
 assert(new URL(m.checkoutLinesUrl(lines,cfg)).searchParams.get('client_reference_id').includes('lower_'+color+'_1'));
 assert.equal(m.checkoutLinesUrl(lines,{...cfg,enabled:false}),null);
 assert.equal(m.checkoutLinesUrl(lines,{...cfg,mode:'test'}),null);
 assert.equal(m.checkoutLinesUrl(lines,{...cfg,lower:'https://evil.example/checkout'}),null);
 assert.equal(m.checkoutLinesUrl(lines,{...cfg,lower:'https://buy.stripe.com/test_example'}),null);
}
assert.equal(m.checkoutLinesUrl([{id:'lower',quantity:1}],cfg),null);
assert.equal(m.checkoutLinesUrl([{id:'lower',color:'red',quantity:1},{id:'lower',color:'blue',quantity:1}],cfg),null);
console.log('PASS: 243 cart combinations, 8 exact payment routes and totals, 10 colors, incomplete colors, wrong-mode and foreign-host protection');
