// ------------------------- Chakra UI -------------------------
import {
  Box,
  Flex,
  Text,
  Container,
  Grid,
  GridItem,
  Divider,
  Link,
  Table,
  TableContainer,
  Tbody,
  Tr,
  Td,
  Spacer,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  TabPanels,
  Thead,
  Button,
} from "@chakra-ui/react";

import { ArrowForwardIcon } from "@chakra-ui/icons";
// ------------------------- NextJS -------------------------
import Head from "next/head";
// ------------- Components ----------------
import NavBar from "@/components/NavBar";
import CustomCard from "@/components/CustomCard";

import { getBlock, getBlockEVM } from "@/service/block";
import { Block, BlockEVM } from "@/types/Block";
import { getTxsFromBlock } from "@/service/txs";
import { Transaction, TxsAll, TxsEVM } from "@/types/Txs";
import moment from "moment";
import { FaRegWindowClose, FaSortAmountDown } from "react-icons/fa";
import { Clickable } from "@/components/Clickable";
import { useRouter } from "next/router";

import axios from "axios";
import ENV from "../../utils/ENV";
import { formatHex } from "@/utils/format";
import { _LOG } from "@/utils/log_helper";

interface Props {
  block: Block;
  blockTxs: { txs: Transaction[]; total_count: number };
  blockEVM: BlockEVM;
  TxsAll: TxsAll[];
  TxsEVM: TxsEVM[];
  TxsCosmos: TxsEVM[];
}

export default function BlockPage({
  block,
  blockTxs,
  blockEVM,
  TxsAll,
  TxsEVM,
  TxsCosmos,
}: Props) {
  const router = useRouter();
  const mockdata = {
    count: "2",
    txs: [
      {
        hash: "shk1",
        event: [{ type: "cosmos", value: "ssd1" }],
      },
      {
        hash: "shk2",
        event: [{ type: "eth", value: "ssd2" }],
      },
    ],
  };

  _LOG(mockdata.txs.filter((tx) => !tx.event.find((event) => event.type === "eth")));

  if (!block) {
    return (
      <Flex minHeight={"100vh"} direction={"column"}>
        <Head>
          <title>SIXSCAN</title>
          <meta name="description" content="SIXSCAN" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <Box
          height="100vh"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Box
            width="80%"
            maxWidth="container.xl"
            padding={6}
            borderRadius={4}
            textAlign="center"
          >
            <Text
              fontSize={{ base: "2xl", lg: "6xl" }}
              fontWeight="bold"
              mb={2}
            >
              Block does not exist
            </Text>
            <Button colorScheme="blue" onClick={() => router.push("/")}>
              Go Home
            </Button>
          </Box>
        </Box>
      </Flex>
    );
  }

  return (
    <Flex minHeight={"100vh"} direction={"column"}>
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
              Block Details
            </Text>
            <Divider />
          </Flex>
        </Container>
      </Box>
      <Box p={6}>
        <Container maxW="container.xl">
          <Grid templateColumns="repeat(12, 1fr)" gap={6}>
            <GridItem colSpan={12}>
              <Flex direction={"column"} gap={6}>
                <CustomCard>
                  <TableContainer>
                    <Table>
                      <Tbody>
                        <Tr>
                          <Td>
                            <Flex direction="column">
                              <Text>{`Block Height:`}</Text>
                            </Flex>
                          </Td>
                          <Td>
                            <Flex direction="column">
                              <Text>{block.block.header.height}</Text>
                            </Flex>
                          </Td>
                        </Tr>
                        <Tr>
                          <Td>
                            <Flex direction="column">
                              <Text>{`Block Hash:`}</Text>
                            </Flex>
                          </Td>
                          <Td>
                            <Flex direction="column">
                              <Text>{block.block_id.hash}</Text>
                            </Flex>
                          </Td>
                        </Tr>
                        <Tr>
                          <Td>
                            <Flex direction="column">
                              <Text>{`Timestamp:`}</Text>
                            </Flex>
                          </Td>
                          <Td>
                            <Flex direction="column">
                              <Text>
                                {`${moment(
                                  block.block.header.time
                                ).fromNow()} (${moment(
                                  block.block.header.time
                                ).format("YYYY-MM-DD HH:mm:ss")})`}
                              </Text>
                            </Flex>
                          </Td>
                        </Tr>
                        <Tr>
                          <Td>
                            <Flex direction="column">
                              <Text>{`Transactions:`}</Text>
                            </Flex>
                          </Td>
                          <Td>
                            <Text>{`${block.block.data.txs.length} transactions in this block`}</Text>
                          </Td>
                        </Tr>
                        <Tr>
                          <Td>
                            <Flex direction="column">
                              <Text>{`Last Commit:`}</Text>
                            </Flex>
                          </Td>
                          <Td>
                            <Text>{block.block.last_commit.block_id.hash}</Text>
                          </Td>
                        </Tr>
                      </Tbody>
                    </Table>
                  </TableContainer>
                </CustomCard>
              </Flex>
            </GridItem>
            <GridItem colSpan={12}>
              <CustomCard>
                <Tabs isLazy>
                  <TabList>
                    <Tab>Txns All({blockTxs.total_count})</Tab>
                    {/* <Tab>Txns EVM ({TxsEVM.length})</Tab>
                    <Tab>Txns Cosmos ({TxsCosmos.length})</Tab> */}
                    {/* <Tab>Txns (Data Layer)</Tab> */}
                  </TabList>
                  <TabPanels>
                    <TabPanel>
                      <Flex
                        direction="row"
                        gap={2}
                        align="center"
                        color={"dark"}
                      >
                        <FaSortAmountDown fontSize={12} />
                        <Text>
                          {`${blockTxs.total_count} total transactions`}
                        </Text>
                      </Flex>
                      <TableContainer>
                        <Table>
                          <Thead>
                            <Tr>
                              <Td>
                                <Text>Txhash</Text>
                              </Td>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {TxsAll.map((tx, index) => (
                              <Tr key={index}>
                                <Td>
                                  <Flex direction="row" gap={1} align="center">
                                    {/* {tx.tx_result.code !== 0 && (
                                      <FaRegWindowClose
                                        color="red"
                                        fontSize={12}
                                      />
                                    )} */}
                                    <Text>
                                      {/* <Clickable
                                        href={`/tx/${
                                          tx.hashEVM === null
                                            ? tx.hash
                                            : tx.hashEVM
                                        }`}
                                        underline
                                      >
                                        {tx.hashEVM === null
                                          ? tx.hash
                                          : tx.hashEVM}
                                      </Clickable> */}
                                      {tx.hashEVM === null ? (
                                        <Clickable
                                          href={`/tx/${tx.hash}`}
                                          underline
                                        >
                                          {tx.hash}
                                        </Clickable>) : (
                                        <Link href={`${ENV.BLOCK_SCOUT_API_URL}/tx/${tx.hashEVM}`}>
                                          <Text
                                            as={"span"}
                                            decoration={"none"}
                                            color="primary.500"
                                          >
                                            {tx.hashEVM}
                                          </Text>
                                        </Link>)
                                      }
                                    </Text>
                                  </Flex>
                                </Td>

                                {/* <Td>
                                  <Flex direction="row" gap={1} align="center">
                                    <Text>
                                     {
                                      JSON.parse(tx.tx_result.log)[0].events.find((e:any) => e.type === "transfer")?.attributes.find((e:any) => e.key === "amount").value
                                     }
                                    </Text>
                                  </Flex>
                                </Td> */}
                              </Tr>
                            ))}
                          </Tbody>
                        </Table>
                      </TableContainer>
                    </TabPanel>

                    <TabPanel>
                      <Flex
                        direction="row"
                        gap={2}
                        align="center"
                        color={"dark"}
                      >
                        <FaSortAmountDown fontSize={12} />
                        <Text>{`${TxsEVM.length} total transactions`}</Text>
                      </Flex>
                      <TableContainer>
                        <Table>
                          <Thead>
                            <Tr>
                              <Td>
                                <Text>Txhash</Text>
                              </Td>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {TxsEVM.map((tx, index) => (
                              <Tr key={index}>
                                <Td>
                                  <Flex direction="row" gap={1} align="center">
                                    <Text>
                                      <Clickable
                                        href={`/tx/${tx.hash}`}
                                        underline
                                      >
                                        {tx.hash}
                                      </Clickable>
                                    </Text>
                                  </Flex>
                                </Td>
                              </Tr>
                            ))}
                          </Tbody>
                        </Table>
                      </TableContainer>
                    </TabPanel>

                    <TabPanel>
                      <Flex
                        direction="row"
                        gap={2}
                        align="center"
                        color={"dark"}
                      >
                        <FaSortAmountDown fontSize={12} />
                        <Text>{`${TxsCosmos.length} total transactions`}</Text>
                      </Flex>
                      <TableContainer>
                        <Table>
                          <Thead>
                            <Tr>
                              <Td>
                                <Text>Txhash</Text>
                              </Td>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {TxsCosmos.map((tx, index) => (
                              <Tr key={index}>
                                <Td>
                                  <Flex direction="row" gap={1} align="center">
                                    <Text>
                                      <Clickable
                                        href={`/tx/${tx.hash}`}
                                        underline
                                      >
                                        {tx.hash}
                                      </Clickable>
                                    </Text>
                                  </Flex>
                                </Td>
                              </Tr>
                            ))}
                          </Tbody>
                        </Table>
                      </TableContainer>
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </CustomCard>
            </GridItem>
          </Grid>
        </Container>
      </Box>
      <Spacer />
    </Flex>
  );
}

