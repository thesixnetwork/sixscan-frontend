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
  TableContainer,
  Table,
  Tr,
  Td,
  Badge,
  Tbody,
  Thead,
  Image,
  Spacer,
} from "@chakra-ui/react";
// ------------------------- NextJS -------------------------
import Head from "next/head";
// import Image from "next/image";
// ------------------------- Styles -------------------------
import styles from "@/styles/Home.module.css";
import { FaDollarSign } from "react-icons/fa";
// ------------- Components ----------------
import NavBar from "@/components/NavBar";
import SearchBar from "@/components/SearchBar";
import CustomCard from "@/components/CustomCard";
import CustomTable from "@/components/CustomTable";
import moment from "moment";

import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react'

import { Clickable } from "@/components/Clickable";
import { formatHex, formatNumber, formatSchema, formatSchemaAction, convertUsixToSix } from "@/utils/format";

// -------- service ----------
import {
  getNFTActionCountStat,
  getNFTActionCountStatDaily,
  getTotalNFTCollection,
  getTotalNFTS,
  getNFTFee,
  getLatestAction
} from "@/service/nftmngr";
import { DataNFTStat, BlockNFTStat } from "@/types/Nftmngr";


const data = [
  {
    title: "PRICE",
    value: 6,
    badge: "1.5%",
    icon: FaDollarSign,
  },
  {
    title: "STAKED",
    value: 22000000,
    badge: "65%",
    icon: FaDollarSign,
  },
  {
    title: "MARKET CAP",
    value: 23456789,
    badge: "1.5%",
    icon: FaDollarSign,
  },
  {
    title: "INFLATION",
    value: "8%",
    badge: "1.5%",
    icon: FaDollarSign,
  },
];

const maintain = true

interface Props {
  modalstate: { isOpen: boolean; onOpen: () => void; onClose: () => void };
  nftActionCount: DataNFTStat;
  blockNFTStat: BlockNFTStat;
  latestAction: any;
}

