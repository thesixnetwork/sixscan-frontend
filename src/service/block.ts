import {
  BlockchainResult,
  Block,
  BlockResult,
  BlockResponse,
} from "@/types/Block";
import axios from "axios";
import ENV from "../libs/utils/ENV";

export const getLatestBlock = async (): Promise<Block | null> => {
  try {
    const { data: { result: latestBlock } = {} } = await axios.get(
      `${ENV.NEXT_PUBLIC_ARCH_RPC_URL}/block`
    );
    return latestBlock;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getLatestBlocks = async (
  minHeight: number | null,
  maxHeight: number | null
): Promise<BlockchainResult | null> => {
  try {
    const { data: { result: blockchainResult } = {} } = await axios.get(
      `${ENV.NEXT_PUBLIC_ARCH_RPC_URL}/blockchain`,
      {
        params: {
          minHeight,
          maxHeight,
        },
      }
    );
    return blockchainResult;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getBlocksResult = async (
  minHeight: number | null,
  maxHeight: number | null
): Promise<BlockResult[] | null> => {
  try {
    const promises = [];
    if (!minHeight || !maxHeight) {
      return null;
    }
    for (let i = minHeight; i <= maxHeight; i++) {
      promises.push(
        axios.get<BlockResponse>(
          `${ENV.NEXT_PUBLIC_ARCH_RPC_URL}/block_results?height=${i}`
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

export const getBlock = async (height: string): Promise<Block | null> => {
  try {
    const res = await axios.get(
      `${ENV.NEXT_PUBLIC_ARCH_RPC_URL}/block?height=${height}`
    );
    const result = res.data.result;
    if (!result) {
      return null;
    }
    return result;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getBlockEVM = async (height: string): Promise<any> => {
  const body = {
    jsonrpc: "2.0",
    method: "eth_getBlockByNumber",
    id: "1",
    params: [height, true],
  };
  try {
    const res = await axios.post(`${ENV.NEXT_PUBLIC_EVM_RPC_URL}/`, body);
    const result = res.data.result;
    if (!result) {
      return null;
    }
    return result;
  } catch (error) {
    console.error(error);
    return null;
  }
};
