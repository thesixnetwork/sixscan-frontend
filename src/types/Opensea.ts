interface PaymentToken {
  id: number;
  symbol: string;
  address: string;
  image_url: string;
  name: string;
  decimals: number;
  eth_price: number;
  usd_price: number;
}

interface PrimaryAssetContracts {
  address: string;
  asset_contract_type: string;
  created_date: string;
  name: string;
  nft_version: string;
  opensea_version?: string;
  owner: number;
  schema_name: string;
  symbol: string;
  total_supply: string;
  description: string;
  external_link: string;
  image_url: string;
  default_to_fiat: boolean;
  dev_buyer_fee_basis_points: number;
  dev_seller_fee_basis_points: number;
  only_proxied_transfers: boolean;
  opensea_buyer_fee_basis_points: number;
  opensea_seller_fee_basis_points: number;
  buyer_fee_basis_points: number;
  seller_fee_basis_points: number;
  payout_address: string;
}

export interface Collection {
  editors: string[];
  payment_tokens: PaymentToken[];
  is_collection_offers_enabled: boolean;
  primary_asset_contracts: PrimaryAssetContracts[];
  stats: {
    one_hour_volume: number;
    one_hour_change: number;
    one_hour_sales: number;
    one_hour_sales_change: number;
    one_hour_average_price: number;
    one_hour_difference: number;
    six_hour_volume: number;
    six_hour_change: number;
    six_hour_sales: number;
    six_hour_sales_change: number;
    six_hour_average_price: number;
    six_hour_difference: number;
    one_day_volume: number;
    one_day_change: number;
    one_day_sales: number;
    one_day_sales_change: number;
    one_day_average_price: number;
    one_day_difference: number;
    seven_day_volume: number;
    seven_day_change: number;
    seven_day_sales: number;
    seven_day_average_price: number;
    seven_day_difference: number;
    thirty_day_volume: number;
    thirty_day_change: number;
    thirty_day_sales: number;
    thirty_day_average_price: number;
    thirty_day_difference: number;
    total_volume: number;
    total_sales: number;
    total_supply: number;
    count: number;
    num_owners: number;
    average_price: number;
    num_reports: number;
    market_cap: number;
    floor_price: number;
  };
  banner_image_url: string;
  chat_url?: string;
  created_date: string;
  default_to_fiat: boolean;
  description: string;
  dev_buyer_fee_basis_points: string;
  dev_seller_fee_basis_points: string;
  discord_url: string;
  display_data: {
    card_display_style: string;
  };
  external_url: string;
  featured: boolean;
  featured_image_url: string;
  hidden: boolean;
  safelist_request_status: string;
  image_url: string;
  is_subject_to_whitelist: boolean;
  large_image_url: string;
  medium_username?: string;
  name: string;
  only_proxied_transfers: boolean;
  opensea_buyer_fee_basis_points: string;
  opensea_seller_fee_basis_points: number;
  payout_address: string;
  require_email: boolean;
  short_description?: string;
  slug: string;
  telegram_url?: string;
  twitter_username?: string;
  instagram_username?: string;
  wiki_url?: string;
  is_nsfw: boolean;
  fees: {
    seller_fees: {
      [key: string]: number;
    };
    opensea_fees: {
      [key: string]: number;
    };
  };
  is_rarity_enabled: boolean;
  is_creator_fees_enforced: boolean;
}
