import { getValidator } from "@/service/staking";
import { BlockMeta, BlockResult } from "@/types/Block";

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
  const formattedRewardsValue = rewardsValue
    ? (parseFloat(rewardsValue) * Math.pow(10, -6)).toFixed(6)
    : null;
  return formattedRewardsValue;
};

export const getBlockRewardValidator = (
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
