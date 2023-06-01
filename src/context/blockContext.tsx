import {
  getBlocksResult,
  getLatestBlock,
  getLatestBlocks,
} from "@/service/block";
import { getValidators } from "@/service/staking";
import { Validator } from "@/types/Staking";
import {  Block, BlockchainResult, BlockResult } from "@/types/Block";
import {createContext, useContext, useEffect, useState, ReactNode } from "react";
interface BlocksContextProps {
  latestBlock: Block;
  latestBlocks: BlockchainResult;
  blocksResult: BlockResult[];
  validators: Validator[];
}

interface BlocksProviderProps {
  children: ReactNode;
}


const BlocksContext = createContext<BlocksContextProps | null>(null);

export const useBlocksContext = (): BlocksContextProps => {
  const context = useContext(BlocksContext);
  if (!context) {
    throw new Error("useBlocksContext must be used within a BlocksProvider");
  }
  return context;
};


export const BlocksProvider = ({ children }: BlocksProviderProps) => {
  const [latestBlock, setLatestBlock] = useState<any | null>(null);
  const [latestBlocks, setLatestBlocks] = useState<any | null>(null);
  const [blocksResult, setBlocksResult] = useState<any[]>([]);
  const [validators, setValidators] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch data here and update the state variables
    };

    // Fetch data initially
    fetchData();

    // Set interval to fetch data every 6 seconds
    const intervalId = setInterval(fetchData, 6000);

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <BlocksContext.Provider value={{ latestBlock ,latestBlocks, blocksResult, validators }}>
      {children}
    </BlocksContext.Provider>
  );
};