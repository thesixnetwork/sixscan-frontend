export interface Balance {
  denom: string;
  amount: string;
}

export interface BalanceETH {
  jsonrpc: string;
  id: string;
  result: string;
}

export interface SendAmount {
  denom: string;
  amount: string;
}