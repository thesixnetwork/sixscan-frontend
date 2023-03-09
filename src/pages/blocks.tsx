// ------------------------- Chakra UI -------------------------
import {
  Box,
  Flex,
  Text,
  Container,
  Card,
  CardBody,
  Grid,
  GridItem,
  Icon,
  Stack,
  Link,
  Divider,
  Table,
  TableContainer,
  Tbody,
  Tr,
  Td,
  Badge,
  Thead,
  Spacer,
} from "@chakra-ui/react";
// ------------------------- NextJS -------------------------
import Head from "next/head";
import Image from "next/image";
// ------------------------- Styles -------------------------
import styles from "@/styles/Home.module.css";
import { FaArrowRight, FaDollarSign } from "react-icons/fa";
// ------------- Components ----------------
import NavBar from "@/components/NavBar";
import SearchBar from "@/components/SearchBar";
import CustomCard from "@/components/CustomCard";
import CustomTable from "@/components/CustomTable";
import { Footer } from "@/components/Footer";
import { Clickable } from "@/components/Clickable";
import {
  getBlocksResult,
  getLatestBlock,
  getLatestBlocks,
} from "@/service/block";
import { getValidators } from "@/service/staking";
import { BlockchainResult, BlockResult } from "@/types/Block";
import { Validator } from "@/types/Staking";
import { getBlockRewardAmount, getBlockRewardValidator } from "@/utils/block";
import { formatHex } from "@/utils/format";

export default function Blocks({
  latestBlocks,
  blocksResult,
  validators,
}: {
  latestBlocks: BlockchainResult;
  blocksResult: BlockResult[];
  validators: Validator[];
}) {
  return (
    <Flex minHeight={"100vh"} direction={"column"}>
      <Head>
        <title>SIXSCAN</title>
        <meta name="description" content="SIXSCAN" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NavBar />
      <Box>
        <Container maxW="container.xl">
          <Flex direction="column" gap={3} p={3}>
            <Text fontSize="xl" fontWeight="bold" color={"darkest"}>
              Latest Blocks
            </Text>
            <Divider />
          </Flex>
        </Container>
      </Box>
      <Box p={6}>
        <Container maxW="container.xl">
          <Flex direction={"column"} gap={6}>
            <CustomCard>
              <TableContainer>
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Td>Block Height</Td>
                      <Td>Block Hash</Td>
                      <Td>Txns</Td>
                      <Td>Fee Recipient</Td>
                      <Td isNumeric>Reward</Td>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {latestBlocks.block_metas.map((block, index) => (
                      <Tr key={index}>
                        <Td>
                          <Flex direction="column">
                            <Text>
                              <Clickable
                                underline
                                href={`/block/${block.header.height}`}
                              >
                                {block.header.height}
                              </Clickable>
                            </Text>
                            <Text fontSize="xs" color="medium">
                              {new Date(block.header.time).toLocaleString()}
                            </Text>
                          </Flex>
                        </Td>
                        <Td>
                          <Text>{formatHex(block.block_id.hash)}</Text>
                        </Td>
                        <Td>
                          <Text>{block.num_txs}</Text>
                        </Td>
                        <Td>
                          <Text>
                            Fee Recipient{" "}
                            <Clickable
                              underline
                              href={`/address/${getBlockRewardValidator(
                                block,
                                blocksResult
                              )}`}
                            >
                              {validators.map((validator) => {
                                if (
                                  validator.operator_address ===
                                  getBlockRewardValidator(block, blocksResult)
                                ) {
                                  return validator.description.moniker;
                                }
                              })}
                            </Clickable>
                          </Text>
                        </Td>
                        <Td isNumeric>
                          <Badge>
                            Reward{" "}
                            <Clickable>
                              {getBlockRewardAmount(block, blocksResult)}
                            </Clickable>{" "}
                            SIX
                          </Badge>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </CustomCard>
          </Flex>
        </Container>
      </Box>
      <Spacer />
      <Footer />
    </Flex>
  );
}

export const getServerSideProps = async () => {
  const latestBlock = await getLatestBlock();
  const latestBlockHeight = latestBlock
    ? parseInt(latestBlock.block.header.height)
    : null;
  const minBlockHeight = latestBlockHeight ? latestBlockHeight - 20 : null;
  const latestBlocks =
    latestBlockHeight && minBlockHeight
      ? await getLatestBlocks(minBlockHeight, latestBlockHeight)
      : null;
  const blocksResult =
    latestBlockHeight && minBlockHeight
      ? await getBlocksResult(minBlockHeight, latestBlockHeight)
      : null;
  const validators = await getValidators();
  return {
    props: { latestBlocks, blocksResult, validators },
  };
};
