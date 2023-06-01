const ENV = {
  API_URL: process.env.API_URL || "",
  RPC_URL: process.env.RPC_URL || "",
  ARCH_API_URL: process.env.ARCH_API_URL || process.env.API_URL || "",
  ARCH_RPC_URL: process.env.ARCH_RPC_URL || process.env.RPC_URL || "",
  NEXT_PUBLIC_CHAIN_NAME: process.env.NEXT_PUBLIC_CHAIN_NAME || "",
  TXS_API_URL: process.env.TXS_API_URL || "",
  DATA_CHAIN_TXS_API_URL: process.env.DATA_CHAIN_TXS_API_URL || "",
  EVM_RPC_URL: process.env.EVM_RPC_URL || "https://rpc-evm.fivenet.sixprotocol.net:443",
  Block_Scount_API_URL: process.env.Block_Scount_API_URL || "https://fivenet.evm.sixscan.io",
};

export default ENV;
