import ENV from "@/utils/ENV";
import axios from "axios";

export const getTxsFromAddress = async (
  address: string,
  page: string,
  limit: string
): Promise<any> => {
  try {
    const res = await axios.get(
      `https://six-protocol-get-txs-api-gateway-7kl45r91.an.gateway.dev/api/all-txs-from-address?pageNumber=${page}&address=${address}&limit=${limit}`
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
      `${ENV.ARCH_RPC_URL}tx_search?query="tx.height=${height}"`
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
    const res = await axios.get(`${ENV.ARCH_RPC_URL}tx?hash=0x${hash}`);
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
