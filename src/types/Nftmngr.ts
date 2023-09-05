export interface action_params {
  name: string;
  desc: string;
  data_type: string;
  required: boolean;
  default_value: string;
}

export interface Action {
  name: string;
  desc: string;
  disable: boolean;
  when: string;
  then: string[];
  allowed_actioner: AllowedActioner;
  params: action_params[];
}

export enum AllowedActioner {
  ALLOWED_ACTIONER_ALL = 0,
  ALLOWED_ACTIONER_SYSTEM_ONLY = 1,
  ALLOWED_ACTIONER_USER_ONLY = 2,
  UNRECOGNIZED = -1,
}

export interface DefaultMintValue {
  number_attribute_value: NumberAttributeValue | undefined;
  string_attribute_value: StringAttributeValue | undefined;
  boolean_attribute_value: BooleanAttributeValue | undefined;
  float_attribute_value: FloatAttributeValue | undefined;
}

export interface AttributeDefinition {
  name: string;
  data_type: string;
  required: boolean;
  display_value_field: string;
  display_option: DisplayOption | undefined;
  default_mint_value: DefaultMintValue | undefined;
  /** flag that allows action to override hidden */
  hidden_overide: boolean;
  hidden_to_marketplace: boolean;
  index: number;
}

export interface DisplayOption {
  bool_true_value: string;
  bool_false_value: string;
  opensea: OpenseaDisplayOption | undefined;
}

export interface OpenseaDisplayOption {
  display_type: string;
  trait_type: string;
  max_value: number;
}

export interface MetadataCreator {
  nftSchemaCode: string;
  metadataMintedBy: MapTokenToMinter[];
}

export interface MapTokenToMinter {
  token_id: string;
  minter: string;
}

export interface NftAttributeValue {
  name: string;
  number_attribute_value: NumberAttributeValue | undefined;
  string_attribute_value: StringAttributeValue | undefined;
  boolean_attribute_value: BooleanAttributeValue | undefined;
  float_attribute_value: FloatAttributeValue | undefined;
  hidden_to_marketplace: boolean;
}

export interface NumberAttributeValue {
  value: number;
}

export interface StringAttributeValue {
  value: string;
}

export interface BooleanAttributeValue {
  value: boolean;
}

export interface FloatAttributeValue {
  value: number;
}

export interface NftCollection {
  nftSchemaCode: string;
  total: number;
  nftDatas: NftData[];
}

export interface NftData {
  nft_schema_code: string;
  token_id: string;
  token_owner: string;
  owner_address_type: OwnerAddressType;
  origin_image: string;
  onchain_image: string;
  token_uri: string;
  origin_attributes: NftAttributeValue[];
  onchain_attributes: NftAttributeValue[];
}

export interface NFTMetadata {
  token_id: string;
  image: string;
  name: string;
  description: string;
  attributes: Attribute[];
  nft_schema_code: string;
}

interface Attribute {
  trait_type: string;
  is_origin: boolean;
  value: string | number;
}

export enum OwnerAddressType {
  ORIGIN_ADDRESS = 0,
  INTERNAL_ADDRESS = 1,
  UNRECOGNIZED = -1,
}

export interface NFTSchema {
  code: string;
  name: string;
  owner: string;
  system_actioners: string[];
  origin_data: OriginData;
  onchain_data: OnChainData;
  isVerified: boolean;
  mint_authorization: string;
}

export interface OriginData {
  origin_chain: string;
  origin_contract_address: string;
  origin_base_uri: string;
  attribute_overriding: AttributeOverriding;
  metadata_format: string;
  origin_attributes: AttributeDefinition[];
  uri_retrieval_method: URIRetrievalMethod;
}

export interface OnChainData {
  reveal_required: boolean;
  reveal_secret: Uint8Array;
  nft_attributes: AttributeDefinition[];
  token_attributes: AttributeDefinition[];
  actions: Action[];
  status: FlagStatus[];
  nft_attributes_value: NftAttributeValue[];
}

export interface FlagStatus {
  status_name: string;
  status_value: boolean;
}

export enum AttributeOverriding {
  ORIGIN = 0,
  CHAIN = 1,
  UNRECOGNIZED = -1,
}

export enum URIRetrievalMethod {
  BASE = 0,
  TOKEN = 1,
  UNRECOGNIZED = -1,
}

export interface DataNFTStat {
  schema_code: string,
  action: string,
  count: number,
  image: string,
}

export interface DataNFTCollectionTrending {
  schema_code: string,
  action: string,
  count: number,
  image: string,
}

export interface DataActionCount {
  _id: string,
  period: string,
  schema_code: string,
  action: string,
  count: number
}

export interface BlockNFTStat {
  totalNFTCollection: {
    total: string,
  },
  totalNFTS: {
    total: string,
  },
  nftFee: string,
  action24h: number,
}

export interface LatestAction {
  txs: DataLatestAction[],
  totalPage: number,
  totalCount: number,
}

export interface DataLatestAction {
  _id: string,
  type: string,
  hash: string,
  block_height: string,
  raw_tx: string,
  decode_tx: any,
  code: number,
  memo: string
}