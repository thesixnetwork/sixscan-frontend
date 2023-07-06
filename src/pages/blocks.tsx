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

import { Clickable } from "@/components/Clickable";
import {
  getBlocksResult,
  getLatestBlock,
  getLatestBlocks,
} from "@/service/block";
import { getValidators } from "@/service/staking";
import { Block, BlockchainResult, BlockResult } from "@/types/Block";
import { Validator } from "@/types/Staking";
import { getBlockRewardAmount, getBlockRewardValidator } from "@/utils/block";
import { formatHex } from "@/utils/format";
import { useEffect, useState } from "react";

interface Props {
  latestBlock: Block;
  latestBlocks: BlockchainResult;
  blocksResult: BlockResult[];
  validators: Validator[];
}

export default function Blocks({
  latestBlock,
  latestBlocks,
  blocksResult,
  validators,
}: Props) {

  const [latestBlockState, setLatestBlock] = useState<Block>(latestBlock);
  const [latestBlocksState, setLatestBlocks] = useState<BlockchainResult>(
    latestBlocks
  );
  const [blocksResultState, setBlocksResult] = useState<BlockResult[]>(
    blocksResult
  );
  const [validatorsState, setValidators] = useState<Validator[]>(validators);

  // fetch last block interval
  useEffect(() => {
    const fetchData = async () => {
      const latestBlock = await getLatestBlock();
      setLatestBlock(latestBlock ? latestBlock : latestBlockState);
    };
    // Fetch data initially
    fetchData();
    const intervalId = setInterval(fetchData, 6000);
    return () => clearInterval(intervalId);
  }, []);


  useEffect(() => {
    const fetchData = async () => {
      const latestBlock = latestBlockState
      const latestBlockHeight = latestBlockState
        ? parseInt(latestBlock?.block?.header?.height) ?? null
        : null;
      const minBlockHeight = latestBlockHeight ? latestBlockHeight - 20 : null;
      const [latestBlocks, blocksResult, validators] = await Promise.all([
        getLatestBlocks(minBlockHeight, latestBlockHeight),
        getBlocksResult(minBlockHeight, latestBlockHeight),
        getValidators(),
      ]);
      setLatestBlocks(latestBlocks ? latestBlocks : latestBlocksState);
      setBlocksResult(blocksResult ? blocksResult : blocksResultState);
      setValidators(validators ? validators : validatorsState);
    };
    fetchData();

  }, [latestBlockState]);


  return (
    <Flex minHeight={"100vh"} direction={"column"} bgColor="lightest">
      <Head>
        <title>SIXSCAN</title>
        <meta name="description" content="SIXSCAN" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

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
                      <Td textAlign={"center"}>Block Height</Td>
                      <Td textAlign={"center"}>Block Hash</Td>
                      <Td textAlign={"center"}>Txns</Td>
                      <Td textAlign={"center"}>Fee Recipient</Td>
                      <Td textAlign={"center"}>Reward</Td>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {latestBlocksState?.block_metas.map((block, index) => (
                      <Tr key={index}>
                        <Td textAlign={"center"}>
                          <Flex direction="column">
                            <Clickable
                              href={`/block/${block.header.height}`}
                            >
                              <Text style={{
                                color: "#5C34A2",
                                textDecoration: "none",
                                fontFamily: "Nunito, Helvetica Neue, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol",
                                fontSize: "15px"
                              }}>
                                {block.header.height}
                              </Text>
                            </Clickable>
                            <Text fontSize="xs" color="medium">
                              {new Date(block.header.time).toLocaleString()}
                            </Text>
                          </Flex>
                        </Td>
                        <Td textAlign={"center"}>
                          <Clickable
                            href={`/tx/${block.block_id.hash}`}
                          >
                            <Text style={{
                              color: "#5C34A2",
                              textDecoration: "none",
                              fontFamily: "Nunito, Helvetica Neue, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol",
                              fontSize: "15px"
                            }}>
                              {formatHex(block.block_id.hash)}
                            </Text>
                          </Clickable>
                        </Td>
                        <Td textAlign={"center"}>
                          <Text style={{
                            color: "#5C34A2",
                            textDecoration: "none",
                            fontFamily: "Nunito, Helvetica Neue, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol",
                            fontSize: "15px"
                          }}>
                            {block.num_txs}
                          </Text>
                        </Td>
                        <Td>
                          <Flex direction="row" justifyContent={"center"}>
                            Fee Recipient{` `}
                            <Clickable
                              href={`/address/${getBlockRewardValidator(
                                block,
                                blocksResultState
                              )}`}
                            >
                              <Text style={{
                                color: "#5C34A2",
                                textDecoration: "none",
                                fontFamily: "Nunito, Helvetica Neue, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol",
                                fontSize: "14px",
                                marginLeft: "6px",
                              }}>
                                {validatorsState.map((validator) => {
                                  if (
                                    validator.operator_address ===
                                    getBlockRewardValidator(block, blocksResultState)
                                  ) {
                                    return validator.description.moniker;
                                  }
                                })}
                              </Text>
                            </Clickable>
                          </Flex>
                        </Td>
                        <Td textAlign={"center"} >
                          <Badge>
                            Reward{" "}
                            <Clickable>
                              {getBlockRewardAmount(block, blocksResultState)}
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
    </Flex>
  );
}

export const getServerSideProps = async () => {
  const latestBlock = await getLatestBlock();
  const latestBlockHeight = latestBlock
    ? parseInt(latestBlock?.block?.header?.height) ?? null
    : null;
  const minBlockHeight = latestBlockHeight ? latestBlockHeight - 20 : null;
  const [latestBlocks, blocksResult, validators] = await Promise.all([
    getLatestBlocks(minBlockHeight, latestBlockHeight),
    getBlocksResult(minBlockHeight, latestBlockHeight),
    getValidators(),
  ]);
  return {
    props: { latestBlock, latestBlocks, blocksResult, validators },
  };
};