export default function Data({ modalstate, nftActionCount, blockNFTStat, latestAction }: Props) {
  console.log(JSON.parse(latestAction.txs[5].rawTx))
  return (
    <Flex minHeight={"100vh"} direction={"column"} bgColor="lightest">
      {/* testing eslint */}
      <Head>
        <title>SIXSCAN</title>
        <meta name="description" content="SIXSCAN" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box
        paddingTop={10}
        paddingBottom={20}
        style={{
          backgroundImage: `url("/dot-map.png"), linear-gradient(269.41deg, #4E9DE7 1.01%, #9747FF 96.67%)`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        <Container maxW="container.lg">
          <Flex direction="column" gap={3} p={3}>
            <Text fontSize="xl" fontWeight="bold" color={"lightest"}>
              Data Layer Explorer
            </Text>
            <SearchBar
              hasButton
              placeHolder="Search by Address / Txn Hash / Block"
              modalstate={modalstate}
            />
          </Flex>
        </Container>
      </Box>
      <Box marginTop={-10} >
        <Container maxW="container.lg">
          <Flex direction="column" gap={3} p={3}>
            <Grid templateColumns="repeat(12, 1fr)" gap={6}>
              <GridItem colSpan={{ base: 12, md: 6 }}>
                <CustomCard title={"Trending"}>
                  <TableContainer>
                    {maintain ? <Alert status='info' height="350px">
                      <AlertIcon />
                      NFT Trending Will Be Support On Testnet Soon. <br />
                      Please Stay tune.
                    </Alert> :
                      <Table>
                        <Thead>
                          <Tr>
                            <Td>
                              <Text fontSize="sm" color={"medium"}>
                                Collection
                              </Text>
                            </Td>
                            <Td>
                              <Text fontSize="sm" color={"medium"}>
                                Action
                              </Text>
                            </Td>
                            <Td>
                              <Text fontSize="sm" color={"medium"}>
                                Action Count
                              </Text>
                            </Td>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {nftActionCount && nftActionCount.data.map((item, index) => (
                            <Tr key={index}>
                              <Td>
                                <Flex direction="row" alignItems="center" gap={3}>
                                  <Text fontWeight={"bold"}>{index + 1}</Text>
                                  <Image
                                    src="/logo-nftgen2-01.png"
                                    alt="gen2"
                                    width={"40px"}
                                    height={"40px"}
                                  />
                                  <Text fontWeight={"bold"}>
                                    {formatSchema(item._id.schema_code)}
                                  </Text>
                                </Flex>
                              </Td>
                              <Td>
                                <Flex direction="row" alignItems="center" gap={3}>
                                  <Text>{formatSchemaAction(item._id.action)}</Text>
                                </Flex>
                              </Td>
                              <Td>
                                <Flex direction="row" alignItems="center" gap={3}>
                                  <Text>{item.count}</Text>
                                </Flex>
                              </Td>
                            </Tr>
                          ))}
                        </Tbody>
                      </Table>
                    }
                  </TableContainer>
                </CustomCard>
              </GridItem>
              <GridItem colSpan={{ base: 12, md: 6 }}>
                <Grid templateColumns="repeat(2, 1fr)" gap={6}>
                  <GridItem colSpan={2}>
                    <Card style={{
                      background: "#DADEF2",
                      mixBlendMode: "normal",
                      border: "2px solid #DADEF2",
                      backdropFilter: "blur(3px)",
                      borderRadius: "12px",
                      opacity: "0.8"
                    }} size="lg">
                      <CardBody>
                        <Flex direction="column" py={2}>
                          <Text
                            fontSize="xl"
                            fontWeight="bold"
                            style={{
                              background: "linear-gradient(to right, #33337E 0%, #33337E 80%, #7C5CCE 90%, #7C5CCE 100%)",
                              WebkitBackgroundClip: "text",
                              WebkitTextFillColor: "transparent"
                            }}
                          >
                            NFT Gen 2 is a Dynamic Data Layer
                          </Text>
                          <Text
                            fontSize="xl"
                            fontWeight="bold"
                            style={{
                              background: "linear-gradient(to right, #33337E 0%, #33337E 80%, #7C5CCE 90%, #7C5CCE 100%)",
                              WebkitBackgroundClip: "text",
                              WebkitTextFillColor: "transparent"
                            }}
                          >
                            that runs on the SIX Protocol Chain
                          </Text>
                        </Flex>
                        <Text fontSize="xs" style={{
                          background: "linear-gradient(to right, #33337E 0%, #33337E 50%, #7C5CCE 50%, #7C5CCE 100%)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent"
                        }}>
                          POWERED BY SIX PROTOCOL
                        </Text>
                      </CardBody>
                    </Card>
                  </GridItem>
                  <GridItem colSpan={2}>
                    <Card size="lg">
                      <CardBody p={0}>
                        <Grid templateColumns="repeat(2, 1fr)">
                          <GridItem
                            colSpan={{ base: 2, lg: 1 }}
                            borderBottom={"1px solid"}
                            borderRight="1px solid"
                            borderColor={"light"}
                          >
                            <Flex
                              direction={"row"}
                              p={4}
                              alignItems={"center"}
                              gap={3}
                            >
                              <Image
                                src="/icon-stat1.png"
                                alt="icon-stat"
                                width={"20px"}
                                height={"25px"}
                              />
                              <Flex direction={"column"}>
                                <Text fontSize="sm" color={"medium"}>
                                  TOTAL COLLECTIONS
                                </Text>
                                <Flex
                                  direction={"row"}
                                  alignItems={"center"}
                                  gap={2}
                                >
                                  <Text
                                    fontSize="xl"
                                    fontWeight="bold"
                                    color={"darkest"}
                                  >
                                    {blockNFTStat ? blockNFTStat.totalNFTS.total : 0}
                                  </Text>
                                </Flex>
                              </Flex>
                            </Flex>
                          </GridItem>

                          <GridItem
                            colSpan={{ base: 2, lg: 1 }}
                            borderBottom={"1px solid"}
                            borderRight="1px solid"
                            borderColor={"light"}
                          >
                            <Flex
                              direction={"row"}
                              p={4}
                              alignItems={"center"}
                              gap={3}
                            >
                              <Image
                                src="/icon-stat1.png"
                                alt="icon-stat"
                                width={"20px"}
                                height={"25px"}
                              />
                              <Flex direction={"column"}>
                                <Text fontSize="sm" color={"medium"}>
                                  TOTAL NFTS
                                </Text>
                                <Flex
                                  direction={"row"}
                                  alignItems={"center"}
                                  gap={2}
                                >
                                  <Text
                                    fontSize="xl"
                                    fontWeight="bold"
                                    color={"darkest"}
                                  >
                                    {blockNFTStat ? blockNFTStat.totalNFTCollection.total : 0}
                                  </Text>
                                </Flex>
                              </Flex>
                            </Flex>
                          </GridItem>

                          <GridItem
                            colSpan={{ base: 2, lg: 1 }}
                            borderBottom={"1px solid"}
                            borderRight="1px solid"
                            borderColor={"light"}
                          >
                            <Flex
                              direction={"row"}
                              p={4}
                              alignItems={"center"}
                              gap={3}
                            >
                              <Image
                                src="/icon-stat1.png"
                                alt="icon-stat"
                                width={"20px"}
                                height={"25px"}
                              />
                              <Flex direction={"column"}>
                                <Text fontSize="sm" color={"medium"}>
                                  SCHEMA FEE
                                </Text>
                                <Flex
                                  direction={"row"}
                                  alignItems={"center"}
                                  gap={2}
                                >
                                  <Text
                                    fontSize="xl"
                                    fontWeight="bold"
                                    color={"darkest"}
                                  >
                                    {blockNFTStat ? convertUsixToSix(parseInt((blockNFTStat.nftFee).replace("usix", ""))) : 0}
                                  </Text>
                                  <Text fontSize="sm" color={"medium"}>
                                    SIX
                                  </Text>
                                </Flex>
                              </Flex>
                            </Flex>
                          </GridItem>

                          <GridItem
                            colSpan={{ base: 2, lg: 1 }}
                            borderBottom={"1px solid"}
                            borderRight="1px solid"
                            borderColor={"light"}
                          >
                            <Flex
                              direction={"row"}
                              p={4}
                              alignItems={"center"}
                              gap={3}
                            >
                              <Image
                                src="/icon-stat1.png"
                                alt="icon-stat"
                                width={"20px"}
                                height={"25px"}
                              />
                              <Flex direction={"column"}>
                                <Text fontSize="sm" color={"medium"}>
                                  ACTIONS
                                </Text>
                                <Flex
                                  direction={"row"}
                                  alignItems={"center"}
                                  gap={2}
                                >
                                  <Text
                                    fontSize="xl"
                                    fontWeight="bold"
                                    color={"darkest"}
                                  >
                                    {blockNFTStat ? blockNFTStat.action24h : 0}
                                  </Text>
                                  <Text fontSize="sm" color={"medium"}>
                                    (24h)
                                  </Text>
                                </Flex>
                              </Flex>
                            </Flex>
                          </GridItem>

                        </Grid>
                      </CardBody>
                    </Card>
                  </GridItem>
                </Grid>
              </GridItem>
              <GridItem colSpan={12}>
                <CustomCard
                  title={"Latest Actions"}
                  footer={"VIEW ALL ACTIONS"}
                  href={"/action"}
                >
                  <TableContainer>
                    <Table>
                      <Thead>
                        <Tr>
                          <Td>Txhash</Td>
                          <Td>Action</Td>
                          <Td>Age</Td>
                          <Td>Block</Td>
                          <Td>By</Td>
                          <Td>Schema</Td>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {latestAction && latestAction.txs.map((x: any, index: number) => (
                          <Tr key={index}>
                            <Td>
                              <Flex direction="column">
                                <Clickable
                                  href={`/block/${x.txhash}`}
                                >
                                  <Text style={{
                                    color: "#5C34A2",
                                    textDecoration: "none",
                                    fontFamily: "Nunito, Helvetica Neue, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol",
                                    fontSize: "12px"
                                  }}>
                                    {formatHex(x.txhash)}
                                  </Text>
                                </Clickable>
                              </Flex>
                            </Td>
                            <Td>
                              <Badge>
                                Action{" "}
                                <Clickable>
                                {x.type
                                          .split(".")
                                        [x.type.split(".").length - 1].slice(
                                          3
                                        )}
                                </Clickable>{" "}
                              </Badge>
                            </Td>
                            <Td>
                              <Text>{moment(x.time_stamp).fromNow()}</Text>
                            </Td>
                            <Td>
                              <Clickable
                                href={`/block/${x.block_height}`}
                              >
                                <Text style={{
                                  color: "#5C34A2",
                                  textDecoration: "none",
                                  fontFamily: "Nunito, Helvetica Neue, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol",
                                  fontSize: "12px"
                                }}>
                                  {x.block_height}
                                </Text>
                              </Clickable>
                            </Td>
                            <Td >
                              <Clickable
                                href={`/block/${x.block_height}`}
                              >
                                <Text style={{
                                  color: "#5C34A2",
                                  textDecoration: "none",
                                  fontFamily: "Nunito, Helvetica Neue, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol",
                                  fontSize: "12px"
                                }}>
                                  
                                </Text>
                              </Clickable>
                            </Td>
                            <Td>
                              {/* <Text>
                                <Clickable
                                  href={`/block/${x.block_height}`}
                                >
                                  <Text style={{ color: "#5C34A2", 
                                    textDecoration: "none",
                                    fontFamily: "Nunito, Helvetica Neue, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol",
                                    fontSize: "12px"
                                    }}>
                                      {x.decode_tx.nftSchemaCode ? x.decode_tx.nftSchemaCode : ""}
                                  </Text>
                                </Clickable>
                              </Text> */}
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </TableContainer>
                </CustomCard>
              </GridItem>
            </Grid>
          </Flex>
        </Container>
      </Box>
      <Spacer />
    </Flex>
  );
}

const TRENDING = [
  {
    collection: "Mfers",
    action: "check_in",
    actionCount: 100,
  },
  {
    collection: "Mfers",
    action: "check_in",
    actionCount: 100,
  },
  {
    collection: "Mfers",
    action: "check_in",
    actionCount: 100,
  },
  {
    collection: "Mfers",
    action: "check_in",
    actionCount: 100,
  },
  {
    collection: "Mfers",
    action: "check_in",
    actionCount: 100,
  },
];

export const getServerSideProps = async () => {

  const schemaCode = "";
  const page = "1";
  const pageSize = "5";
  const endDate = new Date();
  const preYear = endDate.getFullYear() - 3;
  const startDate = new Date(preYear, endDate.getMonth(), endDate.getDate());

  const start24h = new Date();
  start24h.setHours(0);
  start24h.setMinutes(0);
  start24h.setSeconds(0);
  start24h.setMilliseconds(0);
  const end24h = start24h;
  end24h.setHours(17);
  end24h.setMinutes(0);
  end24h.setSeconds(0);
  end24h.setMilliseconds(0);
  let count24h = 0;


  const [nftActionCount, totalNFTCollection, totalNFTS, nftFee, action24h, latestAction] =
    await Promise.all([
      getNFTActionCountStat(schemaCode, startDate.toISOString(), endDate.toISOString(), page, pageSize),
      getTotalNFTCollection(),
      getTotalNFTS(),
      getNFTFee(),
      getNFTActionCountStatDaily(schemaCode, start24h.toISOString(), end24h.toISOString(), page, pageSize),
      getLatestAction("1", "6")
    ]);

  if (action24h) {
    for (let i = 0; i < action24h.length; i++) {
      count24h += action24h[i].count;
    }
  }
  // console.log("nftActionCount",nftActionCount);

  const blockNFTStat = {
    totalNFTCollection: totalNFTCollection,
    totalNFTS: totalNFTS,
    nftFee: nftFee,
    action24h: count24h
  }

  if (!latestAction) {
    return {
      props: {
        nftActionCount: null,
        blockNFTStat: null,
        latestAction: null,
      },
    };
  }

  return {
    props: {
      nftActionCount,
      blockNFTStat,
      latestAction,
    },
  };
};