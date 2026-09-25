const cfg=window.TAIBAL_CHECKOUT||{};
const productId=document.body.dataset.productId;
const testMode=cfg.mode==="test"&&new URLSearchParams(location.search).get("test")==="1";
const enabled=(cfg.enabled===true||testMode)&&Boolean(cfg[productId]);
const buy=document.querySelector("[data-detail-buy]");
const price=document.querySelector(".detail-price")?.childNodes?.[0]?.textContent?.trim()||"";
const productName=document.querySelector(".detail-title")?.textContent?.trim()||"商品";
if(buy){
  buy.disabled=!enabled;
  buy.textContent=testMode&&cfg[productId]?"テスト決済へ":enabled?"購入する":"2026年10月 販売予定";
  buy.addEventListener("click",()=>{if(enabled)location.href=cfg[productId];});
}
const bar=document.createElement("div");
bar.className="mobile-buybar";
bar.innerHTML=`<div class="mobile-buybar-info"><span>${productName}</span><b>${price}</b></div><button ${enabled?"":"disabled"}>${testMode&&cfg[productId]?"テスト決済へ":enabled?"購入する":"販売予定"}</button>`;
bar.querySelector("button").addEventListener("click",()=>{if(enabled)location.href=cfg[productId];});
document.body.appendChild(bar);
document.querySelectorAll("[data-test-link]").forEach(a=>{
  if(testMode)a.href=a.href+(a.href.includes("?")?"&":"?")+"test=1";
});