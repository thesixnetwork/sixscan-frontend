import { NFTSchema } from "@/types/Nftmngr";
import axios from "axios";
import ENV from "../utils/ENV";
import filter from 'lodash';
import { _LOG } from "@/utils/log_helper";

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
    ///// Check Token ID 0 ////////
    let tokenPerPage = 12
    const res = await axios.get(
      `${ENV.DATA_CHAIN_TXS_API_URL}api/nft/metadata/${schemaCode}/0`
    );
    const isZero = res.data.statusCode;
    if (isZero) {
      tokenPerPage = 13
    }

    const { data: { nftCollection, pagination: { total } } } = await axios.get(
      `${ENV.API_URL}/thesixnetwork/sixnft/nftmngr/nft_collection/${schemaCode}?pagination.offset=0&pagination.limit=1&pagination.count_total=true`
    );
    _LOG(total);
    const lastToken = parseInt(total)
    if (lastToken < 12) {
      tokenPerPage = lastToken
    }
    let startingTokenId = (parseInt(metadataPage) - 1) * tokenPerPage + parseInt(nftCollection[0].token_id);
    if (isZero && metadataPage !== "1" && metadataPage !== "2") {
      startingTokenId = (parseInt(metadataPage) - 1) * tokenPerPage + parseInt(nftCollection[0].token_id) - 1;
    }
    const promises: Promise<any>[] = [];

    // for (let i = startingTokenId; i < startingTokenId + tokenPerPage; i++) {
    //   const { data } = await axios.get(
    //     `${ENV.DATA_CHAIN_TXS_API_URL}api/nft/metadata/${schemaCode}/${i}`
    //   );
    //   data.token_id = i;
    //   if (data.image) {
    //     promises.push(data);
    //   }
    // }

    let urls = [
      `${ENV.DATA_CHAIN_TXS_API_URL}api/nft/metadata/${schemaCode}/${startingTokenId}`,
      `${ENV.DATA_CHAIN_TXS_API_URL}api/nft/metadata/${schemaCode}/${startingTokenId + 1}`,
      `${ENV.DATA_CHAIN_TXS_API_URL}api/nft/metadata/${schemaCode}/${startingTokenId + 2}`,
      `${ENV.DATA_CHAIN_TXS_API_URL}api/nft/metadata/${schemaCode}/${startingTokenId + 3}`,
      `${ENV.DATA_CHAIN_TXS_API_URL}api/nft/metadata/${schemaCode}/${startingTokenId + 4}`,
      `${ENV.DATA_CHAIN_TXS_API_URL}api/nft/metadata/${schemaCode}/${startingTokenId + 5}`,
      `${ENV.DATA_CHAIN_TXS_API_URL}api/nft/metadata/${schemaCode}/${startingTokenId + 6}`,
      `${ENV.DATA_CHAIN_TXS_API_URL}api/nft/metadata/${schemaCode}/${startingTokenId + 7}`,
      `${ENV.DATA_CHAIN_TXS_API_URL}api/nft/metadata/${schemaCode}/${startingTokenId + 8}`,
      `${ENV.DATA_CHAIN_TXS_API_URL}api/nft/metadata/${schemaCode}/${startingTokenId + 9}`,
      `${ENV.DATA_CHAIN_TXS_API_URL}api/nft/metadata/${schemaCode}/${startingTokenId + 10}`,
      `${ENV.DATA_CHAIN_TXS_API_URL}api/nft/metadata/${schemaCode}/${startingTokenId + 11}`,
    ];

    if (isZero) {
      urls = [
        `${ENV.DATA_CHAIN_TXS_API_URL}api/nft/metadata/${schemaCode}/${startingTokenId}`,
        `${ENV.DATA_CHAIN_TXS_API_URL}api/nft/metadata/${schemaCode}/${startingTokenId + 1}`,
        `${ENV.DATA_CHAIN_TXS_API_URL}api/nft/metadata/${schemaCode}/${startingTokenId + 2}`,
        `${ENV.DATA_CHAIN_TXS_API_URL}api/nft/metadata/${schemaCode}/${startingTokenId + 3}`,
        `${ENV.DATA_CHAIN_TXS_API_URL}api/nft/metadata/${schemaCode}/${startingTokenId + 4}`,
        `${ENV.DATA_CHAIN_TXS_API_URL}api/nft/metadata/${schemaCode}/${startingTokenId + 5}`,
        `${ENV.DATA_CHAIN_TXS_API_URL}api/nft/metadata/${schemaCode}/${startingTokenId + 6}`,
        `${ENV.DATA_CHAIN_TXS_API_URL}api/nft/metadata/${schemaCode}/${startingTokenId + 7}`,
        `${ENV.DATA_CHAIN_TXS_API_URL}api/nft/metadata/${schemaCode}/${startingTokenId + 8}`,
        `${ENV.DATA_CHAIN_TXS_API_URL}api/nft/metadata/${schemaCode}/${startingTokenId + 9}`,
        `${ENV.DATA_CHAIN_TXS_API_URL}api/nft/metadata/${schemaCode}/${startingTokenId + 10}`,
        `${ENV.DATA_CHAIN_TXS_API_URL}api/nft/metadata/${schemaCode}/${startingTokenId + 11}`,
        `${ENV.DATA_CHAIN_TXS_API_URL}api/nft/metadata/${schemaCode}/${startingTokenId + 12}`,
      ];
    }

    const requests = urls.map((url) => axios.get(url));

    const responses = await axios.all(requests);

    responses.forEach((res, index) => {
      if (res.data.image) {
        const data = res.data;
        data.token_id = String(startingTokenId + index);
        promises.push(data);
      }
    });

    const metadata = await Promise.all(promises);
    if (!metadata) {
      return null;
    }
    _LOG("metadata: ", metadata);
    return { metadata, pagination: { total } };
  } catch (error) {
    // console.error(error);
    return null;
  }
};

