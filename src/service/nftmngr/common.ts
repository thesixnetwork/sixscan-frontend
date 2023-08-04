import { NFTSchema } from "@/types/Nftmngr";
import axios from "axios";
import ENV from "../../utils/ENV";
import filter from 'lodash';
import { _LOG } from "@/utils/log_helper";


export const getMetadata = async (
    schemaCode: string,
    tokenid: string
  ): Promise<any | null> => {
    try {
      const { data } = await axios.get(
        `${ENV.DATA_CHAIN_TXS_API_URL}api/nft/metadata/${schemaCode}/${tokenid}`
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
  
  