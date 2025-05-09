import {
  toBech32,
  fromBase64,
  fromHex,
  toHex,
  fromBech32,
} from "@cosmjs/encoding";
import { sha256 } from "@cosmjs/crypto";
import RIPEMD160 from "ripemd160";

export function operatorAddressToAccount(operAddress: string) {
  const { prefix, data } = fromBech32(operAddress);
  if (prefix === "iva") {
    return toBech32("iaa", data);
  }
  if (prefix === "crocncl") {
    return toBech32("cro", data);
  }
  return toBech32(prefix.replace("valoper", ""), data);
}

export function pubkeyToAccountAddress(pubkey: Uint8Array, prefix: string) {
  return toBech32(prefix, pubkey, 40);
}

export function addressDecode(address: string) {
  return fromBech32(address);
}

export function addressEnCode(prefix: string, pubkey: Uint8Array) {
  return toBech32(prefix, pubkey);
}

export function extractAccountNumberAndSequence(ret: any) {
  let account = ret.value;
  if (ret.value && ret.value.base_vesting_account) {
    // vesting account
    account = ret.value.base_vesting_account?.base_account;
  } else if (ret.value && ret.value.base_account) {
    // evmos based account
    account = ret.value.base_account;
  }
  const accountNumber = account.account_number;
  const sequence = account?.sequence || 0;

  return {
    accountNumber,
    sequence,
  };
}

export function consensusPubkeyToHexAddress(consensusPubkey: any) {
  let raw = null;
  if (typeof consensusPubkey === "object") {
    if (consensusPubkey.type === "tendermint/PubKeySecp256k1") {
      raw = new RIPEMD160()
        .update(Buffer.from(sha256(fromBase64(consensusPubkey.value))))
        .digest("hex")
        .toUpperCase();
      return raw;
    }
    raw = sha256(fromBase64(consensusPubkey.value));
  } else {
    raw = sha256(
      fromHex(
        toHex(fromBech32(consensusPubkey).data)
          .toUpperCase()
          .replace("1624DE6420", "")
      )
    );
  }
  const address = toHex(raw).slice(0, 40).toUpperCase();
  return address;
}

export interface ConsensusPubkey {
  "@type": string;
  key: string;
}

export function getConsensusAddress(pubkey: ConsensusPubkey) {
  const tendermintPubkey = {
    type: "tendermint/PubKeyEd25519",
    value: pubkey.key,
  };

  return consensusPubkeyToHexAddress(tendermintPubkey);
}
