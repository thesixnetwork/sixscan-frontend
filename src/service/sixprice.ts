import { CoinGeckoPrice, CoinGeckoPriceResponse, SIXTokenPrice } from "@/types/Coingecko";
import ENV from "@/libs/utils/ENV";
import axios from "axios";

export const getPriceFromCoingecko = async (
  tokenName: string
): Promise<CoinGeckoPrice | null> => {
  try {
    const res = await axios.get<CoinGeckoPriceResponse>(
      `https://api.coingecko.com/api/v3/simple/price?ids=${tokenName}&vs_currencies=usd&include_24hr_change=true&include_market_cap=true`
    );
    const price: CoinGeckoPrice = res.data[tokenName];
    if (!price) {
      return null;
    }
    return price;
  } catch (error) {
    console.error(error);
    return null;
  }
};


export const getSIXPrice = async (
  tokenName: string
): Promise<CoinGeckoPrice | null> => {
  let lower_chainName = process.env.NEXT_PUBLIC_CHAIN_NAME?.toLowerCase()
  if (lower_chainName === "mainnet" || lower_chainName === "sixnet") {
    const res = await axios.get(`${ENV.TXS_API_URL}/api/six-price`)
    const price: SIXTokenPrice = res.data[tokenName];
    if (!price) {
      return null;
    }

    const convertTypePrice: CoinGeckoPrice = {
      usd: parseFloat(price.usd),
      usd_market_cap: parseFloat(price.usd_market_cap),
      usd_24h_change: parseFloat(price.usd_24h_change)
    }
    return convertTypePrice
  } else {
    return getPriceFromCoingecko(tokenName)
  }
};