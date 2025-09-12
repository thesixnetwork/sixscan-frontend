import axios from "axios";
import ENV from "../libs/utils/ENV";

export const getInflation = async (): Promise<string | null> => {
  try {
    const res = await axios.get(
      `${ENV.NEXT_PUBLIC_API_URL}/cosmos/mint/v1beta1/inflation`
    );
    const inflation = res.data.inflation;
    if (!inflation) {
      return null;
    }
    return inflation;
  } catch (error) {
    console.error(error);
    return null;
  }
};
