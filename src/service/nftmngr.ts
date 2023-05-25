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
