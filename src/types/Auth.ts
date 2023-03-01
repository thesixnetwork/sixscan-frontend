export interface Account {
  "@type":
    | "/cosmos.auth.v1beta1.BaseAccount"
    | "/cosmos.auth.v1beta1.ModuleAccount";
  address: string;
  pub_key: null | string;
  account_number: string;
  sequence: string;
}
