import { useState } from 'react';

const ENV = {
  API_URL: process.env.API_URL || "https://api1.fivenet.sixprotocol.net",
  RPC_URL: process.env.RPC_URL || "",
  ARCH_API_URL: process.env.ARCH_API_URL || process.env.API_URL || "",
  ARCH_RPC_URL: process.env.ARCH_RPC_URL || process.env.RPC_URL || "https://rpc1.fivenet.sixprotocol.net",
  NEXT_PUBLIC_CHAIN_NAME: process.env.NEXT_PUBLIC_CHAIN_NAME || "",
  TXS_API_URL: process.env.TXS_API_URL || "",
  DATA_CHAIN_TXS_API_URL: process.env.DATA_CHAIN_TXS_API_URL || "https://six-data-chain-backend-api-gateway-7kl45r91.ts.gateway.dev/",
  // DATA_CHAIN_TXS_API_URL: process.env.DATA_CHAIN_TXS_API_URL || "https://dev-sixnet-offchain-backend-api-gateway-7kl45r91.ts.gateway.dev/sixnet-",
  EVM_RPC_URL: process.env.EVM_RPC_URL || "https://rpc-evm.fivenet.sixprotocol.net:443",
  Block_Scount_API_URL: process.env.NEXT_PUBLIC_Block_Scount_API_URL || "https://fivenet.evm.sixscan.io",
  CONSOLE_LOG_ENABLE: process.env.CONSOLE_LOG_ENABLE || "false",
  CONSOLE_TIME_ENABLE: process.env.CONSOLE_TIME_ENABLE || "false",
};

// const ENV_SIXNET = {
//   API_URL: process.env.SIX_API_URL || "https://api1.fivenet.sixprotocol.net",
//   RPC_URL: process.env.SIX_RPC_URL || "",
//   ARCH_API_URL: process.env.SIX_ARCH_API_URL || process.env.SIX_API_URL || "",
//   ARCH_RPC_URL: process.env.SIX_ARCH_RPC_URL || process.env.SIX_RPC_URL || "https://rpc1.fivenet.sixprotocol.net",
//   NEXT_PUBLIC_CHAIN_NAME: process.env.NEXT_PUBLIC_SIX_CHAIN_NAME || "",
//   TXS_API_URL: process.env.SIX_TXS_API_URL || "",
//   DATA_CHAIN_TXS_API_URL: process.env.SIX_DATA_CHAIN_TXS_API_URL || "https://six-data-chain-backend-api-gateway-7kl45r91.ts.gateway.dev/",
//   EVM_RPC_URL: process.env.SIX_EVM_RPC_URL || "https://rpc-evm.fivenet.sixprotocol.net:443",
//   Block_Scount_API_URL: process.env.NEXT_PUBLIC_SIX_Block_Scount_API_URL || "https://fivenet.evm.sixscan.io",
//   CONSOLE_LOG_ENABLE: process.env.SIX_CONSOLE_LOG_ENABLE || "false",
//   CONSOLE_TIME_ENABLE: process.env.SIX_CONSOLE_TIME_ENABLE || "false",
// };

// export const updateURLs = (toggle: boolean) => {
//   const { env, setEnv } = useEnv();

//   setEnv((prevEnv) => ({
//     ...prevEnv,
//     API_URL: toggle ? process.env.API_URL || "https://api1.fivenet.sixprotocol.net" : ENV_SIXNET.API_URL,
//     RPC_URL: toggle ? process.env.RPC_URL || "" : ENV_SIXNET.RPC_URL,
//     ARCH_API_URL: toggle ? process.env.API_URL || "" : ENV_SIXNET.ARCH_API_URL,
//     ARCH_RPC_URL: toggle ? process.env.ARCH_RPC_URL || process.env.RPC_URL || "https://rpc1.fivenet.sixprotocol.net" : ENV_SIXNET.ARCH_RPC_URL,
//     NEXT_PUBLIC_CHAIN_NAME: toggle ? process.env.NEXT_PUBLIC_CHAIN_NAME || "" : ENV_SIXNET.NEXT_PUBLIC_CHAIN_NAME,
//     TXS_API_URL: toggle ? process.env.TXS_API_URL || "" : ENV_SIXNET.TXS_API_URL,
//     DATA_CHAIN_TXS_API_URL: toggle ? process.env.DATA_CHAIN_TXS_API_URL || "https://six-data-chain-backend-api-gateway-7kl45r91.ts.gateway.dev/" : ENV_SIXNET.DATA_CHAIN_TXS_API_URL,
//     EVM_RPC_URL: toggle ? process.env.EVM_RPC_URL || "https://rpc-evm.fivenet.sixprotocol.net:443" : ENV_SIXNET.EVM_RPC_URL,
//     Block_Scount_API_URL: toggle ? process.env.NEXT_PUBLIC_Block_Scount_API_URL || "https://fivenet.evm.sixscan.io" : ENV_SIXNET.Block_Scount_API_URL,
//     CONSOLE_LOG_ENABLE: toggle ? process.env.CONSOLE_LOG_ENABLE || "false" : ENV_SIXNET.CONSOLE_LOG_ENABLE,
//     CONSOLE_TIME_ENABLE: toggle ? process.env.CONSOLE_TIME_ENABLE || "false" : ENV_SIXNET.CONSOLE_TIME_ENABLE,
//   }));
// };

// const useEnv = () => {
//   const [env, setEnv] = useState(ENV);

//   return { env, setEnv };
// };


export default ENV;
