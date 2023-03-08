import { CoinGeckoPrice } from "@/types/Coingecko";
import axios from "axios";

export const getPriceFromCoingecko = async (
  tokenName: string
): Promise<CoinGeckoPrice | null> => {
  try {
    const res = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=${tokenName}&vs_currencies=usd&include_24hr_change=true&include_market_cap=true`
    );
    const price = res.data[tokenName];
    if (!price) {
      return null;
    }
    return price;
  } catch (error) {
    console.error(error);
    return null;
  }
};
