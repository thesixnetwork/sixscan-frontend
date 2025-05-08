import dotenv from "dotenv";
dotenv.config();

let dufaultScanUrl;

let lower_chainName = process.env.NEXT_PUBLIC_CHAIN_NAME?.toLowerCase();

if (lower_chainName === "mainnet" || lower_chainName === "sixnet") {
  dufaultScanUrl = "https://evm.sixscan.io";
} else {
  dufaultScanUrl = "https://fivenet.evm.sixscan.io";
}

const ENV = {
  API_URL: process.env.API_URL || "https://api1.fivenet.sixprotocol.net",
  RPC_URL: process.env.RPC_URL || "https://rpc2.fivenet.sixprotocol.net",
  ARCH_API_URL:
    process.env.ARCH_API_URL ||
    process.env.API_URL ||
    "https://api1.fivenet.sixprotocol.net",
  ARCH_RPC_URL:
    process.env.ARCH_RPC_URL ||
    process.env.RPC_URL ||
    "https://rpc2.fivenet.sixprotocol.net",
  NEXT_PUBLIC_CHAIN_NAME: process.env.NEXT_PUBLIC_CHAIN_NAME || "",
  TXS_API_URL:
    process.env.TXS_API_URL ||
    "https://six-protocol-get-txs-api-gateway-7kl45r91.ts.gateway.dev/",
  DATA_CHAIN_TXS_API_URL: process.env.DATA_CHAIN_TXS_API_URL || "",
  // DATA_CHAIN_TXS_API_URL: process.env.DATA_CHAIN_TXS_API_URL || "",
  EVM_RPC_URL:
    process.env.EVM_RPC_URL || "https://rpc-evm.fivenet.sixprotocol.net:443",
  BLOCK_SCOUT_API_URL: dufaultScanUrl,
  CONSOLE_LOG_ENABLE: process.env.CONSOLE_LOG_ENABLE || "true",
  CONSOLE_TIME_ENABLE: process.env.CONSOLE_TIME_ENABLE || "false",
};

export default ENV;
