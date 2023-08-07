import { SendAmount } from "@/types/Bank";

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
  // check input in not null
  if (!hash) {
    return "";
  }
  return hash.slice(0, 6) + "..." + hash.slice(hash.length - 6, hash.length);
};

export const formatMethod = (method: string) => {
  // check input in not null
  if (!method) {
    return "";
  }
  if (method.split(".")[method.split(".").length - 1].slice(3).toUpperCase() === "PERFORMACTIONBYADMIN"){
    return "ACTION"
  }else if (method.split(".")[method.split(".").length - 1].slice(3).toUpperCase() === "PERFORMMULTITOKENACTION"){
    return "MULTIACION"
  }else {
    return method.split(".")[method.split(".").length - 1].slice(3).toUpperCase()
  }
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

export const convertAmountToSix = (amount: any) => {
  if (amount.denom === "usix") {
    return convertUsixToSix(parseInt(amount.amount));
  } else if (amount.denom === "asix") {
    return convertAsixToSix(parseInt(amount.amount));
  }
  return amount.amount;
};

interface Coin {
  amount: number;
  denom: string;
}

// this function only use for supprt ASIX and USIX TOKEN
const convertSIXTOKEN = (tokens: Coin): Coin => {
  const { amount, denom } = tokens;
  if (denom === "usix") {
    const amount_ = convertUsixToSix(amount);
    return {
      amount: amount_,
      denom: "SIX",
    };
  } else if (denom === "asix") {
    const amount_ = convertAsixToSix(amount);
    return {
      amount: amount_,
      denom: "SIX",
    }
  }else {
    return {
      amount: amount,
      denom: denom,
    };
  }
}

export const convertStringAmountToCoin = (stringAmount: string): Coin => {
  // find if comma exists
  let total = 0;
  let _denom = "";
  const regex = /^(\d+)([a-z]+)$/i;
  const commaIndex = stringAmount.indexOf(",");
  if (commaIndex === -1) {
    // * EXAMPLES AMOUNT DATA
    // 513734023usix or 16693567038940111asix
    const match = regex.exec(stringAmount);
    if (!match) {
      return {
        amount: 0,
        denom: "SIX",
      };
    }
    const amount = match[1];
    const denom = match[2];
    const coin = convertSIXTOKEN({
      amount: parseInt(amount),
      denom: denom,
    });
    return coin;
  }else {
    // * EXAMPLES AMOUNT DATA
    // 16693567038940111asix,513734023 usix
    const listCoin = stringAmount.split(",");    
    for (let i = 0; i < listCoin.length; i++) {
      const coin = listCoin[i];
      const match = regex.exec(coin);
      if (!match) {
        return {
          amount: 0,
          denom: "SIX",
        };
      }
      const amount = match[1];
      const denom = match[2];
      const coin_ = convertSIXTOKEN({
        amount: parseInt(amount),
        denom: denom,
      });
      total += coin_.amount;
      _denom = coin_.denom;
    }
    return {
      amount: total,
      denom: _denom,
    };
  }
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

export const formatSchemaName = (schema: string) => {
  const schema_code = schema.split('.')[1];
  if (!schema_code) {
    return schema
  }
  return schema_code
};

export const formatSchemaAction = (action: string) => {
  if (action.length <= 8) {
    return action;
  }else {
    return action.slice(0, 8) + '...';
  }
};