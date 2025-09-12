import { Text, Badge, Tooltip } from "@chakra-ui/react";
import React from "react";

interface Coin {
  denom: string;
  amount: number;
}

interface TXCoin {
  denom: string;
  amount: string;
}

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

export const formatCoinNumber = (
  num: TXCoin[] | any,
  decimalPoints: number = 2
): string => {
  // if input is not array
  const isArray = Array.isArray(num);

  if (!isArray) {
    const amount = convertAmountToSix({
      denom: num.denom,
      amount: Number(num.amount),
    });
    const [integerPart, decimalPart] = amount.toFixed(decimalPoints).split(".");
    const formattedIntegerPart = integerPart.replace(
      /(\d)(?=(\d{3})+(?!\d))/g,
      "$1,"
    );
    return decimalPoints > 0
      ? `${formattedIntegerPart}.${decimalPart}`
      : formattedIntegerPart;
  }

  if (num.length > 1) {
    let total = 0;
    for (let i = 0; i < num.length; i++) {
      if (num[i] == undefined) return "0";
      const amount = convertAmountToSix({
        denom: num[i].denom,
        amount: Number(num[i].amount),
      });
      total += amount;
    }

    const [integerPart, decimalPart] = total.toFixed(decimalPoints).split(".");
    const formattedIntegerPart = integerPart.replace(
      /(\d)(?=(\d{3})+(?!\d))/g,
      "$1,"
    );
    return decimalPoints > 0
      ? `${formattedIntegerPart}.${decimalPart}`
      : formattedIntegerPart;
  } else {
    if (num[0] == undefined) return "0";
    // THIS IS RARE CASE BUT IT WILL HAPPEN IF DO NOT CHANGE INDEXER
    if (num[0].amount.indexOf(",") > -1 && num[0].denom === "usix") {
      // split amount with comma
      const usix = num[0].amount.split(",");
      let total = 0;
      // convert to SIX
      const asix_amount = convertAmountToSix({
        denom: "asix",
        amount: Number(usix[0]),
      });
      // convert to ASIX
      const usix_amount = convertAmountToSix({
        denom: "usix",
        amount: Number(usix[1]),
      });

      total = usix_amount + asix_amount;

      const [integerPart, decimalPart] = Number(total)
        .toFixed(decimalPoints)
        .split(".");
      const formattedIntegerPart = integerPart.replace(
        /(\d)(?=(\d{3})+(?!\d))/g,
        "$1,"
      );
      return decimalPoints > 0
        ? `${formattedIntegerPart}.${decimalPart}`
        : formattedIntegerPart;
    } else {
      const amount = convertAmountToSix({
        denom: num[0].denom,
        amount: Number(num[0].amount),
      });

      const [integerPart, decimalPart] = amount
        .toFixed(decimalPoints)
        .split(".");
      const formattedIntegerPart = integerPart.replace(
        /(\d)(?=(\d{3})+(?!\d))/g,
        "$1,"
      );
      return decimalPoints > 0
        ? `${formattedIntegerPart}.${decimalPart}`
        : formattedIntegerPart;
    }
  }
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

export const formatMethod = (
  method: string,
  inputAddress?: string,
  decodeTxAddress?: string,
  action_name?: string
) => {
  // check input in not null
  if (!method) {
    return "";
  }
  if (
    method.split(".")[method.split(".").length - 1].slice(3).toUpperCase() ===
    "PERFORMACTIONBYADMIN"
  ) {
    // return action_name? "ACTION: " + action_name : "ACTION";
    return (
      <Badge justifyContent={"center"} display={"flex"} width="100%">
        <Text
          style={{
            textDecoration: "none",
            fontFamily:
              "Nunito, Helvetica Neue, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol",
            fontSize: "10px",
            textAlign: "center",
          }}
        >
          Action:
        </Text>
        <Tooltip label={action_name} aria-label="A tooltip">
          <Text
            marginLeft={"4px"}
            style={{
              color: "#5C34A2",
              textDecoration: "none",
              fontFamily:
                "Nunito, Helvetica Neue, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol",
              fontSize: "10px",
              textAlign: "center",
            }}
          >
            {formatSchemaAction(action_name)}
          </Text>
        </Tooltip>
      </Badge>
    );
  } else if (
    method.split(".")[method.split(".").length - 1].slice(3).toUpperCase() ===
    "PERFORMMULTITOKENACTION"
  ) {
    return (
      <Badge justifyContent={"center"} display={"flex"} width="100%">
        <Text
          style={{
            textDecoration: "none",
            fontFamily:
              "Nunito, Helvetica Neue, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol",
            fontSize: "10px",
            textAlign: "center",
          }}
        >
          Action:
        </Text>
        <Tooltip label={action_name} aria-label="A tooltip">
          <Text
            marginLeft={"4px"}
            style={{
              color: "#5C34A2",
              textDecoration: "none",
              fontFamily:
                "Nunito, Helvetica Neue, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol",
              fontSize: "10px",
              textAlign: "center",
            }}
          >
            {formatSchemaAction(action_name)}
          </Text>
        </Tooltip>
      </Badge>
    );
  } else if (
    method.split(".")[method.split(".").length - 1].slice(3).toUpperCase() ===
    "WITHDRAWDELEGATORREWARD"
  ) {
    return (
      <Badge justifyContent={"center"} display={"flex"} width="100%">
        <Text
          style={{
            textDecoration: "none",
            fontFamily:
              "Nunito, Helvetica Neue, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol",
            fontSize: "10px",
            textAlign: "center",
          }}
        >
          CLAIMREWARD
        </Text>
      </Badge>
    );
  } else if (
    method.split(".")[method.split(".").length - 1].slice(3).toUpperCase() ===
    "SEND"
  ) {
    if (decodeTxAddress === inputAddress) {
      return (
        <Badge justifyContent={"center"} display={"flex"} width="100%">
          <Text
            style={{
              textDecoration: "none",
              fontFamily:
                "Nunito, Helvetica Neue, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol",
              fontSize: "10px",
              textAlign: "center",
            }}
          >
            RECEIVE
          </Text>
        </Badge>
      );
    } else {
      return (
        <Badge justifyContent={"center"} display={"flex"} width="100%">
          <Text
            style={{
              textDecoration: "none",
              fontFamily:
                "Nunito, Helvetica Neue, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol",
              fontSize: "10px",
              textAlign: "center",
            }}
          >
            SEND
          </Text>
        </Badge>
      );
    }
  } else {
    return (
      <Badge justifyContent={"center"} display={"flex"} width="100%">
        <Text
          style={{
            textDecoration: "none",
            fontFamily:
              "Nunito, Helvetica Neue, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol",
            fontSize: "10px",
            textAlign: "center",
          }}
        >
          {method
            .split(".")
            [method.split(".").length - 1].slice(3)
            .toUpperCase()}
        </Text>
      </Badge>
    );
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

export const convertTXAmountToSix = (amount: TXCoin): number => {
  if (amount.amount == undefined || Number.isNaN(amount.amount)) return 0;
  if (amount.denom === "usix") {
    return convertUsixToSix(Number(amount.amount));
  } else if (amount.denom === "asix") {
    console.log(convertAsixToSix(Number(amount.amount)));
    return convertAsixToSix(Number(amount.amount));
  } else {
    return 0;
  }
};

export const convertAmountToSix = (amount: Coin): number => {
  if (amount?.amount == undefined || Number.isNaN(amount.amount)) return 0;
  if (amount.denom === "usix") {
    return convertUsixToSix(amount.amount);
  } else if (amount.denom === "asix") {
    return convertAsixToSix(amount.amount);
  }
  return amount.amount;
};

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
    };
  } else {
    return {
      amount: amount,
      denom: denom,
    };
  }
};

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
  } else {
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

export const formatEng = (key: string) => {
  if (key == "@type") {
    return "@Type";
  }
  const splitParts = key.split("_");
  const formattedKey = splitParts
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
  return `${formattedKey}`;
};

export const formatBank = (key: string) => {
  if (key == "from_address") {
    return "From";
  }
  if (key == "to_address") {
    return "To";
  }
  key = formatEng(key);
  return `${key}`;
};

export const formatSchema = (schema: string) => {
  const schema_code = schema.split(".")[1];
  if (schema_code.length <= 10) {
    return schema_code.slice(0, 10);
  } else {
    return schema_code.slice(0, 10) + "...";
  }
};

export const formatSchemaName = (schema: string) => {
  const schema_code = schema.split(".")[1];
  if (!schema_code) {
    return schema;
  }
  return schema_code;
};

export const formatSchemaAction = (action: any) => {
  // console.log(action);
  // check if action is array or not
  if (Array.isArray(action)) {
    let action_ = "MultiAction";
    // for (let i = 0; i < action.length; i++) {
    //   if (i === action.length - 1) {
    //     action_ += action[i];
    //   } else {
    //     action_ += action[i] + ",";
    //   }
    // }
    return action_;
  }

  if (action) {
    if (action.length <= 8) {
      return action;
    } else {
      return action.slice(0, 8) + "...";
    }
  } else {
    return "";
  }
};

export const calculateTxFee = (tx: any) => {
  const { decode_tx, type, original_type } = tx;

  if (!decode_tx) {
    return 0;
  }

  if (decode_tx.fee_amount) {
    const feeAmount = parseInt(decode_tx.fee_amount, 10);
    const isEvmTx =
      type === "/ethermint.evm.v1.MsgEthereumTx" ||
      original_type === "/ethermint.evm.v1.MsgEthereumTx";

    if (isEvmTx) {
      return feeAmount / 1e18;
    } else {
      return feeAmount / 1e6;
    }
  }

  if (decode_tx.gas_wanted) {
    // This logic remains the same as your original fallback
    const estimatedFeeInUsix = (parseInt(decode_tx.gas_wanted, 10) * 125) / 100;
    return convertUsixToSix(estimatedFeeInUsix);
  }

  return 0;
};
