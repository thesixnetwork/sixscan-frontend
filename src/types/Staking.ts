interface ConsensusPubkey {
  "@type": string;
  key: string;
}

interface CommissionRates {
  rate: string;
  max_rate: string;
  max_change_rate: string;
}

interface Commission {
  commission_rates: CommissionRates;
  update_time: string;
}

interface Description {
  moniker: string;
  identity: string;
  website: string;
  security_contact: string;
  details: string;
}

export interface Validator {
  account_address?: string;
  operator_address: string;
  consensus_pubkey: ConsensusPubkey;
  jailed: boolean;
  status: string;
  tokens: string;
  delegator_shares: string;
  description: Description;
  unbonding_height: string;
  unbonding_time: string;
  commission: Commission;
  min_self_delegation: string;
  min_delegation: string;
  delegation_increment: string;
  max_license: string;
  license_count: string;
  license_mode: boolean;
  enable_redelegation: boolean;
}

export interface Pool {
  not_bonded_tokens: string;
  bonded_tokens: string;
}
