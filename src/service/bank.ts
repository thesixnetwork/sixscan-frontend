import axios from "axios";
import ENV from "../utils/ENV";
import { Balance } from "../types/Bank";

export const getBalances = async (address: string): Promise<Balance[]> => {
  try {
    const res = await axios.get(
      `${ENV.API_URL}cosmos/bank/v1beta1/balances/${address}`
    );
    const balances = res.data.balances;
    if (!balances) {
      return [];
    }
    return balances;
  } catch (error) {
    // console.error(error);
    return [];
  }
};

export const getBalance = async (address: string): Promise<Balance | null> => {
  try {
    const res = await axios.get(
      `${ENV.API_URL}cosmos/bank/v1beta1/balances/${address}/by_denom?denom=usix`
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
      `${ENV.API_URL}cosmos/bank/v1beta1/denoms_metadata/${denom}`
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
      `${ENV.API_URL}cosmos/bank/v1beta1/supply/${denom}`
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
