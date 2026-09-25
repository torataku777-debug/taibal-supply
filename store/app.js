const officialImages={
  lower:"https://tcevolutions.com/cdn/shop/files/Damage_Counter_Dice_TCEVOLUTIONS_3.jpg?v=1742269932&width=1200",
  higher:"https://tcevolutions.com/cdn/shop/files/Damage_Counter_Dice_TCEVOLUTIONS_2.jpg?v=1742347748&width=1200",
  ability:"https://tcevolutions.com/cdn/shop/files/bk-closeup-metal-pokemon-tcg-markers-aluminum-us.jpg?v=1768006715&width=1200",
  condition:"https://tcevolutions.com/cdn/shop/files/7B2783A1-62B4-43B6-96C0-BC7A64C24586.png?v=1782411405&width=1200"
};

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
      "ローダメージ ダメージカウンターセット × 1（6個）",
      "ハイダメージ ダメージカウンターセット × 1（6個）",
      "合計12個"
    ],
    specs:["10〜240対応","12個セット","Lower + Higher"],
    visualSummary:"Lower 6個 + Higher 6個 = 合計12個",
    media:[
      {src:officialImages.lower,label:"ローダメージ",count:"6個"},
      {src:officialImages.higher,label:"ハイダメージ",count:"6個"}
    ]
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
      "ローダメージ ダメージカウンターセット × 1（6個）",
      "ハイダメージ ダメージカウンターセット × 1（6個）",
      "Ability Used Marker Set × 1（2枚）",
      "Burn & Poison Marker Set × 1（2枚）"
    ],
    specs:["Damage","Ability Used","Burn / Poison"],
    visualSummary:"Lower 6個 + Higher 6個 + Ability 2枚 + Burn / Poison 2枚",
    media:[
      {src:officialImages.lower,label:"ローダメージ",count:"6個"},
      {src:officialImages.higher,label:"ハイダメージ",count:"6個"},
      {src:officialImages.ability,label:"Ability Used",count:"2枚"},
      {src:officialImages.condition,label:"Burn & Poison",count:"2枚"}
    ]
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
    contents:[
      "10〜60用 12mmカウンター × 4",
      "70〜120用 13mmカウンター × 2",
      "合計6個"
    ],
    specs:["10〜120対応","6個セット","CNC加工アルミ"],
    visualSummary:"10〜120対応 / 6個セット",
    media:[{src:officialImages.lower,label:"Lower Numeric Damage Counter",count:"6個"}]
  },
  {
    id:"higher",
    jpName:"ハイダメージ ダメージカウンターセット",
    enName:"Higher Numeric Damage Counter Set",
    price:"¥5,480",
    cat:"単品 / 高ダメージ帯",
    lead:"130〜240の高ダメージ帯にも、スマートに対応。",
    desc:"130〜240の高ダメージ帯を管理するNumeric Damage Counter 6個セット。",
    contents:[
      "130〜180用 13mmカウンター × 4",
      "190〜240用 14mmカウンター × 2",
      "合計6個"
    ],
    specs:["130〜240対応","6個セット","6061-T6アルミ"],
    visualSummary:"130〜240対応 / 6個セット",
    media:[{src:officialImages.higher,label:"Higher Numeric Damage Counter",count:"6個"}]
  }
];

const cfg=window.TAIBAL_CHECKOUT||{};
const testMode=cfg.mode==="test" && new URLSearchParams(location.search).get("test")==="1";
const checkoutEnabled=cfg.enabled===true || testMode;

function renderMedia(media){
  const cls=media.length===1?"actual-product-grid single":media.length===2?"actual-product-grid double":"actual-product-grid quad";
  return `<div class="${cls}">${media.map(m=>`
    <figure class="actual-product">
      <div class="actual-image-wrap"><img src="${m.src}" alt="${m.label} actual TCEvolutions product"></div>
      <figcaption><b>${m.label}</b><span>${m.count}</span></figcaption>
    </figure>`).join("")}</div>`;
}

function renderProduct(p){
  const hasLink=Boolean(cfg[p.id]);
  const enabled=checkoutEnabled && hasLink;
  const buttonLabel=testMode&&hasLink?"テスト決済へ":enabled?"購入する":"販売開始前";
  return `<article class="card">
    <div class="card-media precise-media">
      ${renderMedia(p.media)}
      <span class="badge">${testMode?"テスト環境":"初回入荷準備中"}</span>
      <span class="official-photo-tag">TCE公式商品写真</span>
      <div class="set-visual-summary">${p.visualSummary}</div>
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