import { NFTSchema } from "@/types/Nftmngr";
import axios from "axios";
import ENV from "../../utils/ENV";
import filter from 'lodash';
import { _LOG } from "@/utils/log_helper";


export const getNFTActionCountStat = async (
  schemaCode: string,
  page: string,
  endTime: string,
  pageSize: string,
): Promise<any | null> => {
  try {
    // const res = await axios.get(
    //   `${ENV.DATA_CHAIN_TXS_API_URL}api/nft/getActionCountLiteTime?schemaCode=${schemaCode}&page=${page}&limit=${pageSize}`
    // );
    const res = await axios.get(
      `${ENV.DATA_CHAIN_TXS_API_URL}api/nft/getActionCountMonthly?schemaCode=${schemaCode}&endTime=${endTime}&page=${page}&limit=${pageSize}`
    );
    if (res.status !== 200) {
      _LOG("Error: Non-200 status code returned:", res.status);
      return null;
    }
    if (res.data.statusCode !== "V:0001") {
      _LOG("Error: API returned status code", res.data.statusCode);
      return null;
    }
    const actionCount = res.data.data;
    const promises = [];
    for (const item of actionCount.data) {
      try {
        const { data } = await axios.get(
          `${ENV.DATA_CHAIN_TXS_API_URL}api/nft/metadata/${item._id.schema_code}/1`
        );
        if (data.image) {
          const fmtData = {
            schema_code: item._id.schema_code,
            action: item._id.action,
            count: item.count,
            image: data.image
          }
          promises.push(fmtData);
        }
      } catch (e) {
        const fmtData = {
          schema_code: item.schema_code,
          action: item.action,
          count: item.count,
          image: "/logo-nftgen2-01.png"
        }
        promises.push(fmtData);
      }
    }
    const metadata = await Promise.all(promises);
    // console.log("metadata", metadata)
    if (!metadata) {
      return null;
    }
    return metadata;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getNFTActionCountStatDaily = async (
    schemaCode: string,
    endTime: string,
  ): Promise<any | null> => {
    try {
      const res = await axios.get(
        `${ENV.DATA_CHAIN_TXS_API_URL}api/nft/getActionCountDaily?schemaCode=${schemaCode}&endTime=${endTime}`
      );
      if (res.status !== 200) {
        _LOG("Error: Non-200 status code returned:", res.status);
        return null;
      }
      if (res.data.statusCode !== "V:0001") {
        _LOG("Error: API returned status code", res.data.statusCode);
        return null;
      }
      const CountDaily = res.data.data[0];
      if (!CountDaily) {
        return null;
      }
      return CountDaily;
    } catch (error) {
      console.error(error);
      return null;
    }
  };
  
  export const getTotalNFTCollection = async () => {
    try {
      const res = await axios.get(
        `${ENV.API_URL}/thesixnetwork/sixnft/nftmngr/nft_data?pagination.offset=1&pagination.limit=1&pagination.count_total=true`
      );
      const total = res.data.pagination;
      if (!total) {
        return null;
      }
      return total;
    } catch (error) {
      console.error(error);
      return null;
    }
  };
  
  export const getTotalNFTS = async () => {
    try {
      const res = await axios.get(
        `${ENV.API_URL}/thesixnetwork/sixnft/nftmngr/nft_schema?pagination.offset=1&pagination.limit=1&pagination.count_total=true`
      );
      const total = res.data.pagination;
      if (!total) {
        return null;
      }
      return total;
    } catch (error) {
      console.error(error);
      return null;
    }
  };
  
  export const getNFTFee = async () => {
    try {
      const res = await axios.get(
        `${ENV.API_URL}/thesixnetwork/sixnft/nftmngr/nft_fee_config`
      );
      const total = res.data.NFTFeeConfig.schema_fee.fee_amount;
      if (!total) {
        return null;
      }
      return total;
    } catch (error) {
      console.error(error);
      return null;
    }
  };
  
