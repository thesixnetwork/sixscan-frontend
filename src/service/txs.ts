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
