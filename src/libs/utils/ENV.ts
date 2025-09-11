import dotenv from "dotenv";
dotenv.config();

let dufaultScanUrl;
let rpcURL;
let apiURL;

let lower_chainName = process.env.NEXT_PUBLIC_CHAIN_NAME?.toLowerCase();

if (lower_chainName === "mainnet" || lower_chainName === "sixnet") {
  dufaultScanUrl = "https://evm.sixscan.io";
  rpcURL = "https://sixnet-rpc.sixprotocol.net";
  apiURL = "https://sixnet-api.sixprotocol.net";
} else {
  rpcURL = "https://rpc1.fivenet.sixprotocol.net";
  apiURL = "https://api1.fivenet.sixprotocol.net";
  dufaultScanUrl = "https://fivenet.evm.sixscan.io";
}

const ENV = {
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || apiURL,
  NEXT_PUBLIC_RPC_URL: process.env.NEXT_PUBLIC_RPC_URL || rpcURL,
  NEXT_PUBLIC_ARCH_API_URL:
    process.env.NEXT_PUBLIC_ARCH_API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "https://api1.fivenet.sixprotocol.net",
  NEXT_PUBLIC_ARCH_RPC_URL:
    process.env.NEXT_PUBLIC_ARCH_RPC_URL ||
    process.env.NEXT_PUBLIC_RPC_URL ||
    "https://rpc1.fivenet.sixprotocol.net",
  NEXT_PUBLIC_CHAIN_NAME: process.env.NEXT_PUBLIC_CHAIN_NAME || "",
  NEXT_PUBLIC_TXS_API_URL:
    process.env.NEXT_PUBLIC_TXS_API_URL ||
    "https://six-protocol-sixnet-get-txs-api-gateway-3hi29er0.an.gateway.dev",
  NEXT_PUBLIC_DATA_CHAIN_TXS_API_URL: process.env.NEXT_PUBLIC_DATA_CHAIN_TXS_API_URL || "",
  NEXT_PUBLIC_EVM_RPC_URL:
    process.env.NEXT_PUBLIC_EVM_RPC_URL || "https://rpc-evm.fivenet.sixprotocol.net:443",
  NEXT_PUBLIC_BLOCK_SCOUT_API_URL: dufaultScanUrl,
  NEXT_PUBLIC_CONSOLE_LOG_ENABLE: process.env.NEXT_PUBLIC_CONSOLE_LOG_ENABLE || "true",
  NEXT_PUBLIC_CONSOLE_TIME_ENABLE: process.env.NEXT_PUBLIC_CONSOLE_TIME_ENABLE || "false",
};

export default ENV;