export const getServerSideProps = async (context: {
  params: { blockheight: string };
}) => {
  const { blockheight } = context.params;
  let TxsAll;
  let TxsEVM;
  let TxsCosmos;
  const [block, blockTxs] = await Promise.all([
    getBlock(blockheight),
    getTxsFromBlock(blockheight),
  ]);
  if (blockTxs) {
    TxsAll = blockTxs.txs.map((x: any) => ({
      hash: x.hash,
      hashEVM: JSON.parse(x.tx_result.log)[0].events.find(
        (x: any) => x.type === "ethereum_tx"
      )
        ? JSON.parse(x.tx_result.log)[0]
          .events.find((x: any) => x.type === "ethereum_tx")
          ?.attributes.find((x: any) => x.key === "ethereumTxHash").value
        : null,
    }));
    TxsEVM = blockTxs.txs
      .filter((x: any) =>
        x.tx_result.events.find((x: any) => x.type === "ethereum_tx")
      )
      .map((x: any) => ({
        hash: JSON.parse(x.tx_result.log)[0]
          .events.find((x: any) => x.type === "ethereum_tx")
          .attributes.find((x: any) => x.key === "ethereumTxHash").value,
      }));
    TxsCosmos = blockTxs.txs
      .filter(
        (x: any) =>
          !x.tx_result.events.find((x: any) => x.type === "ethereum_tx")
      )
      .map((x: any) => ({ hash: x.hash }));
  }
  // if(TxsAll === undefined){
  //   TxsAll = null;
  // }
  const blockEVM = await getBlockEVM(blockheight);
  return {
    props: {
      block,
      blockTxs,
      blockEVM,
      TxsAll,
      TxsEVM,
      TxsCosmos,
    },
  };
};
