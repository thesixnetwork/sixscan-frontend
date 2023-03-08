export const formatNumber = (num: number) => {
  const roundedNum = Math.ceil(num * 100) / 100; // round up to two decimal places
  return roundedNum.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
};

export const formatHex = (hash: string) => {
  return hash.slice(0, 6) + "..." + hash.slice(hash.length - 6, hash.length);
};

export const formatTraitValue = (value: string | number) => {
  if (typeof value === "string" && value.length > 10) {
    return `${value.substring(0, 18)}...`;
  }
  return value;
};

export const convertDecimalToPercent = (decimal: number) => {
  const percent = decimal * 100;
  return Math.round(percent * 100) / 100; // Round to 2 decimal places
};

export const convertUsixToSix = (usix: number) => {
  return usix / 1000000;
};
