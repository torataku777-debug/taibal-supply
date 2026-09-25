export default function PrivacyPage() {
  return (
    <main className="contentPage">
      <div className="shell narrow">
        <div className="eyebrow">PRIVACY</div>
        <h1>プライバシーポリシー</h1>
        <div className="prose">
          <p>TAIBAL SUPPLYは、注文受付・発送・お問い合わせ対応などに必要な範囲で個人情報を取得します。</p>
          <h2>利用目的</h2>
          <p>商品の発送、代金決済、お問い合わせ対応、重要なサービス案内、不正利用防止のために利用します。</p>
          <h2>決済情報</h2>
          <p>オンライン決済はStripeを利用します。カード番号等の決済情報をTAIBAL SUPPLYのサーバーで直接保存する設計にはしません。</p>
          <h2>第三者提供</h2>
          <p>法令に基づく場合、配送・決済等のサービス提供に必要な場合を除き、本人の同意なく第三者へ提供しません。</p>
          <h2>お問い合わせ</h2>
          <p>個人情報に関するお問い合わせは、公開後のCONTACT窓口よりご連絡ください。</p>
        </div>
      </div>
    </main>
  );
}