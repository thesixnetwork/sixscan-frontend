import { Flex, Text } from "@chakra-ui/react";
import { formatTraitValue } from "@/libs/utils/format";

const AttributeBox = (attr: any) => {
  return (
    <Flex p={2} direction={"column"} bgColor={"lightest"} rounded={"lg"}>
      <Text fontSize={"xs"} color={"medium"}>
        {attr.trait_type}
      </Text>
      <Text fontSize={"sm"} color={"dark"}>
        {formatTraitValue(attr.value === "" ? "No Value" : attr.value)}
      </Text>
    </Flex>
  );
};

export default AttributeBox;
