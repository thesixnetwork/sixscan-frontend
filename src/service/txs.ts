import ENV from "@/utils/ENV";
import axios from "axios";

export const getTxsFromSchema = async (
  schemaCode: string,
  page: string,
  limit: string
): Promise<any> => {
  try {
    const res = await axios.get(
      `${ENV.DATA_CHAIN_TXS_API_URL}/api/nft/getAllTransaction?schemaCode=${schemaCode}&page=${page}&limit=${limit}`
    );
    if (res.status !== 200) {
      console.log("Error: Non-200 status code returned:", res.status);
      return null;
    }
    if (res.data.statusCode !== "V:0001") {
      console.log("Error: API returned status code", res.data.statusCode);
      return null;
    }
    const accountTxs = res.data.data;
    if (!accountTxs) {
      return null;
    }
    return accountTxs;
  } catch (error) {
    console.error("Error: ", error);
    return null;
  }
};

export const getTxsFromAddress = async (
  address: string,
  page: string,
  limit: string
): Promise<any> => {
  try {
    const res = await axios.get(
      `${ENV.TXS_API_URL}/api/all-txs-from-address?pageNumber=${page}&address=${address}&limit=${limit}`
    );
    const accountTxs = res.data;
    if (!accountTxs) {
      return null;
    }
    return accountTxs;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getTxsFromBlock = async (height: string): Promise<any> => {
  try {
    const res = await axios.get(
      `${ENV.ARCH_RPC_URL}/tx_search?query="tx.height=${height}"`
    );
    const blockTxs = res.data.result;
    if (!blockTxs) {
      return null;
    }
    return blockTxs;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getTxFromHash = async (hash: string): Promise<any> => {
  try {
    const res = await axios.get(`${ENV.ARCH_RPC_URL}/tx?hash=0x${hash}`);
    const tx = res.data.result;
    if (!tx) {
      return null;
    }
    return tx;
  } catch (error) {
    console.error(error);
    return null;
  }
};
