export const formatNumber = (num: number, decimalPoints: number = 2) => {
  const [integerPart, decimalPart] = num.toFixed(decimalPoints).split(".");
  const formattedIntegerPart = integerPart.replace(
    /(\d)(?=(\d{3})+(?!\d))/g,
    "$1,"
  );
  return decimalPoints > 0
    ? `${formattedIntegerPart}.${decimalPart}`
    : formattedIntegerPart;
};

export const formatNumberAndRoundUp = (
  num: number,
  decimalPoints: number = 2
) => {
  const factor = 10 ** decimalPoints;
  const roundedNum = Math.ceil(num * factor) / factor; // round up to specified decimal places
  const [integerPart, decimalPart] = roundedNum
    .toFixed(decimalPoints)
    .split(".");
  const formattedIntegerPart = integerPart.replace(
    /(\d)(?=(\d{3})+(?!\d))/g,
    "$1,"
  );
  return decimalPoints > 0
    ? `${formattedIntegerPart}.${decimalPart}`
    : formattedIntegerPart;
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

export const convertAsixToSix = (asix: number) => {
  return asix / 1000000000000000000;
};
