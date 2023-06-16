const ENV = {
  API_URL: process.env.API_URL || "https://api1.fivenet.sixprotocol.net",
  RPC_URL: process.env.RPC_URL || "",
  ARCH_API_URL: process.env.ARCH_API_URL || process.env.API_URL || "",
  ARCH_RPC_URL: process.env.ARCH_RPC_URL || process.env.RPC_URL || "https://rpc1.fivenet.sixprotocol.net",
  NEXT_PUBLIC_CHAIN_NAME: process.env.NEXT_PUBLIC_CHAIN_NAME || "",
  TXS_API_URL: process.env.TXS_API_URL || "",
  DATA_CHAIN_TXS_API_URL: process.env.DATA_CHAIN_TXS_API_URL || "https://six-data-chain-backend-api-gateway-7kl45r91.ts.gateway.dev",
  EVM_RPC_URL: process.env.EVM_RPC_URL || "https://rpc-evm.fivenet.sixprotocol.net:443",
  Block_Scount_API_URL: process.env.Block_Scount_API_URL || "https://fivenet.evm.sixscan.io",
  CONSOLE_LOG_ENABLE: process.env.CONSOLE_LOG_ENABLE || "false",
  CONSOLE_TIME_ENABLE: process.env.CONSOLE_TIME_ENABLE || "false",
};

export default ENV;
