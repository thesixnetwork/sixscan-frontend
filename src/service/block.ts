import {
  BlockchainResult,
  Block,
  BlockResult,
  BlockResponse,
} from "@/types/Block";
import axios from "axios";
import ENV from "../utils/ENV";

export const getLatestBlock = async (): Promise<Block | null> => {
  try {
    const res = await axios.get(`${ENV.FIVENET_ARCH_RPC}block`);
    const result = res.data.result;
    // console.log(result);
    if (!result) {
      return null;
    }
    return result;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getLatestBlocks = async (
  minHeight: number,
  maxHeight: number
): Promise<BlockchainResult | null> => {
  try {
    const res = await axios.get(
      `${ENV.FIVENET_ARCH_RPC}blockchain?minHeight=${minHeight}&maxHeight=${maxHeight}`
    );
    const result = res.data.result;
    console.log("getLatestBlocks result: ", result);
    if (!result) {
      return null;
    }
    return result;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getBlocksResult = async (
  minHeight: number,
  maxHeight: number
): Promise<BlockResult[] | null> => {
  try {
    const promises = [];
    for (let i = minHeight; i <= maxHeight; i++) {
      promises.push(
        axios.get<BlockResponse>(
          `${ENV.FIVENET_ARCH_RPC}block_results?height=${i}`
        )
      );
    }
    const results = await Promise.all(promises);
    const blockResults: BlockResult[] = results.map((res) => res.data.result);
    return blockResults;
  } catch (error) {
    console.error(error);
    return null;
  }
};
