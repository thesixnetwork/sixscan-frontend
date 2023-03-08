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