export const getImgCollection = async (
  schemaCode: string,
  tokenId: string,
): Promise<any | null> => {
  try {
    const res = await axios.get(
      `${ENV.DATA_CHAIN_TXS_API_URL}api/nft/metadata/${schemaCode}/${tokenId}`
    );
    if (!res.data.image) {
      return null;
    }
    return res.data.image;
  } catch (error) {
    // console.error(error);
    return null;
  }
};

export const getNftCollectionNoLoop = async (
  schemaCode: string,
): Promise<any | null> => {
  try {
    const { data: { nftCollection, pagination: { total } } } = await axios.get(
      `${ENV.API_URL}/thesixnetwork/sixnft/nftmngr/nft_collection/${schemaCode}?pagination.offset=0&pagination.limit=1&pagination.count_total=true`
    );
    if (!total) {
      return null;
    }
    return { total };
  } catch (error) {
    // console.error(error);
    return null;
  }
};

export const getNftCollectionByClient = async (
  schemaCode: string,
  metadataPage: string
): Promise<any | null> => {
  try {
    ///// Check Token ID 0 ////////
    let tokenPerPage = 12
    const res = await axios.get(
      `${ENV.DATA_CHAIN_TXS_API_URL}api/nft/metadata/${schemaCode}/0`
    );
    const isZero = res.data.statusCode;
    if (isZero) {
      tokenPerPage = 13
    }

    const { data: { nftCollection, pagination: { total } } } = await axios.get(
      `${ENV.API_URL}/thesixnetwork/sixnft/nftmngr/nft_collection/${schemaCode}?pagination.offset=0&pagination.limit=1&pagination.count_total=true`
    );
    _LOG(total);
    const lastToken = parseInt(total)
    if (lastToken < 12) {
      tokenPerPage = lastToken
    }
    let startingTokenId = (parseInt(metadataPage) - 1) * tokenPerPage + parseInt(nftCollection[0].token_id);
    // if (isZero && metadataPage !== "1" && metadataPage !== "2") {
    //   startingTokenId = (parseInt(metadataPage) - 1) * tokenPerPage + parseInt(nftCollection[0].token_id) - 1;
    // }
    if (isZero && metadataPage !== "1") {
      startingTokenId = (parseInt(metadataPage) - 1) * tokenPerPage + parseInt(nftCollection[0].token_id) - 1;
    }
    const promises: Promise<any>[] = [];

    const urls = [];

    for (let i = 0; i < tokenPerPage; i++) {
      const url = `${ENV.DATA_CHAIN_TXS_API_URL}api/nft/metadata/${schemaCode}/${startingTokenId + i}`;
      urls.push(url);
    }


    const requests = urls.map((url) => axios.get(url));

    const responses = await axios.all(requests);

    responses.forEach((res, index) => {
      if (res.data.image) {
        const data = res.data;
        data.token_id = String(startingTokenId + index);
        promises.push(data);
      }
    });

    const metadata = await Promise.all(promises);
    if (!metadata) {
      return null;
    }
    _LOG("metadata: ", metadata);
    return { metadata, pagination: { total } };
  } catch (error) {
    // console.error(error);
    return null;
  }
};

