import {
  Flex,
  Text,
  Image,
  Link,
  chakra,
  shouldForwardProp,
} from "@chakra-ui/react";
import { motion, isValidMotionProp } from "framer-motion";
import CustomCard from "@/components/CustomCard";
import { NftData } from "@/types/Nftmngr";
import { LinkComponent } from "./Chakralink";

const ChakraBox = chakra(motion.div, {
  /**
   * Allow motion props and non-Chakra props to be forwarded.
   */
  shouldForwardProp: (prop) =>
    isValidMotionProp(prop) || shouldForwardProp(prop),
});

const NftCard = ({ metadata }: { metadata: NftData }) => {
  return (
    <CustomCard>
      <LinkComponent href={`/schema/${metadata.nft_schema_code}/${metadata.token_id}`}>
        <Image
          src={
            metadata.onchain_image
              ? metadata.onchain_image
              : metadata.origin_image
          }
          alt="mfer"
          width="100%"
        />
        <Flex direction="column" p={2}>
          <Flex direction="row" gap={2} align="center">
            <Text fontSize="sm" fontWeight="bold" color="dark">
              TokenID
            </Text>
            <Text fontSize="sm" color={"primary.500"}>
              {metadata.token_id}
            </Text>
          </Flex>
        </Flex>
      </LinkComponent>
    </CustomCard>
  );
};

export default NftCard;
