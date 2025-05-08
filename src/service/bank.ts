import axios from "axios";
import ENV from "../libs/utils/ENV";
import { Balance } from "../types/Bank";

export const getBalances = async (address: string): Promise<Balance[]> => {
  try {
    if (address.startsWith("0x")) {
      const body = {
        jsonrpc: "2.0",
        method: "eth_getBalance",
        id: "1",
        params: [address, "latest"],
      };
      const res = await axios.post(`${ENV.EVM_RPC_URL}/`, body);
      // const balances = res.data;

      const balances = [
        {
          amount: (parseInt(res.data.result, 16) / 1000000000000).toString(),
          denom: "asix",
        },
      ];
      if (!balances) {
        return [];
      }

      return balances;
    } else {
      const res = await axios.get(
        `${ENV.API_URL}/cosmos/bank/v1beta1/balances/${address}`
      );
      const balances = res.data.balances;
      if (!balances) {
        return [];
      }
      return balances;
    }
  } catch (error) {
    // console.error(error);
    return [];
  }
};

export const getBalance = async (address: string): Promise<Balance | null> => {
  try {
    const res = await axios.get(
      `${ENV.API_URL}/cosmos/bank/v1beta1/balances/${address}/by_denom?denom=usix`
    );
    const balance = res.data.balance;
    if (!balance) {
      return null;
    }
    return balance;
  } catch (error) {
    // console.error(error);
    return null;
  }
};

export const getCoinMetadata = async (denom: string): Promise<any> => {
  try {
    const res = await axios.get(
      `${ENV.API_URL}/cosmos/bank/v1beta1/denoms_metadata/${denom}`
    );
    const metadata = res.data.metadata;
    if (!metadata) {
      return null;
    }
    return metadata;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getSupply = async (denom: string): Promise<any> => {
  try {
    const res = await axios.get(
      `${ENV.API_URL}/cosmos/bank/v1beta1/supply/${denom}`
    );
    const amount = res.data.amount;
    if (!amount) {
      return null;
    }
    return amount;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getSupplySixNet = async (): Promise<any> => {
  try {
    const res = await axios.get(
      `https://suppy-sixscan-backend-api-workers-273189981420.asia-southeast1.run.app/cache/get`
    );
    const amount = res.data;
    if (!amount) {
      return null;
    }
    return amount;
  } catch (error) {
    console.error(error);
    return null;
  }
};
