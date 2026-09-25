const recommendedProducts=[
  {
    id:"damageFull",
    jpName:"ダメージカウンター フルセット",
    enName:"Damage Counter Full Set",
    price:"¥10,480",
    cat:"まず最初におすすめ",
    lead:"10〜240までを、これひとつで。",
    desc:"LowerとHigherをまとめた、TCEを初めて使う方におすすめの基本セット。",
    contents:[
      "ローダメージ ダメージカウンターセット × 1",
      "ハイダメージ ダメージカウンターセット × 1",
      "合計12個"
    ],
    specs:["10〜240対応","12個セット","基本構成"],
    img:"https://tcevolutions.com/cdn/shop/files/Damage_Counter_Dice_TCEVOLUTIONS_19.jpg?v=1742269932&width=1200"
  },
  {
    id:"tournamentFull",
    jpName:"トーナメント フルキット",
    enName:"Tournament Full Kit",
    price:"¥15,980",
    cat:"競技プレイヤー向け",
    lead:"競技プレイに必要な盤面管理を、まとめて一式。",
    desc:"ダメージ管理だけでなく、Ability Used、Burn / Poisonまでまとめて揃えられるフルキット。",
    contents:[
      "ローダメージ ダメージカウンターセット × 1",
      "ハイダメージ ダメージカウンターセット × 1",
      "Ability Used Marker Set × 1",
      "Burn & Poison Marker Set × 1"
    ],
    specs:["ダメージ管理","Ability Used","Burn / Poison"],
    img:"https://tcevolutions.com/cdn/shop/files/bk-closeup-metal-pokemon-tcg-markers-aluminum-us.jpg?v=1768006715&width=1200"
  }
];

const singleProducts=[
  {
    id:"lower",
    jpName:"ローダメージ ダメージカウンターセット",
    enName:"Lower Numeric Damage Counter Set",
    price:"¥5,480",
    cat:"単品 / 低ダメージ帯",
    lead:"10〜120のダメージ管理を、より見やすく。",
    desc:"10〜120のダメージ帯を管理するNumeric Damage Counter 6個セット。",
    contents:["Lower Numeric Damage Counter × 6"],
    specs:["10〜120対応","6個セット","CNC加工アルミ"],
    img:"https://tcevolutions.com/cdn/shop/files/Damage_Counter_Dice_TCEVOLUTIONS_19.jpg?v=1742269932&width=1200"
  },
  {
    id:"higher",
    jpName:"ハイダメージ ダメージカウンターセット",
    enName:"Higher Numeric Damage Counter Set",
    price:"¥5,480",
    cat:"単品 / 高ダメージ帯",
    lead:"130〜240の高ダメージ帯にも、スマートに対応。",
    desc:"130〜240の高ダメージ帯を管理するNumeric Damage Counter 6個セット。",
    contents:["Higher Numeric Damage Counter × 6"],
    specs:["130〜240対応","6個セット","CNC加工アルミ"],
    img:"https://tcevolutions.com/cdn/shop/files/Damage_Counter_Dice_TCEVOLUTIONS_2.jpg?v=1742347748&width=1200"
  }
];

const cfg=window.TAIBAL_CHECKOUT||{};
const testMode=cfg.mode==="test" && new URLSearchParams(location.search).get("test")==="1";
const checkoutEnabled=cfg.enabled===true || testMode;

function renderProduct(p){
  const hasLink=Boolean(cfg[p.id]);
  const enabled=checkoutEnabled && hasLink;
  const buttonLabel=testMode&&hasLink?"テスト決済へ":enabled?"購入する":"販売開始前";
  return `<article class="card">
    <div class="card-media">
      <img src="${p.img}" alt="${p.jpName}">
      <span class="badge">${testMode?"SANDBOX":"COMING SOON"}</span>
    </div>
    <div class="card-body">
      <div class="card-cat">${p.cat}</div>
      <h3>${p.jpName}</h3>
      <div class="en-name">${p.enName}</div>
      <div class="price">${p.price}<span>（税込）</span></div>
      <p class="product-lead">${p.lead}</p>
      <div class="desc">${p.desc}</div>
      <div class="contents-box">
        <b>セット内容</b>
        <ul>${p.contents.map(x=>`<li>${x}</li>`).join("")}</ul>
      </div>
      <div class="specs">${p.specs.map(s=>`<span class="spec">${s}</span>`).join("")}</div>
      <button class="buy" data-id="${p.id}" ${enabled?"":"disabled"}>${buttonLabel}</button>
    </div>
  </article>`;
}

document.querySelector("#recommended-grid").innerHTML=recommendedProducts.map(renderProduct).join("");
document.querySelector("#single-grid").innerHTML=singleProducts.map(renderProduct).join("");

document.addEventListener("click",e=>{
  const b=e.target.closest(".buy");
  if(!b||b.disabled)return;
  const u=cfg[b.dataset.id];
  if(u)location.href=u;
});