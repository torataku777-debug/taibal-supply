import { notFound } from "next/navigation";
import CheckoutButton from "@/components/CheckoutButton";
import { getProduct, products, yen } from "@/lib/products";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const checkoutEnabled =
    process.env.ENABLE_CHECKOUT === "true" && product.saleStatus === "active";

  return (
    <main className="productPage">
      <div className="shell productDetail">
        <div className="productDetailMedia">
          <img src={product.image} alt={product.imageAlt} />
          <span className="cardBadge">COMING SOON</span>
        </div>
        <div className="productDetailCopy">
          <div className="eyebrow">{product.category}</div>
          <h1>{product.shortName}</h1>
          <p className="productSubtitle">{product.subtitle}</p>
          <div className="detailPrice">{yen.format(product.price)}</div>
          <p className="productDescription">{product.description}</p>

          <div className="detailFeatures">
            {product.features.map((feature) => (
              <div key={feature}>{feature}</div>
            ))}
          </div>

          <CheckoutButton slug={product.slug} disabled={!checkoutEnabled} />

          <p className="purchaseNote">
            2026年10月初回入荷予定。新色・数量・入荷日を確認後に販売開始します。
            商品はTCEvolutionsから直接仕入れ、日本国内で検品後に発送します。
          </p>
        </div>
      </div>

      <section className="section softSection">
        <div className="shell split">
          <div>
            <div className="eyebrow">WHY THIS GEAR</div>
            <h2>競技道具として選ぶ。</h2>
          </div>
          <div>
            <p className="lead">
              TAIBAL SUPPLYでは、TCEvolutions製品を「高級な金属サプライ」ではなく、
              盤面の視認性と操作性を高めるTournament Gearとしてセレクトしています。
            </p>
            <p className="muted">
              初回入荷後は、メーカー素材だけでなくTAIBAL SUPPLY独自撮影へ順次差し替えます。
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}