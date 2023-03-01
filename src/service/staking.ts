import axios from "axios";
import ENV from "../utils/ENV";
import { Validator } from "../types/Staking";
// -------- CosmJS --------
import { fromBase64, toBech32, toHex } from "@cosmjs/encoding";
import { anyToSinglePubkey } from "@cosmjs/proto-signing";
// import { pubkeyToAddress, Tendermint34Client } from "@cosmjs/tendermint-rpc";
import { fromBech32 } from "@cosmjs/encoding";

export const getValidators = async (): Promise<Validator[]> => {
  try {
    const res = await axios.get(
      `${ENV.FIVENET_API}cosmos/staking/v1beta1/validators`
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
  try {
    const res = await axios.get(
      `${ENV.FIVENET_API}/cosmos/staking/v1beta1/validators/${address}`
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

export const getPool = async (): Promise<any> => {
  try {
    const res = await axios.get(
      `${ENV.FIVENET_API}cosmos/staking/v1beta1/pool`
    );
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
