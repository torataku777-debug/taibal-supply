const cfg=window.TAIBAL_CHECKOUT||{};
const productId=document.body.dataset.productId;
const testMode=cfg.mode==="test"&&new URLSearchParams(location.search).get("test")==="1";
const enabled=(cfg.enabled===true||testMode)&&Boolean(cfg[productId]);
const buy=document.querySelector("[data-detail-buy]");
const price=document.querySelector(".detail-price")?.childNodes?.[0]?.textContent?.trim()||"";
const productName=document.querySelector(".detail-title")?.textContent?.trim()||"商品";
if(buy){
  buy.hidden=!enabled;
  buy.disabled=!enabled;
  buy.textContent=testMode&&cfg[productId]?"テスト決済へ":"購入する";
  buy.addEventListener("click",()=>{if(enabled)location.href=cfg[productId];});
}
if(enabled){
  document.body.classList.add("has-mobile-buybar");
  const bar=document.createElement("div");
  bar.className="mobile-buybar";
  bar.innerHTML=`<div class="mobile-buybar-info"><span>${productName}</span><b>${price}</b></div><button>${testMode?"テスト決済へ":"購入する"}</button>`;
  bar.querySelector("button").addEventListener("click",()=>{location.href=cfg[productId];});
  document.body.appendChild(bar);
}
document.querySelectorAll("[data-test-link]").forEach(a=>{
  if(testMode)a.href=a.href+(a.href.includes("?")?"&":"?")+"test=1";
});
