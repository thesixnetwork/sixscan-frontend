import React from "react";
import {
  Box,
  Grid,
  Text,
  Tooltip,
  HStack,
  VStack,
  useColorModeValue,
  Skeleton,
} from "@chakra-ui/react";
import Link from "next/link";

interface ValidatorUptime {
  consensusAddress: string;
  operatorAddress: string;
  moniker: string;
  votingPower: string;
  blocks: {
    height: number;
    signed: boolean;
  }[];
}

interface UptimeGridProps {
  validators: ValidatorUptime[];
  isLoading?: boolean;
  maxBlocks?: number;
}

export const UptimeGrid: React.FC<UptimeGridProps> = ({
  validators,
  isLoading = false,
  maxBlocks = 50,
}) => {
  const blockBgSigned = useColorModeValue("green.500", "green.300");
  const blockBgMissed = useColorModeValue("red.500", "red.300");
  const cardBg = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  if (isLoading) {
    return (
      <Grid
        templateColumns={{
          base: "1fr",
          md: "repeat(2, 1fr)",
          lg: "repeat(3, 1fr)",
        }}
        gap={4}
      >
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} height="120px" />
        ))}
      </Grid>
    );
  }

  return (
    <Grid
      templateColumns={{
        base: "1fr",
        md: "repeat(2, 1fr)",
        lg: "repeat(3, 1fr)",
      }}
      gap={4}
    >
      {validators.map((validator) => (
        <Box
          key={validator.consensusAddress}
          bg={cardBg}
          borderRadius="lg"
          border="1px"
          borderColor={borderColor}
          p={4}
        >
          <VStack align="stretch" spacing={3}>
            <HStack justify="space-between">
              <Tooltip label={validator.operatorAddress}>
                <Text fontWeight="bold" fontSize="sm" isTruncated>
                  {validator.moniker}
                </Text>
              </Tooltip>
              <Text fontSize="xs" color="gray.500">
                Power: {(Number(validator.votingPower)/1e6).toLocaleString()}
              </Text>
            </HStack>

            <Grid
              templateColumns={`repeat(${Math.min(25, maxBlocks)}, 1fr)`}
              gap={0.5}
            >
              {validator.blocks.slice(-maxBlocks).map((block) => (
                <Tooltip
                  key={`${validator.consensusAddress}-${block.height}`}
                  label={`Block ${block.height}: ${
                    block.signed ? "Signed" : "Missed"
                  }`}
                >
                  <Link href={`/blocks/${block.height}`}>
                    <Box
                      w="full"
                      h="4"
                      bg={block.signed ? blockBgSigned : blockBgMissed}
                      borderRadius="sm"
                      transition="transform 0.2s"
                      _hover={{
                        transform: "scale(1.2)",
                      }}
                    />
                  </Link>
                </Tooltip>
              ))}
            </Grid>
          </VStack>
        </Box>
      ))}
    </Grid>
  );
};

export default UptimeGrid;
