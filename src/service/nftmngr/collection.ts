import { NFTSchema } from "@/types/Nftmngr";
import axios from "axios";
import ENV from "../../utils/ENV";
import filter from 'lodash';
import { _LOG } from "@/utils/log_helper";

export const getNftCollection = async (
  schemaCode: string,
  metadataPage: string,
  numberPerPage: string,
): Promise<any | null> => {
  try {
    ///// Check Token ID 0 ////////
    let tokenPerPage = parseInt(numberPerPage)
    const res = await axios.get(
      `${ENV.DATA_CHAIN_TXS_API_URL}api/nft/metadata/${schemaCode}/0`
    );
    const hasTokenZero = res.data.statusCode;
    if (hasTokenZero) {
      tokenPerPage = parseInt(numberPerPage) + 1
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
    if (hasTokenZero && metadataPage !== "1" && metadataPage !== "2") {
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

    if (hasTokenZero) {
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
  metadataPage: string,
  numberPerPage: string,
): Promise<any | null> => {
  try {
    // TOKEN PER PAGE CANNOT BE CHANGE
    let tokenPerPage = parseInt(numberPerPage)
    let FIRST_TOKEN_ID:number;
    let LAST_TOKEN_ID:number;

    const { data: { nftCollection, pagination: { total } } } = await axios.get(
      `${ENV.API_URL}/thesixnetwork/sixnft/nftmngr/nft_collection/${schemaCode}?pagination.offset=0&pagination.limit=1&pagination.count_total=true`
    );

    // IN CASE OF TOTAL COLLECTION IS LESS THAN TOKEN PER PAGE
    const TOTAL_TOKEN = parseInt(total)
    if (TOTAL_TOKEN < tokenPerPage) {
      tokenPerPage = TOTAL_TOKEN
    }
  
    // // IF TOKEN 0 EXIST THEN WE WILL START FROM TOKEN 0
    // const hasTokenZero = res.data.statusCode;
    // if (hasTokenZero && parseInt(metadataPage) !== 1) {
    //   FIRST_TOKEN_ID = (parseInt(metadataPage) - 1) * tokenPerPage + parseInt(nftCollection[0].token_id);
    // }else{
    //   FIRST_TOKEN_ID = (parseInt(metadataPage) - 1) * tokenPerPage + parseInt(nftCollection[0].token_id)
    // }    
    // IF TOKEN 0 EXIST THEN WE WILL START FROM TOKEN 0
    const hasTokenZero = nftCollection[0].token_id;
    
    if (hasTokenZero === "0"){
      if (parseInt(metadataPage) === 1) {
        FIRST_TOKEN_ID = 0 // parseInt(nftCollection[0].token_id);
      }else{
        FIRST_TOKEN_ID = (parseInt(metadataPage) - 1) * tokenPerPage + parseInt(nftCollection[0].token_id);
      }
    }else{
      if (parseInt(metadataPage) === 1) {
        FIRST_TOKEN_ID = parseInt(nftCollection[0].token_id);
      }else{
        FIRST_TOKEN_ID = (parseInt(metadataPage) - 1) * tokenPerPage + parseInt(nftCollection[0].token_id);
      }
    }

    // LOOK STUPID BUT IT IS FOR REDUCING LINE OF CODE
    if (TOTAL_TOKEN < tokenPerPage) {
      tokenPerPage = TOTAL_TOKEN // parseInt(metadataPage) * tokenPerPage // bc metadataPage will always be 1 in this case
    }

    const promises: Promise<any>[] = [];
    
    const urls = [];

    for (let i = 0; i <= tokenPerPage; i++) {
      const url = `${ENV.DATA_CHAIN_TXS_API_URL}api/nft/metadata/${schemaCode}/${FIRST_TOKEN_ID + i}`;
      urls.push(url);
    }


    const requests = urls.map((url) => axios.get(url));

    const responses = await axios.all(requests);

    responses.forEach((res, index) => {
      if (res.data.image) {
        const data = res.data;
        data.token_id = String(FIRST_TOKEN_ID + index);
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
    const hasTokenZero = res.data.statusCode;
    if (!hasTokenZero) {
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
