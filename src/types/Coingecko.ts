export interface CoinGeckoPrice {
  [key: string]: {
    usd: number;
    usd_market_cap: number;
    usd_24h_change: number;
  };
}
