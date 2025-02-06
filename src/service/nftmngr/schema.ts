import { NFTSchema } from "@/types/Nftmngr";
import axios from "axios";
import ENV from "../../utils/ENV";
import filter from 'lodash';
import { _LOG } from "@/utils/log_helper";


export const getSchema = async (
    schemaCode: string
  ): Promise<NFTSchema | null> => {
    const encodedSchemaCode = encodeURIComponent(schemaCode);
    try {
      const res = await axios.get(
        `${ENV.API_URL}/thesixnetwork/sixnft/nftmngr/nft_schema/${encodedSchemaCode}`
      );
      if (res.data.code && res.data.code !== 0) {
        return null;
      }
      const schema = res.data.nFTSchema;
      if (!schema) {
        return null;
      }
      return schema;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

export const getSchemaByCodeAddr = async (
    schemaOrContract: string,
  ): Promise<any | null> => {
    try {
      const res = await axios.get(
        `${ENV.API_URL}/thesixnetwork/sixnft/nftmngr/nft_schema_by_contract?pagination.count_total=true`
      );
      const schema = res.data.nFTSchemaByContract;
      const mergedSchema = schema.flatMap((item: any) => item.schemaCodes);
      const mergedSchemas = mergedSchema.map((item: any) => ({
        name: item,
      }));
      const filteredNames = filter.filter(mergedSchema, (x) => x.toLowerCase().startsWith(schemaOrContract));
      // const filteredContract = filter.filter(schema, (x) => x.toLowerCase().startsWith(schemaOrContract));
      _LOG(schema);
      if (!filteredNames) {
        return null;
      }
      return filteredNames;
    } catch (error) {
      console.error(error);
      return null;
    }
  };
  
  export const getSchemaByCodeAddr2 = async (
    schemaOrContract: string,
  ): Promise<any | null> => {
    try {
      const res = await axios.get(
        `${ENV.DATA_CHAIN_TXS_API_URL}api/nft/getAllSchemaCode?schemaCode=${schemaOrContract}&page=1&limit=5`
      );
      const schema = res.data.data.data;
      if (!schema) {
        return null;
      }
      return schema;
    } catch (error) {
      console.error(error);
      return null;
    }
  };
  
  export const getAllSchema = async (
    page: string,
    limit: string,
  ): Promise<any | null> => {
    try {
      const res = await axios.get(
        `${ENV.DATA_CHAIN_TXS_API_URL}api/nft/getAllSchemaCode?schemaCode=&page=${page}&limit=${limit}`
      );
      const schema = res.data.data;
      if (!schema) {
        return null;
      }
      return schema;
    } catch (error) {
      console.error(error);
      return null;
    }
  };
  
  export const getAllSchemas = async (): Promise<any | null> => {
    try {
      const res = await axios.get(
        `${ENV.API_URL}/thesixnetwork/sixnft/nftmngr/nft_schema_by_contract?pagination.count_total=true`
      );
      const schema = res.data.nFTSchemaByContract;
      const mergedSchema = schema.flatMap((item: any) => item.schemaCodes);
      const mergedSchemas = mergedSchema.map((item: any) => ({
        name: item,
      }));
      // const filteredContract = filter.filter(schema, (x) => x.toLowerCase().startsWith(schemaOrContract));
      _LOG(schema);
      if (!mergedSchemas) {
        return null;
      }
      return mergedSchemas;
    } catch (error) {
      console.error(error);
      return null;
    }
  };
  
  export const getSchemaByAddr = async (
    schemaOrContract: string,
  ): Promise<any | null> => {
    try {
      const res = await axios.get(
        `${ENV.API_URL}/thesixnetwork/sixnft/nftmngr/nft_schema_by_contract?pagination.count_total=true`
      );
      const schema = res.data.nFTSchemaByContract;
      const filteredCode = schema.filter((item: any) =>
        item.originContractAddress.includes(schemaOrContract)
      );
      const mergedSchema = filteredCode.flatMap((item: any) => item.schemaCodes);
      if (!mergedSchema) {
        return null;
      }
      return mergedSchema;
    } catch (error) {
      console.error(error);
      return null;
    }
  };
  
  export const getSchemaByAddress = async (
    schemaOrContract: string,
  ): Promise<any | null> => {
    try {
      const res = await axios.get(
        `${ENV.DATA_CHAIN_TXS_API_URL}api/nft/getSchemaCodeByContractAddress?contractAddress=${schemaOrContract}&page=1&limit=5`
      );
      const schema = res.data.data.data;
  
      if (!schema) {
        return null;
      }
      return schema;
    } catch (error) {
      console.error(error);
      return null;
    }
  };
  
  export const getSchemaByContractAddress = async (
    contract: string,
    page: string,
    limit: string,
  ): Promise<any | null> => {
    try {
      const res = await axios.get(
        `${ENV.DATA_CHAIN_TXS_API_URL}api/nft/getSchemaCodeByContractAddress?contractAddress=${contract}&page=${page}&limit=${limit}`
      );
      const schema = res.data.data;
  
      if (!schema) {
        return null;
      }
      return schema;
    } catch (error) {
      console.error(error);
      return null;
    }
  };
  