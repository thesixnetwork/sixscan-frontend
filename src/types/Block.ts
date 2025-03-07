export interface Block {
  block_id: {
    hash: string;
    parts: {
      total: number;
      hash: string;
    };
  };
  block: {
    header: {
      version: {
        block: string;
      };
      chain_id: string;
      height: string;
      time: string;
      last_block_id: {
        hash: string;
        parts: {
          total: number;
          hash: string;
        };
      };
      last_commit_hash: string;
      data_hash: string;
      validators_hash: string;
      next_validators_hash: string;
      consensus_hash: string;
      app_hash: string;
      last_results_hash: string;
      evidence_hash: string;
      proposer_address: string;
    };
    data: {
      txs: string[];
    };
    evidence: {
      evidence: string[];
    };
    last_commit: {
      height: string;
      round: number;
      block_id: {
        hash: string;
        parts: {
          total: number;
          hash: string;
        };
      };
      signatures: {
        block_id_flag: number;
        validator_address: string;
        timestamp: string;
        signature: string;
      }[];
    };
  };
}

export interface BlockEVM {
  baseFeePerGas: string;
  difficulty: string;
  extraData: string;
  gasLimit: string;
  gasUsed: string;
  hash: string;
  logsBloom: string;
  miner: string;
  mixHash: string;
  nonce: string;
  number: string;
  parentHash: string;
  receiptsRoot: string;
  sha3Uncles: string;
  size: string;
  stateRoot: string;
  timestamp: string;
  totalDifficulty: string;
  transactions: [{
    blockHash: string;
    blockNumber: string;
    from: string;
    gas: string;
    gasPrice: string;
    maxFeePerGas: string;
    maxPriorityFeePerGas: string;
    hash: string;
    input: string;
    nonce: string;
    to: string;
    transactionIndex: string;
    value: string;
    type: string;
    accessList: string[];
    chainId: string;
    v: string;
    r: string;
    s: string;
  }];
    transactionsRoot: string;
    uncles: string[];
}



export interface BlockMeta {
  block_id: {
    hash: string;
    parts: {
      total: number;
      hash: string;
    };
  };
  block_size: string;
  header: {
    version: {
      block: string;
    };
    chain_id: string;
    height: string;
    time: string;
    last_block_id: {
      hash: string;
      parts: {
        total: number;
        hash: string;
      };
    };
    last_commit_hash: string;
    data_hash: string;
    validators_hash: string;
    next_validators_hash: string;
    consensus_hash: string;
    app_hash: string;
    last_results_hash: string;
    evidence_hash: string;
    proposer_address: string;
  };
  num_txs: string;
}

export interface BlockchainResult {
  last_height: string;
  block_metas: BlockMeta[];
}

export interface BlockResult {
  height: string;
  txs_results: null;
  begin_block_events: BeginBlockEvents[];
  end_block_events: null;
  validator_updates: null;
  consensus_param_updates: ConsensusParams;
}

interface ConsensusParams {
  block: {
    max_bytes: string;
    max_gas: string;
  };
  evidence: {
    max_age_num_blocks: string;
    max_age_duration: string;
    max_bytes: string;
  };
  validator: {
    pub_key_types: string[];
  };
}

interface BeginBlockEvent {
  key: string;
  value: string;
  index: boolean;
}

export interface BeginBlockEvents {
  type: string;
  attributes: BeginBlockEvent[];
}

export interface BlockResponse {
  jsonrpc: string;
  id: number;
  result: BlockResult;
}
