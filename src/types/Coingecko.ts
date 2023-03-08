export interface CoinGeckoPriceResponse {
  [key: string]: CoinGeckoPrice;
}

export interface CoinGeckoPrice {
  usd: number;
  usd_market_cap: number;
  usd_24h_change: number;
}
