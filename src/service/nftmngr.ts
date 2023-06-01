import { NFTSchema } from "@/types/Nftmngr";
import axios from "axios";
import ENV from "../utils/ENV";

export const getSchema = async (
  schemaCode: string
): Promise<NFTSchema | null> => {
  try {
    const res = await axios.get(
      `${ENV.API_URL}/thesixnetwork/sixnft/nftmngr/nft_schema/${schemaCode}`
    );
    if (res.data.code && res.data.code !== 0) {
      return null;
    }
    const schema = res.data.nFTSchema;
    if (!schema) {
      return null;
    }
    return schema;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getNftCollection = async (
  schemaCode: string,
  metadataPage: string
): Promise<any | null> => {
  try {
    const {data: { nftCollection , pagination: { total }}} = await axios.get(
      `${ENV.API_URL}/thesixnetwork/sixnft/nftmngr/nft_collection/${schemaCode}?pagination.offset=0&pagination.limit=1&pagination.count_total=true`
    );
    // console.log(total);
    let tokenPerPage = 12
    const lastToken = parseInt(total)
    if (lastToken < 12) {
      tokenPerPage = lastToken
    }
    const startingTokenId = (parseInt(metadataPage) - 1) * tokenPerPage + parseInt(nftCollection[0].token_id);
    const promises = [];

    for (let i = startingTokenId; i < startingTokenId + tokenPerPage; i++) {
      promises.push(
        await (
          await axios.get(
            `${ENV.API_URL}/thesixnetwork/sixnft/nftmngr/nft_data/${schemaCode}/${i}`
          )
        ).data.nftData
      );
    }
    const metadata = await Promise.all(promises);
    
    if (!metadata) {
      return null;
    }
    // console.log("metadata: ", metadata);
    return { metadata, pagination: { total } };
  } catch (error) {
    // console.error(error);
    return null;
  }
};

export const getMetadata = async (
  schemaCode: string,
  tokenid: string
): Promise<any | null> => {
  try {
    const { data } = await axios.get(
      `https://six-data-chain-backend-api-gateway-7kl45r91.ts.gateway.dev/api/nft/metadata/${schemaCode}/${tokenid}`
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

export const getNFTActionCountStat = async (
  schemaCode: string,
  startDate: string,
  endDate: string,
  page: string,
  pageSize: string,
): Promise<any | null> => {
  try {
    const res = await axios.get(
      `${ENV.DATA_CHAIN_TXS_API_URL}/api/nft/getActionCountStat?schemaCode=${schemaCode}&startDate=${startDate}&endDate=${endDate}&page=${page}&limit=${pageSize}`
    );
    if (res.status !== 200) {
      console.log("Error: Non-200 status code returned:", res.status);
      return null;
    }
    if (res.data.statusCode !== "V:0001") {
      console.log("Error: API returned status code", res.data.statusCode);
      return null;
    }
    const actionCount = res.data.data;
    if (!actionCount) {
      return null;
    }
    return actionCount;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getNFTActionCountStatDaily = async (
  schemaCode: string,
  startDate: string,
  endDate: string,
  page: string,
  pageSize: string,
): Promise<any | null> => {
  try {
    const res = await axios.get(
      `${ENV.DATA_CHAIN_TXS_API_URL}/api/nft/getActionCountStat?schemaCode=${schemaCode}&startDate=${startDate}&endDate=${endDate}&page=${page}&limit=${pageSize}`
    );
    if (res.status !== 200) {
      console.log("Error: Non-200 status code returned:", res.status);
      return null;
    }
    if (res.data.statusCode !== "V:0001") {
      console.log("Error: API returned status code", res.data.statusCode);
      return null;
    }
    const actionCountDaily = res.data.data;
    if (!actionCountDaily) {
      return null;
    }
    return actionCountDaily;
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

export const getLatestAction = async (
  page: string,
  pageSize: string,
): Promise<any | null> => {
  try {
    const res = await axios.get(
      `${ENV.DATA_CHAIN_TXS_API_URL}/api/nft/Txs?page=${page}&limit=${pageSize}`
    );
    if (res.status !== 200) {
      console.log("Error: Non-200 status code returned:", res.status);
      return null;
    }
    if (res.data.statusCode !== "V:0001") {
      console.log("Error: API returned status code", res.data);
      return null;
    }
    const Txs = res.data.data;
    if (!Txs) {
      return null;
    }
    return Txs;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getAllTransactionByAddress = async (
  address: string,
  page: string,
  pageSize: string,
): Promise<any | null> => {
  try {
    const res = await axios.get(
      `${ENV.DATA_CHAIN_TXS_API_URL}/api/nft/getAllTransactionByAddress?address=${address}&page=${page}&limit=${pageSize}`
    );
    if (res.status !== 200) {
      console.log("Error: Non-200 status code returned:", res.status);
      return null;
    }
    if (res.data.statusCode !== "V:0001") {
      console.log("Error: API returned status code", res.data);
      return null;
    }
    const Txs = res.data.data;
    if (!Txs) {
      return null;
    }
    return Txs;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getAllTransactionByTokenID = async (
  schemaCode: string,
  tokenID: string,
  page: string,
  pageSize: string,
): Promise<any | null> => {
  try {
    const res = await axios.get(
      `${ENV.DATA_CHAIN_TXS_API_URL}/api/nft/getAllTransactionByTokenID?schemaCode=${schemaCode}&tokenID=${tokenID}&page=${page}&limit=${pageSize}`
    );
    if (res.status !== 200) {
      console.log("Error: Non-200 status code returned:", res.status);
      return null;
    }
    if (res.data.statusCode !== "V:0001") {
      console.log("Error: API returned status code", res.data);
      return null;
    }
    const Txs = res.data.data;
    if (!Txs) {
      return null;
    }
    return Txs;
  } catch (error) {
    console.error(error);
    return null;
  }
};