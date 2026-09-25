import Link from "next/link";
import { products, yen } from "@/lib/products";

export default function Home() {
  return (
    <main>
      <section className="hero">
        <div className="shell heroGrid">
          <div className="heroCopy">
            <div className="eyebrow gold">PREMIUM TCG SUPPLY / JAPAN</div>
            <h1>PLAY BETTER.<br />GEAR BETTER.</h1>
            <p>
              競技プレイのために選ぶ、海外プレミアムTCGサプライ。
              日本で代替が少なく、機能・素材・設計に明確な理由がある製品だけをセレクトします。
            </p>
            <div className="heroActions">
              <a href="#collection" className="button goldFill">FIRST COLLECTION</a>
              <Link href="/about" className="button ghost">ABOUT TAIBAL</Link>
            </div>
            <div className="heroMeta">TCEVOLUTIONS — PREMIUM TOURNAMENT GEAR</div>
          </div>
          <div className="heroVisual" aria-label="TCEvolutions products">
            <img className="heroImage heroImageA" src={products[2].image} alt={products[2].imageAlt} />
            <img className="heroImage heroImageB" src={products[3].image} alt={products[3].imageAlt} />
            <img className="heroImage heroImageC" src={products[1].image} alt={products[1].imageAlt} />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell split">
          <div>
            <div className="eyebrow">WHY TAIBAL SELECTS</div>
            <h2>海外で人気。<br />それだけでは<br />選ばない。</h2>
            <p className="lead">
              日本で本当に使う理由があること。競技中の使いやすさに差があること。
              素材や加工に価格の理由があること。
            </p>
          </div>
          <div className="principles">
            <div><b>FUNCTION</b><span>対戦中の扱いやすさに明確な差がある。</span></div>
            <div><b>QUALITY</b><span>素材・加工・耐久性に理由がある。</span></div>
            <div><b>DIFFERENCE</b><span>日本で簡単に代替できない。</span></div>
            <div><b>SELECT</b><span>実際に使いたいと思えるギアだけを選ぶ。</span></div>
          </div>
        </div>
      </section>

      <section className="section brandSection" id="tce">
        <div className="shell brandGrid">
          <div className="brandGallery">
            <img src={products[2].image} alt={products[2].imageAlt} />
            <img src={products[1].image} alt={products[1].imageAlt} />
            <img src={products[3].image} alt={products[3].imageAlt} />
            <img src={products[0].image} alt={products[0].imageAlt} />
          </div>
          <div>
            <div className="eyebrow">FEATURED BRAND 01</div>
            <h2>TCEvolutions</h2>
            <p>
              CNC加工されたアルミニウムを用い、競技プレイでの視認性・操作性・耐久性を追求するTCGアクセサリーブランド。
            </p>
            <p className="brandQuote">
              Numeric Damage Counterを、単なる「金属ダメカン」ではなく、競技道具として選ぶ。
            </p>
            <p>
              TAIBAL SUPPLYではNumeric Damage Counterを中心に、Ability Used、Burn / Poisonまで
              盤面管理を一式で揃えられるラインを展開します。
            </p>
          </div>
        </div>
      </section>

      <section className="section" id="collection">
        <div className="shell">
          <div className="sectionHead">
            <div>
              <div className="eyebrow">FIRST COLLECTION</div>
              <h2>Tournament Gear.</h2>
            </div>
            <span className="status">COMING — OCTOBER 2026</span>
          </div>
          <div className="productGrid">
            {products.map((product) => (
              <Link className="productCard" href={`/products/${product.slug}`} key={product.slug}>
                <div className="productMedia">
                  <img src={product.image} alt={product.imageAlt} />
                  <span className="cardBadge">{product.badge ?? "COMING SOON"}</span>
                </div>
                <div className="productBody">
                  <div className="productCategory">{product.category}</div>
                  <h3>{product.shortName}</h3>
                  <p>{product.subtitle}</p>
                  <div className="price">{yen.format(product.price)}</div>
                  <div className="featureRow">
                    {product.features.slice(0, 3).map((feature) => (
                      <span key={feature}>{feature}</span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="darkSection">
        <div className="shell darkGrid">
          <div>
            <div className="eyebrow gold">FIRST DROP</div>
            <h2>OCTOBER 2026.</h2>
          </div>
          <div>
            <p className="darkLead">
              TCEvolutionsの新しいDamage Counter入荷に合わせて初回ラインナップを準備中です。
            </p>
            <p>
              新色を含む実物確認後に、カラー・数量・発売日を確定します。
              初回入荷は少量を予定しています。
            </p>
            <Link href="/faq" className="textLink">販売について確認する →</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell split">
          <div>
            <div className="eyebrow">PAYMENT</div>
            <h2>Fast, familiar checkout.</h2>
          </div>
          <div>
            <p className="lead">
              販売開始後はStripe Checkoutを利用し、カード決済を中心に、
              Apple Pay・PayPayを利用できる決済環境を整備します。
            </p>
            <p className="muted">
              PayPayはStripe側の加盟店審査承認後に有効化します。決済情報はTAIBAL SUPPLYのサーバーでは保持しません。
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}