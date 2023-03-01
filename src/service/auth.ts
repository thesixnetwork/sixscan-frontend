import axios from "axios";
import ENV from "../utils/ENV";
import { Account } from "../types/Auth";

export const getAccounts = async (): Promise<Account[]> => {
  try {
    const res = await axios.get(
      `${ENV.FIVENET_API}cosmos/auth/v1beta1/accounts`
    );
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
      `${ENV.FIVENET_API}cosmos/auth/v1beta1/accounts/${address}`
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
