export const validateAddress = (address: string) => {
  const pattern = /^6x(1[a-zA-Z0-9]{38}|valoper1[a-zA-Z0-9]{38})$/;
  return pattern.test(address);
};

export const validateBlock = (block: string) => {
  const pattern = /^[0-9]+$/;
  return pattern.test(block);
};

export const validateTxHash = (txHash: string) => {
  const pattern = /^[a-fA-F0-9]{64}$/;
  return pattern.test(txHash);
};
