interface Message {
  "@type": string;
  from_address: string;
  to_address: string;
  amount: { denom: string; amount: string }[];
}

interface BlockTx {
  body: {
    messages: Message[];
    memo: string;
    timeout_height: string;
    extension_options: any[];
    non_critical_extension_options: any[];
  };
  auth_info: {
    signer_infos: {
      public_key: {
        "@type": string;
        key: string;
      };
      mode_info: { single: { mode: string } };
      sequence: string;
    }[];
    fee: {
      amount: { denom: string; amount: string }[];
      gas_limit: string;
      payer: string;
      granter: string;
    };
  };
  signatures: string[];
}

export interface Transaction {
  hash: string;
  height: string;
  index: number;
  tx_result: {
    code: number;
    data: string;
    log: string;
    info: string;
    gas_wanted: string;
    gas_used: string;
    events: {
      type: string;
      attributes: {
        key: string;
        value: string;
        index?: boolean;
      }[];
    }[];
  };
}

export interface EvmTransaction {
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
  accessList: any[];
  chainId: string;
  v: string;
  r: string;
  s: string;
}


export interface BlockTxs {
  txs: BlockTx[];
  block_id: {
    hash: string;
    part_set_header: {
      total: number;
      hash: string;
    };
  };
  block: {
    header: {
      version: {
        block: string;
        app: string;
      };
      chain_id: string;
      height: string;
      time: string;
      last_block_id: {
        hash: string;
        part_set_header: {
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
      evidence: any[];
    };
    last_commit: {
      height: string;
      round: number;
      block_id: {
        hash: string;
        part_set_header: {
          total: number;
          hash: string;
        };
      };
      signatures: {
        block_id_flag: string;
        validator_address: string;
        timestamp: string;
        signature: string;
      }[];
    };
  };
}

interface Tx {
  _id: string;
  type: string;
  txhash: string;
  block_height: string;
  time_stamp: number;
  rawTx: string;
  decode_tx: {
    value?: {
      amount: string;
      denom: string;
    };
    delegatorAddress?: string;
    validatorAddress?: string;
    fromAddress: string;
    toAddress: string;
    amount: [
      {
        denom: string;
        amount: string;
      }
    ];
    gas_wanted: string;
    gas_used: string;
    fee_amount: string;
    err_msg: string | null;
    relate_addr: string[] | null;
  };
  code: number;
  memo: string;
}

export interface AccountTxs {
  total_count: number;
  count: number;
  page_number: string;
  page_total: number;
  page_limit: string;
  txs: Tx[];
}
