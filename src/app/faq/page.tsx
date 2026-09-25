const faqs = [
  ["TAIBAL SUPPLYとは何ですか？", "海外のTCGサプライを日本市場向けに選定して輸入販売するSELECT SHOPです。"],
  ["TCEvolutionsの商品は正規品ですか？", "TCEvolutionsから直接仕入れる新品を、TAIBAL SUPPLYが日本国内で受け取り・検品して販売します。"],
  ["日本総代理店ですか？", "現時点では日本総代理店・独占代理店ではありません。"],
  ["海外から購入者へ直接届きますか？", "いいえ。TAIBAL SUPPLYが日本国内で受け取り、検品後に国内発送します。"],
  ["発売日はいつですか？", "TCEvolutionsの新しいDamage Counter入荷後、カラー・数量・送料を確定して販売開始予定です。First Dropは2026年10月を予定しています。"],
  ["どの支払い方法を予定していますか？", "カード決済を中心に、Stripe Checkoutを利用してApple Pay・PayPayにも対応する予定です。PayPayはStripe側の加盟店審査承認後に有効化します。"],
];

export default function FaqPage() {
  return (
    <main className="contentPage">
      <div className="shell narrow">
        <div className="eyebrow">FAQ</div>
        <h1>Before Your Order.</h1>
        <div className="faqList">
          {faqs.map(([q, a]) => (
            <details key={q}>
              <summary>{q}</summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </div>
    </main>
  );
}