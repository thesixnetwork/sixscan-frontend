import { NFTSchema } from "@/types/Nftmngr";
import axios from "axios";
import ENV from "../../libs/utils/ENV";
import filter from "lodash";
import { _LOG } from "@/libs/utils/log_helper";

export const getMetadata = async (
  schemaCode: string,
  tokenid: string
): Promise<any | null> => {
  const encodedSchemaCode = encodeURIComponent(schemaCode);
  try {
    const { data } = await axios.get(
      `${ENV.DATA_CHAIN_TXS_API_URL}api/nft/metadata/${encodedSchemaCode}/${tokenid}`
    );
    if (!data) {
      return null;
    }
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};
