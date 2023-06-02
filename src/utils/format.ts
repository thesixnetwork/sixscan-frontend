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


export const formatEng = (key:string) => {
  if (key == "@type"){
    return "@Type"
  }
  const splitParts = key.split('_');
  const formattedKey = splitParts.map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
  return `${formattedKey}`;
};

export const formatBank = (key:string) => {
  if (key == "from_address"){
    return "From"
  }
  if (key == "to_address"){
    return "To"
  }
  key = formatEng(key)
  return `${key}`;
}

export const formatSchema = (schema: string) => {
  const schema_code = schema.split('.')[1];
  if (schema_code.length <= 10) {
    return schema_code.slice(0, 10);
  }else {
    return schema_code.slice(0, 10) + '...';;
  }
};

export const formatSchemaAction = (action: string) => {
  if (action.length <= 8) {
    return action;
  }else {
    return action.slice(0, 8) + '...';
  }
};