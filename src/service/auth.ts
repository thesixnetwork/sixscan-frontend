import axios from "axios";
import ENV from "../utils/ENV";
import { Account } from "../types/Auth";


export const getAccounts = async (): Promise<Account[]> => {
  try {
    const res = await axios.get(`${ENV.API_URL}/cosmos/auth/v1beta1/accounts`);
    const accounts = res.data.accounts;
    if (!accounts) {
      return [];
    }
    return accounts;
  } catch (error) {
    // console.error(error);
    return [];
  }
};

export const getAccount = async (address: string): Promise<Account | null> => {
  try {
    const res = await axios.get(
      `${ENV.API_URL}/cosmos/auth/v1beta1/accounts/${address}`
    );
    const account = res.data.account;
    if (!account) {
      return null;
    }
    return account;
  } catch (error) {
    // console.error(error);
    return null;
  }
};

export const getIsContract = async (address: string): Promise<any> => {
  const body = {
    jsonrpc: "2.0",
    method: "eth_getCode",
    id: "1",
    params: [address, "latest"],
  };
  try {
    const res = await axios.post(`${ENV.Endpoint}/`, body);
    const result = res.data.result;
    if (result.length <= 2) {
      return false;
    }
    console.log("isContracttt ==>", result)
    return true;
  } catch (error) {
    console.error(error);
    return null;
  }

};

export const getIsETHAddress = async (address: string): Promise<any> => {
  try {
    if (address.startsWith('0x')) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error(error);
    return null;
  }

};
