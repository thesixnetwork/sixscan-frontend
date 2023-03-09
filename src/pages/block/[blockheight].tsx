// ------------------------- Chakra UI -------------------------
import {
  Box,
  Flex,
  Text,
  Container,
  Grid,
  GridItem,
  Divider,
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
// ------------------------- NextJS -------------------------
import Head from "next/head";
// ------------- Components ----------------
import NavBar from "@/components/NavBar";
import CustomCard from "@/components/CustomCard";
import { Footer } from "@/components/Footer";
import { getBlock } from "@/service/block";
import { Block } from "@/types/Block";
import { getTxsFromBlock } from "@/service/txs";
import { Transaction } from "@/types/Txs";
import moment from "moment";
import { FaRegWindowClose, FaSortAmountDown } from "react-icons/fa";
import { Clickable } from "@/components/Clickable";
import { useRouter } from "next/router";

export default function BlockPage({
  block,
  blockTxs,
}: {
  block: Block;
  blockTxs: { txs: Transaction[]; total_count: number };
}) {
  const router = useRouter();
  if (!block) {
    return (
      <Flex minHeight={"100vh"} direction={"column"}>
        <Head>
          <title>SIXSCAN</title>
          <meta name="description" content="SIXSCAN" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <NavBar />
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
        <Footer />
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
      <NavBar />
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
                    <Tab>Txns (All)</Tab>
                    <Tab>Txns (Data Layer)</Tab>
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
                            {blockTxs.txs.map((tx, index) => (
                              <Tr key={index}>
                                <Td>
                                  <Flex direction="row" gap={1} align="center">
                                    {tx.tx_result.code !== 0 && (
                                      <FaRegWindowClose
                                        color="red"
                                        fontSize={12}
                                      />
                                    )}
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
                                <Td>
                                  <Flex direction="row" gap={1} align="center">
                                    <Text>
                                      {
                                        JSON.parse(tx.tx_result.log).find(
                                          (log: any) => log.msg_type === "send"
                                        )?.amount[0].amount
                                      }
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
      <Footer />
    </Flex>
  );
}

export const getServerSideProps = async (context: {
  params: { blockheight: string };
}) => {
  const { blockheight } = context.params;
  const [block, blockTxs] = await Promise.all([
    getBlock(blockheight),
    getTxsFromBlock(blockheight),
  ]);
  return {
    props: {
      block,
      blockTxs,
    },
  };
};
