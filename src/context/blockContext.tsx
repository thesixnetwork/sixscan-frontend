import {
  getBlocksResult,
  getLatestBlock,
  getLatestBlocks,
} from "@/service/block";
import { getValidators } from "@/service/staking";
import { Validator } from "@/types/Staking";
import { Block, BlockchainResult, BlockResult } from "@/types/Block";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
interface BlocksContextProps {
  latestBlockState: Block | null;
  latestBlockChainState: BlockchainResult | null;
  blocksResultState: BlockResult[];
  validatorsState: Validator[];
}

interface BlocksProviderProps {
  children: ReactNode;
}

export const BlocksContext = createContext<BlocksContextProps>({
  latestBlockState: null,
  latestBlockChainState: null,
  blocksResultState: [],
  validatorsState: [],
});

export const BlocksProvider = ({ children }: BlocksProviderProps) => {
  const [latestBlockState, setLatestBlockState] = useState<Block | null>(null);
  const [latestBlockChainState, setLatestBlockChainState] =
    useState<BlockchainResult | null>(null);
  const [blocksResultState, setBlocksResultState] = useState<BlockResult[]>([]);
  const [validatorsState, setValidators] = useState<Validator[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const latestBlock = await getLatestBlock();
      setLatestBlockState(latestBlock ? latestBlock : latestBlockState);
    };
    // Fetch data initially
    fetchData();
    const intervalId = setInterval(fetchData, 6000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const latestBlockHeight = latestBlockState
        ? parseInt(latestBlockState?.block?.header?.height) ?? null
        : null;
      const minBlockHeight = latestBlockHeight ? latestBlockHeight - 20 : null;
      const [latestBlocks, blocksResult, validators] = await Promise.all([
        getLatestBlocks(minBlockHeight, latestBlockHeight),
        getBlocksResult(minBlockHeight, latestBlockHeight),
        getValidators(),
      ]);
      setLatestBlockChainState(
        latestBlocks ? latestBlocks : latestBlockChainState
      );
      setBlocksResultState(blocksResult ? blocksResult : blocksResultState);
      setValidators(validators ? validators : validatorsState);
    };
    fetchData();
  }, [latestBlockState]);

  return (
    <BlocksContext.Provider
      value={{
        latestBlockState,
        latestBlockChainState,
        blocksResultState,
        validatorsState,
      }}
    >
      {children}
    </BlocksContext.Provider>
  );
};
