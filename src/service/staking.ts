import axios from "axios";
import ENV from "../libs/utils/ENV";
import { Delegation, Pool, Validator } from "../types/Staking";
// -------- CosmJS --------
import { fromBech32, toBech32, toHex } from "@cosmjs/encoding";
export const getValidators = async (): Promise<Validator[]> => {
  try {
    const res = await axios.get(
      `${ENV.API_URL}/cosmos/staking/v1beta1/validators`
    );
    const validators = res.data.validators;
    if (!validators) {
      return [];
    }
    return validators;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getValidator = async (
  address: string
): Promise<Validator | null> => {
  if (!address.startsWith("6xvaloper")) {
    return null;
  }
  try {
    const res = await axios.get(
      `${ENV.API_URL}/cosmos/staking/v1beta1/validators/${address}`
    );
    const validator = res.data.validator;
    if (!validator) {
      return null;
    }
    const { prefix, data } = fromBech32(address);
    const accountAddress = toBech32("6x", data);
    validator.account_address = accountAddress;
    return validator;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getPool = async (): Promise<Pool | null> => {
  try {
    const res = await axios.get(`${ENV.API_URL}/cosmos/staking/v1beta1/pool`);
    const pool = res.data.pool;
    if (!pool) {
      return null;
    }
    return pool;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getDelegationsFromValidator = async (
  address: string
): Promise<Delegation[] | null> => {
  if (!address.startsWith("6xvaloper")) {
    return null;
  }
  try {
    const res = await axios.get(
      `${ENV.API_URL}/cosmos/staking/v1beta1/validators/${address}/delegations`
    );
    const delegation_responses = res.data.delegation_responses;
    if (!delegation_responses) {
      return null;
    }
    return delegation_responses.sort(
      (a: Delegation, b: Delegation) =>
        parseInt(b.delegation.shares) - parseInt(a.delegation.shares)
    );
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const uptime = async (req: any, res: any) => {
  try {
    const validators = await axios.get(
      `${process.env.API_URL}/cosmos/staking/v1beta1/validators`
    );
    const latestBlock = await axios.get(`${process.env.API_URL}/blocks/latest`);
    // Process and return uptime data
    res
      .status(200)
      .json({ validators: validators.data, latestBlock: latestBlock.data });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
