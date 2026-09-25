export default function LegalPage() {
  return (
    <main className="contentPage">
      <div className="shell narrow">
        <div className="eyebrow">LEGAL</div>
        <h1>特定商取引法に基づく表記</h1>
        <dl className="legalTable">
          <div><dt>販売事業者</dt><dd>TAIBAL / TAIBAL SUPPLY</dd></div>
          <div><dt>運営責任者</dt><dd>虎谷 拓</dd></div>
          <div><dt>所在地・電話番号</dt><dd>請求があった場合、遅滞なく開示いたします。</dd></div>
          <div><dt>販売価格</dt><dd>各商品ページに税込価格を表示します。</dd></div>
          <div><dt>商品代金以外の必要料金</dt><dd>送料その他の費用が発生する場合は、購入手続き前に表示します。</dd></div>
          <div><dt>支払方法</dt><dd>Stripe Checkoutを利用したクレジットカード等のオンライン決済。</dd></div>
          <div><dt>支払時期</dt><dd>注文確定時に決済されます。</dd></div>
          <div><dt>商品の引渡時期</dt><dd>在庫商品は商品ページ記載の発送予定に従います。予約商品は入荷後、検品のうえ順次発送します。</dd></div>
          <div><dt>返品・交換</dt><dd>商品の性質上、お客様都合による返品は原則としてお受けしていません。初期不良・誤配送の場合は状態確認のうえ対応します。</dd></div>
        </dl>
        {process.env.NODE_ENV !== "production" && (
          <p className="devNote">公開前に既存BASEの特商法表記と内容を一致確認します。</p>
        )}
      </div>
    </main>
  );
}