const ENV = {
  API_URL: process.env.API_URL || "",
  RPC_URL: process.env.RPC_URL || "",
  ARCH_API_URL: process.env.ARCH_API_URL || process.env.API_URL || "",
  ARCH_RPC_URL: process.env.ARCH_RPC_URL || process.env.RPC_URL || "",
  NEXT_PUBLIC_CHAIN_NAME: process.env.NEXT_PUBLIC_CHAIN_NAME || "",
};

export default ENV;
