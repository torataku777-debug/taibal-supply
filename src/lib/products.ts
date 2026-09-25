export type Product = {
  slug: string;
  name: string;
  shortName: string;
  price: number;
  subtitle: string;
  description: string;
  features: string[];
  image: string;
  imageAlt: string;
  category: string;
  badge?: string;
  saleStatus: "coming-soon" | "active";
};

export const products: Product[] = [
  {
    slug: "damage-counter-full-set",
    name: "TCEvolutions Damage Counter Full Set",
    shortName: "Damage Counter Full Set",
    price: 10480,
    subtitle: "10–240 フルダメージカウンターセット",
    description:
      "Lower + Higherを同色で揃え、10〜240までを一式でカバーするTAIBAL SUPPLY推奨セットです。",
    features: ["Lower × 1", "Higher × 1", "合計12個", "同色セット"],
    image:
      "https://tcevolutions.com/cdn/shop/files/Damage_Counter_Dice_TCEVOLUTIONS_19.jpg?v=1742269932&width=1600",
    imageAlt: "TCEvolutions Numeric Damage Counter",
    category: "TOURNAMENT GEAR",
    badge: "TAIBAL SELECT",
    saleStatus: "coming-soon",
  },
  {
    slug: "tournament-full-kit",
    name: "TCEvolutions Tournament Full Kit",
    shortName: "Tournament Full Kit",
    price: 15980,
    subtitle: "Damage / Ability / Condition フルセット",
    description:
      "ダメージ、Ability使用状況、Burn / Poisonまで、対戦中の主要な盤面管理をまとめたTournament Gearセットです。",
    features: [
      "Lower × 1",
      "Higher × 1",
      "Ability Used Marker × 1 set",
      "Burn & Poison Marker × 1 set",
    ],
    image:
      "https://tcevolutions.com/cdn/shop/files/bk-closeup-metal-pokemon-tcg-markers-aluminum-us.jpg?v=1768006715&width=1600",
    imageAlt: "TCEvolutions tournament markers",
    category: "TOURNAMENT GEAR",
    badge: "FULL KIT",
    saleStatus: "coming-soon",
  },
  {
    slug: "lower-numeric-damage-counter",
    name: "TCEvolutions Lower Numeric Damage Counter Set",
    shortName: "Lower Numeric Damage Counter",
    price: 5480,
    subtitle: "CNCアルミ ダメージカウンター 10–120",
    description:
      "10〜120のダメージ帯を6個のCNC加工アルミカウンターで管理します。",
    features: ["10–120", "6個セット", "CNCアルミ", "レーザー刻印"],
    image:
      "https://tcevolutions.com/cdn/shop/files/Damage_Counter_Dice_TCEVOLUTIONS_19.jpg?v=1742269932&width=1600",
    imageAlt: "TCEvolutions Lower Numeric Damage Counter",
    category: "DAMAGE COUNTER",
    saleStatus: "coming-soon",
  },
  {
    slug: "higher-numeric-damage-counter",
    name: "TCEvolutions Higher Numeric Damage Counter Set",
    shortName: "Higher Numeric Damage Counter",
    price: 5480,
    subtitle: "CNCアルミ ダメージカウンター 130–240",
    description:
      "130〜240の高ダメージ帯を6個で管理するHigh-Count Numeric Counterです。",
    features: ["130–240", "6個セット", "6061-T6アルミ", "Lowerと同色運用"],
    image:
      "https://tcevolutions.com/cdn/shop/files/Damage_Counter_Dice_TCEVOLUTIONS_2.jpg?v=1742347748&width=1600",
    imageAlt: "TCEvolutions Higher Numeric Damage Counter",
    category: "DAMAGE COUNTER",
    saleStatus: "coming-soon",
  },
];

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}

export const yen = new Intl.NumberFormat("ja-JP", {
  style: "currency",
  currency: "JPY",
  maximumFractionDigits: 0,
});