export const getNftCollectionV2 = async (
  schemaCode: string,
  metadataPage: string
): Promise<any | null> => {
  try {
    let tokenPerPage = 12
    const res = await axios.get(
      `${ENV.DATA_CHAIN_TXS_API_URL}api/nft/metadata/${schemaCode}/1`
    );
    const isZero = res.data.statusCode;
    if (!isZero) {
      tokenPerPage = 13
    }

    const { data: { nftCollection, pagination: { total } } } = await axios.get(
      `${ENV.API_URL}/thesixnetwork/sixnft/nftmngr/nft_collection/${schemaCode}?pagination.offset=0&pagination.limit=1&pagination.count_total=true`
    );
    _LOG(total);
    const lastToken = parseInt(total)
    if (lastToken < 12) {
      tokenPerPage = lastToken
    }
    const startingTokenId = (parseInt(metadataPage) - 1) * tokenPerPage + parseInt(nftCollection[0].token_id);
    const promises = [];

    let urls = [
      `${ENV.DATA_CHAIN_TXS_API_URL}api/nft/metadata/${schemaCode}/${startingTokenId}`,
      `${ENV.DATA_CHAIN_TXS_API_URL}api/nft/metadata/${schemaCode}/${startingTokenId + 1}`,
      `${ENV.DATA_CHAIN_TXS_API_URL}api/nft/metadata/${schemaCode}/${startingTokenId + 2}`,
      `${ENV.DATA_CHAIN_TXS_API_URL}api/nft/metadata/${schemaCode}/${startingTokenId + 3}`,
      `${ENV.DATA_CHAIN_TXS_API_URL}api/nft/metadata/${schemaCode}/${startingTokenId + 4}`,
      `${ENV.DATA_CHAIN_TXS_API_URL}api/nft/metadata/${schemaCode}/${startingTokenId + 5}`,
      `${ENV.DATA_CHAIN_TXS_API_URL}api/nft/metadata/${schemaCode}/${startingTokenId + 6}`,
      `${ENV.DATA_CHAIN_TXS_API_URL}api/nft/metadata/${schemaCode}/${startingTokenId + 7}`,
      `${ENV.DATA_CHAIN_TXS_API_URL}api/nft/metadata/${schemaCode}/${startingTokenId + 8}`,
      `${ENV.DATA_CHAIN_TXS_API_URL}api/nft/metadata/${schemaCode}/${startingTokenId + 9}`,
      `${ENV.DATA_CHAIN_TXS_API_URL}api/nft/metadata/${schemaCode}/${startingTokenId + 10}`,
      `${ENV.DATA_CHAIN_TXS_API_URL}api/nft/metadata/${schemaCode}/${startingTokenId + 11}`,
    ];

    const requests = urls.map((url) => axios.get(url));

    const responses = await Promise.all(requests);
    // if (!metadata) {
    //   return null;
    // }
    // _LOG("metadata: ", metadata);
    return responses;
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

export const getNFTActionCountStat = async (
  schemaCode: string,
  page: string,
  pageSize: string,
): Promise<any | null> => {
  try {
    // const res = await axios.get(
    //   `${ENV.DATA_CHAIN_TXS_API_URL}api/nft/getActionCountLiteTime?schemaCode=${schemaCode}&page=${page}&limit=${pageSize}`
    // );
    const res = await axios.get(
      `${ENV.DATA_CHAIN_TXS_API_URL}api/nft/getActionCountLifeTime?schemaCode=${schemaCode}&page=${page}&limit=${pageSize}`
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

export const getLatestAction = async (
  page: string,
  pageSize: string,
): Promise<any | null> => {
  try {
    const res = await axios.get(
      `${ENV.DATA_CHAIN_TXS_API_URL}api/nft/getActionTxs?page=${page}&limit=${pageSize}`
    );
    if (res.status !== 200) {
      _LOG("Error: Non-200 status code returned:", res.status);
      return null;
    }
    if (res.data.statusCode !== "V:0001") {
      _LOG("Error: API returned status code", res.data);
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
      `${ENV.DATA_CHAIN_TXS_API_URL}api/nft/getAllTransactionByAddress?address=${address}&page=${page}&limit=${pageSize}`
    );
    if (res.status !== 200) {
      _LOG("Error: Non-200 status code returned:", res.status);
      return null;
    }
    if (res.data.statusCode !== "V:0001") {
      _LOG("Error: API returned status code", res.data);
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
      `${ENV.DATA_CHAIN_TXS_API_URL}api/nft/getAllTransactionByTokenID?schemaCode=${schemaCode}&tokenID=${tokenID}&page=${page}&limit=${pageSize}`
    );
    if (res.status !== 200) {
      _LOG("Error: Non-200 status code returned:", res.status);
      return null;
    }
    if (res.data.statusCode !== "V:0001") {
      _LOG("Error: API returned status code", res.data);
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

export const getAllActionByTokenID = async (
  schemaCode: string,
  tokenID: string,
  page: string,
  pageSize: string,
): Promise<any | null> => {
  try {
    const res = await axios.get(
      `${ENV.DATA_CHAIN_TXS_API_URL}api/nft/getAllActionByTokenID?schemaCode=${schemaCode}&tokenID=${tokenID}&page=${page}&limit=${pageSize}`
    );
    if (res.status !== 200) {
      _LOG("Error: Non-200 status code returned:", res.status);
      return null;
    }
    if (res.data.statusCode !== "V:0001") {
      _LOG("Error: API returned status code", res.data);
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

export const getSchemaByCodeAddr = async (
  schemaOrContract: string,
): Promise<any | null> => {
  try {
    const res = await axios.get(
      `${ENV.API_URL}/thesixnetwork/sixnft/nftmngr/nft_schema_by_contract?pagination.count_total=true`
    );
    const schema = res.data.nFTSchemaByContract;
    const mergedSchema = schema.flatMap((item: any) => item.schemaCodes);
    const mergedSchemas = mergedSchema.map((item: any) => ({
      name: item,
    }));
    const filteredNames = filter.filter(mergedSchema, (x) => x.toLowerCase().startsWith(schemaOrContract));
    // const filteredContract = filter.filter(schema, (x) => x.toLowerCase().startsWith(schemaOrContract));
    _LOG(schema);
    if (!filteredNames) {
      return null;
    }
    return filteredNames;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getSchemaByCodeAddr2 = async (
  schemaOrContract: string,
): Promise<any | null> => {
  try {
    const res = await axios.get(
      `${ENV.DATA_CHAIN_TXS_API_URL}api/nft/getAllSchemaCode?schemaCode=${schemaOrContract}&page=1&limit=5`
    );
    const schema = res.data.data.data;
    if (!schema) {
      return null;
    }
    return schema;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getAllSchema = async (
  page: string,
  limit: string,
): Promise<any | null> => {
  try {
    const res = await axios.get(
      `${ENV.DATA_CHAIN_TXS_API_URL}api/nft/getAllSchemaCode?schemaCode=&page=${page}&limit=${limit}`
    );
    const schema = res.data.data;
    if (!schema) {
      return null;
    }
    return schema;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getAllSchemas = async (): Promise<any | null> => {
  try {
    const res = await axios.get(
      `${ENV.API_URL}/thesixnetwork/sixnft/nftmngr/nft_schema_by_contract?pagination.count_total=true`
    );
    const schema = res.data.nFTSchemaByContract;
    const mergedSchema = schema.flatMap((item: any) => item.schemaCodes);
    const mergedSchemas = mergedSchema.map((item: any) => ({
      name: item,
    }));
    // const filteredContract = filter.filter(schema, (x) => x.toLowerCase().startsWith(schemaOrContract));
    _LOG(schema);
    if (!mergedSchemas) {
      return null;
    }
    return mergedSchemas;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getSchemaByAddr = async (
  schemaOrContract: string,
): Promise<any | null> => {
  try {
    const res = await axios.get(
      `${ENV.API_URL}/thesixnetwork/sixnft/nftmngr/nft_schema_by_contract?pagination.count_total=true`
    );
    const schema = res.data.nFTSchemaByContract;
    const filteredCode = schema.filter((item: any) =>
      item.originContractAddress.includes(schemaOrContract)
    );
    const mergedSchema = filteredCode.flatMap((item: any) => item.schemaCodes);
    if (!mergedSchema) {
      return null;
    }
    return mergedSchema;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getSchemaByAddress = async (
  schemaOrContract: string,
): Promise<any | null> => {
  try {
    const res = await axios.get(
      `${ENV.DATA_CHAIN_TXS_API_URL}api/nft/getSchemaCodeByContractAddress?contractAddress=${schemaOrContract}&page=1&limit=5`
    );
    const schema = res.data.data.data;

    if (!schema) {
      return null;
    }
    return schema;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getSchemaByContractAddress = async (
  contract: string,
  page: string,
  limit: string,
): Promise<any | null> => {
  try {
    const res = await axios.get(
      `${ENV.DATA_CHAIN_TXS_API_URL}api/nft/getSchemaCodeByContractAddress?contractAddress=${contract}&page=${page}&limit=${limit}`
    );
    const schema = res.data.data;

    if (!schema) {
      return null;
    }
    return schema;
  } catch (error) {
    console.error(error);
    return null;
  }
};


