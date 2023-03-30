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
    const {
      data: {
        nftCollection,
        pagination: { total },
      },
    } = await axios.get(
      `${ENV.API_URL}/thesixnetwork/sixnft/nftmngr/nft_collection/${schemaCode}?pagination.offset=0&pagination.limit=1&pagination.count_total=true`
    );

    const startingTokenId =
      (parseInt(metadataPage) - 1) * 12 + parseInt(nftCollection[0].token_id);
    const promises = [];

    for (let i = startingTokenId; i < startingTokenId + 12; i++) {
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
    console.error(error);
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
