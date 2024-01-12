import { NFTSchema } from "@/types/Nftmngr";
import axios from "axios";
import ENV from "../../utils/ENV";
import filter from 'lodash';
import { _LOG } from "@/utils/log_helper";


export const getAllTransactionByAddress = async (
    address: string,
    page: string,
    pageSize: string,
  ): Promise<any | null> => {
    try {
      const res = await axios.get(
        `${ENV.DATA_CHAIN_TXS_API_URL}api/nft/getAllTransactionByAddress?address=${address}&page=${page}&limit=${pageSize}`
      );
      if (res.status !== 200) {
        _LOG("Error: Non-200 status code returned:", res.status);
        return null;
      }
      if (res.data.statusCode !== "V:0001") {
        _LOG("Error: API returned status code", res.data);
        return null;
      }
      const Txs = res.data.data;
      if (!Txs) {
        return null;
      }
      return Txs;
    } catch (error) {
      console.error(error);
      return null;
    }
  };
  
  export const getAllTransactionByTokenID = async (
    schemaCode: string,
    tokenID: string,
    page: string,
    pageSize: string,
  ): Promise<any | null> => {
    try {
      const res = await axios.get(
        `${ENV.DATA_CHAIN_TXS_API_URL}api/nft/getAllTransactionByTokenID?schemaCode=${schemaCode}&tokenID=${tokenID}&page=${page}&limit=${pageSize}`
      );
      if (res.status !== 200) {
        _LOG("Error: Non-200 status code returned:", res.status);
        return null;
      }
      if (res.data.statusCode !== "V:0001") {
        _LOG("Error: API returned status code", res.data);
        return null;
      }
      const Txs = res.data.data;
      if (!Txs) {
        return null;
      }
      return Txs;
    } catch (error) {
      console.error(error);
      return null;
    }
  };
  
  export const getAllActionByTokenID = async (
    schemaCode: string,
    tokenID: string,
    page: string,
    pageSize: string,
  ): Promise<any | null> => {
    try {
      const res = await axios.get(
        `${ENV.DATA_CHAIN_TXS_API_URL}api/nft/getAllActionByTokenID?schemaCode=${schemaCode}&tokenID=${tokenID}&page=${page}&limit=${pageSize}`
      );
      if (res.status !== 200) {
        _LOG("Error: Non-200 status code returned:", res.status);
        return null;
      }
      if (res.data.statusCode !== "V:0001") {
        _LOG("Error: API returned status code", res.data);
        return null;
      }
      const Txs = res.data.data;
      if (!Txs) {
        return null;
      }
      return Txs;
    } catch (error) {
      console.error(error);
      return null;
    }
  };
  
  export const getLatestAction = async (
    page: string,
    pageSize: string,
  ): Promise<any | null> => {
    try {
      const res = await axios.get(
        `${ENV.DATA_CHAIN_TXS_API_URL}api/nft/getActionTxs?page=${page}&limit=${pageSize}`
      );
      if (res.status !== 200) {
        _LOG("Error: Non-200 status code returned:", res.status);
        return null;
      }
      if (res.data.statusCode !== "V:0001") {
        _LOG("Error: API returned status code", res.data);
        return null;
      }
      const Txs = res.data.data;
      if (!Txs) { 
        return null;
      }
      return Txs;
    } catch (error) {
      console.error(error);
      return null;
    }
  };