import { getValidator } from "@/service/staking";
import { BlockMeta, BlockResult } from "@/types/Block";
import { _LOG } from "@/utils/log_helper";

export const getBlockRewardAmount = (
  block: BlockMeta,
  blockResults: BlockResult[]
): string | null => {
  const targetBlockResult = blockResults.find(
    (blockResult) => blockResult.height === block.header.height
  );
  const rewardsAttribute = targetBlockResult?.begin_block_events
    .find((event) => event.type === "rewards")
    ?.attributes.find(
      (attribute) =>
        attribute.key &&
        Buffer.from(attribute.key, "base64").toString("utf-8") === "amount"
    );
  const rewardsValue = rewardsAttribute
    ? Buffer.from(rewardsAttribute.value, "base64").toString("utf-8")
    : null;

  // if reward value ontain , then it is a multi reward
  // so we need to find the usix reward 
  // assume 558104723936170211.091643275000000000asix,135442.904680851063423458usix
  if (rewardsValue?.includes("asix")) {
    const rewards = rewardsValue?.split(",")
    const asixValue = rewards[0]
    const usixValue = rewards[1]

    const _asixReward = asixValue.split("asix")
    const _asixRewardValue = _asixReward? parseFloat(_asixReward[0]) : 0
    const _usixFromAsix = _asixRewardValue * Math.pow(10, -12)

    _LOG("_asixRewardValue", _usixFromAsix);
    


    const _usixReward = usixValue.split("usix")
    const _usixRewardValue = _usixReward? parseFloat(_usixReward[0]) : 0

    const usixRewardValue = _usixFromAsix + _usixRewardValue
    _LOG("usixRewardValue", usixRewardValue);
  

    const formattedRewardsValue = usixRewardValue? (usixRewardValue * Math.pow(10, -6)).toFixed(6)
    : null;
    return formattedRewardsValue;
  }


  const formattedRewardsValue = rewardsValue
    ? (parseFloat(rewardsValue) * Math.pow(10, -6)).toFixed(6)
    : null;
  return formattedRewardsValue;
};

export const getBlockRewardValidator = (
  block: BlockMeta,
  blockResults: BlockResult[]|null
): string | null => {
  const targetBlockResult = blockResults?.find(
    (blockResult) => blockResult.height === block.header.height
  );
  const rewardsAttribute = targetBlockResult?.begin_block_events
    .find((event) => event.type === "rewards")
    ?.attributes.find(
      (attribute) =>
        attribute.key &&
        Buffer.from(attribute.key, "base64").toString("utf-8") === "validator"
    );
  const rewardsValue = rewardsAttribute
    ? Buffer.from(rewardsAttribute.value, "base64").toString("utf-8")
    : null;
  return rewardsValue;
};

export const getValidatorMoniker = async (
  block: BlockMeta,
  blockResults: BlockResult[]
): Promise<string | null> => {
  const validatorAddress = getBlockRewardValidator(block, blockResults);
  const validator = validatorAddress
    ? await getValidator(validatorAddress)
    : null;
  const validatorMoniker = validator ? validator.description.moniker : null;
  return validatorMoniker;
};
