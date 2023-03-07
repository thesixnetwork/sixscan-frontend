import { Collection } from "@/types/Opensea";
import axios from "axios";

export const getOpenseaCollectionByName = async (
  collectionName: string
): Promise<Collection | null> => {
  try {
    const res = await axios.get(
      `https://api.opensea.io/api/v1/collection/${collectionName}`
    );
    const collection = res.data.collection;
    if (!collection) {
      return null;
    }
    return collection;
  } catch (error) {
    console.error(error);
    return null;
  }
};
