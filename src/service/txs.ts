import ENV from "@/utils/ENV";
import axios from "axios";
import { _LOG } from "@/utils/log_helper";

export const getTxsFromSchema = async (
  schemaCode: string,
  page: string,
  limit: string
): Promise<any> => {
  try {
    const res = await axios.get(
      `${ENV.DATA_CHAIN_TXS_API_URL}api/nft/getAllTransaction?schemaCode=${schemaCode}&page=${page}&limit=${limit}`
    );
    if (res.status !== 200) {
      _LOG("Error: Non-200 status code returned:", res.status);
      return null;
    }
    if (res.data.statusCode !== "V:0001") {
      _LOG("Error: API returned status code", res.data.statusCode);
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

export const getTxsFromSchemaSixNet = async (
  schemaCode: string,
  page: string,
  limit: string
): Promise<any> => {
  try {
    const res = await axios.get(
      `${ENV.DATA_CHAIN_TXS_API_URL}api/nft/getAllTransactionBySchema?schemaCode=${schemaCode}&page=${page}&limit=${limit}`
    );
    if (res.status !== 200) {
      _LOG("Error: Non-200 status code returned:", res.status);
      return null;
    }
    if (res.data.statusCode !== "V:0001") {
      _LOG("Error: API returned status code", res.data.statusCode);
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
    // if (!blockTxs) {
    //   return null;
    // }
    return blockTxs;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getTxsByHashFromAPI = async (txhash: string): Promise<any> => {
  try {
    const res = await axios.get(
      `${ENV.API_URL}/cosmos/tx/v1beta1/txs/${txhash}`
    );
    const blockTxs = res.data;
    if (!blockTxs) {
      return null;
    }
    return blockTxs;
  } catch (error) {
    const res = await axios.get(
      `${ENV.TXS_API_URL}/api/tx-from-hash?txHash=${txhash}`
    );

    return res.data;
  }
};

export const getTxByHashFromRPC = async (hash: string): Promise<any> => {
  try {
    const res = await axios.get(`${ENV.ARCH_RPC_URL}/tx?hash=0x${hash}`);
    const tx = res.data.result;
    if (!tx) {
      return null;
    }
    return tx;
  } catch (error) {
    const res = await axios.get(
      `${ENV.TXS_API_URL}/api/tx-from-hash?txHash=${hash}`
    );

    return res.data;
  }
};

export const getTxEVMFromHash = async (hash: string): Promise<any> => {
  const body = {
    jsonrpc: "2.0",
    method: "eth_getTransactionByHash",
    id: "1",
    params: [hash],
  };
  try {
    const res = await axios.post(`${ENV.EVM_RPC_URL}/`, body);
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
