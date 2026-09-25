import Link from "next/link";

export default function ThanksPage() {
  return (
    <main className="contentPage centerPage">
      <div className="shell narrow">
        <div className="eyebrow">ORDER COMPLETE</div>
        <h1>ご注文ありがとうございます。</h1>
        <p className="lead">決済が完了しました。注文情報を確認後、発送準備を進めます。</p>
        <Link className="button darkButton" href="/">ショップへ戻る</Link>
      </div>
    </main>
  );
}