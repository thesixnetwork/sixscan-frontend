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
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Tr,
  Td,
  Tooltip,
  Badge,
  Tbody,
  Thead,
  Image,
  Spacer,
  Skeleton,
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
} from "@chakra-ui/react";

import { Clickable } from "@/components/Clickable";
import {
  formatHex,
  formatNumber,
  formatSchema,
  formatSchemaAction,
  convertUsixToSix,
} from "@/libs/utils/format";

// -------- service ----------
import {
  getNFTActionCountStat,
  getNFTActionCountStatDaily,
  getTotalNFTCollection,
  getTotalNFTS,
  getNFTFee,
} from "@/service/nftmngr/stats";
import { getLatestAction } from "@/service/nftmngr/txs";
// import { NFTSchema, LatestAction } from "@/types/Nftmngr";

import {
  DataNFTStat,
  DataNFTCollectionTrending,
  BlockNFTStat,
  LatestAction,
} from "@/types/Nftmngr";
import { _LOG } from "@/libs/utils/logHelper";
import { useState, useEffect, Suspense } from "react";
import ENV from "@/libs/utils/ENV";

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

const maintain = false;

interface Props {
  modalstate: { isOpen: boolean; onOpen: () => void; onClose: () => void };
  // nftActionCount: DataNFTStat;
  blockNFTStat: BlockNFTStat | null;
  // latestAction: any;
}

export default function Data({
  modalstate,
  // nftActionCount,
  blockNFTStat,
}: // latestAction,
Props) {
  // _LOG(nftActionCount)

  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoadedStat, setIsLoadedStat] = useState(false);
  const [isLoadedCollection, setIsLoadedCollection] = useState(false);
  const [isStop, setIsStop] = useState(false);
  const [isPage, setIsPage] = useState("1");
  const [latestAction, setLatestAction] = useState<LatestAction | null>(null);
  const [nftActionCount, setNftActionCount] = useState<DataNFTStat | null>(
    null
  );
  const [nftCollectionTrending, setNftCollectionTrending] =
    useState<DataNFTCollectionTrending | null>(null);

  ///////  get Latest Action /////////
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoaded(false);
        setLatestAction(null);
        // const resLatestAction = await getLatestAction("1", "20");
        const response = await fetch(
          `/api/nftLatestAction?isPage=1&isPageSize=15`
        );
        const resLatestAction = await response.json();
        setLatestAction(resLatestAction);
        setIsLoaded(true);
      } catch (error) {
        _LOG(error);
      }
    };
    fetchData();
  }, [isPage, isStop]);

  ////////// get stat /////////
  useEffect(() => {
    const fetchDataStat = async () => {
      try {
        setIsLoadedStat(false);
        setNftActionCount(null);
        const response = await fetch(
          `/api/nftstat?schemaCode=&endTime=&pageNumber=1&limit=5`
        );
        const resActionStat = await response.json();
        setNftActionCount(resActionStat);
        setIsLoadedStat(true);
      } catch (error) {
        _LOG(error);
      }
    };
    fetchDataStat();
  }, [isStop]);

  ///// colletion trending ////
  useEffect(() => {
    const fetchDataStat = async () => {
      try {
        setIsLoadedCollection(false);
        setNftCollectionTrending(null);
        const response = await fetch(
          `/api/nftCollectionTrending?schemaCode=&endTime=&pageNumber=1&limit=5`
        );
        const resCollection = await response.json();
        setNftCollectionTrending(resCollection);
        setIsLoadedCollection(true);
      } catch (error) {
        _LOG(error);
      }
    };
    fetchDataStat();
  }, [isStop]);

  // const ssf = nftActionCount.data.map((x:any) => { x.schema_code })
  // const ssf = nftActionCount.data[0].schema_code
  // console.log(ssf)
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
        <Container maxW="container.xl">
          <Flex direction="column" gap={3} p={3}>
            <Text fontSize="xl" fontWeight="bold" color={"lightest"}>
              Data Layer Explorer
            </Text>
            <SearchBar
              hasButton
              placeHolder={
                "Search by Address(6x) / Txn Hash / Block / Schema / Contract(0x)"
              }
              modalstate={modalstate}
            />
          </Flex>
        </Container>
      </Box>
      <Box marginTop={-10}>
        <Container maxW="container.xl">
          <Flex direction="column" gap={3} p={3}>
            <Grid templateColumns="repeat(12, 1fr)" gap={6}>
              <GridItem colSpan={{ base: 12, md: 6 }}>
                {/* <CustomCard title={"Trending"}>
                  <TableContainer>
                    {maintain ? (
                      <Alert status="loading" height="350px">
                        <AlertIcon />
                        NFT Trending Will Be Support On Testnet Soon. Please
                        Stay tune.
                      </Alert>
                    ) : (
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
                          {isLoadedStat ? Array.isArray(nftActionCount) &&
                            nftActionCount.map((item, index) => (
                              <Tr key={index}>
                                <Td>
                                  <Flex
                                    direction="row"
                                    alignItems="center"
                                    gap={3}
                                  >
                                    <Text fontWeight={"bold"}>{index + 1}</Text>
                                    <Image
                                      src={item.image}
                                      alt="gen2"
                                      width={"40px"}
                                      height={"40px"}
                                    />
                                    <Link
                                      href={`/schema/${item.schema_code}`}
                                      target="_blank"
                                      _hover={{ textDecoration: "none" }}
                                    >
                                      <Tooltip label={item.schema_code} aria-label='A tooltip'>
                                        <Text fontWeight={"bold"} 
                                        style={{
                                          color: "#5C34A2",
                                          textDecoration: "none",
                                          fontFamily:
                                            "Nunito, Helvetica Neue, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol",
                                          fontSize: "14px",
                                          textAlign: "center",
                                        }}>
                                          {formatSchema(item.schema_code)}
                                        </Text>
                                      </Tooltip>
                                    </Link>
                                  </Flex>
                                </Td>
                                <Td>
                                  <Flex
                                    direction="row"
                                    alignItems="center"
                                    gap={3}
                                  >
                                    <Tooltip label={item.action} aria-label='A tooltip'>
                                      <Text>
                                        {formatSchemaAction(item.action)}
                                      </Text>
                                    </Tooltip>
                                  </Flex>
                                </Td>
                                <Td>
                                  <Flex
                                    direction="row"
                                    alignItems="center"
                                    gap={3}
                                  >
                                    <Text>{item.count}</Text>
                                  </Flex>
                                </Td>
                              </Tr>
                            )):
                            Array.from({ length: 5 }).map((_, index) => (
                              <Tr key={index}>
                                {Array.from({ length: 3 }).map((_, index) => (
                                  <Td key={index}>
                                    <Skeleton width={"auto"} height={"15px"} />
                                  </Td>
                                ))}
                              </Tr>
                            ))
                            }
                        </Tbody>
                      </Table>
                    )}
                  </TableContainer>
                </CustomCard> */}
                <CustomCard>
                  <Tabs isLazy>
                    <TabList>
                      <Tab fontSize={"18px"} p={4}>
                        Collection Trending
                      </Tab>
                      <Tab fontSize={"18px"} p={4}>
                        Actions Trending
                      </Tab>
                    </TabList>
                    <TabPanels>
                      <TabPanel>
                        <TableContainer>
                          <Table>
                            <Thead>
                              <Tr>
                                <Td>
                                  <Text
                                    textAlign={"center"}
                                    fontSize="sm"
                                    color={"medium"}
                                  >
                                    Collection
                                  </Text>
                                </Td>
                                <Td>
                                  <Text
                                    textAlign={"center"}
                                    fontSize="sm"
                                    color={"medium"}
                                  >
                                    Action Count
                                  </Text>
                                </Td>
                              </Tr>
                            </Thead>
                            <Tbody>
                              {isLoadedCollection
                                ? Array.isArray(nftCollectionTrending) &&
                                  nftCollectionTrending.map((item, index) => (
                                    <Tr key={index}>
                                      <Td>
                                        <Flex
                                          direction="row"
                                          alignItems="center"
                                          gap={3}
                                        >
                                          <Text fontWeight={"bold"}>
                                            {index + 1}
                                          </Text>
                                          <Image
                                            src={item.image}
                                            alt="gen2"
                                            width={"40px"}
                                            height={"40px"}
                                          />
                                          <Link
                                            href={`/schema/${item.schema_code}`}
                                            target="_blank"
                                            _hover={{ textDecoration: "none" }}
                                          >
                                            <Tooltip
                                              label={item.schema_code}
                                              aria-label="A tooltip"
                                            >
                                              <Text
                                                fontWeight={"bold"}
                                                style={{
                                                  color: "#5C34A2",
                                                  textDecoration: "none",
                                                  fontFamily:
                                                    "Nunito, Helvetica Neue, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol",
                                                  fontSize: "14px",
                                                  textAlign: "center",
                                                }}
                                              >
                                                {/* {formatSchema(item.schema_code)} */}
                                                {item.schema_code}
                                              </Text>
                                            </Tooltip>
                                          </Link>
                                        </Flex>
                                      </Td>
                                      <Td>
                                        <Flex
                                          direction="row"
                                          alignItems="center"
                                          gap={3}
                                        >
                                          <Text>{item.count}</Text>
                                        </Flex>
                                      </Td>
                                    </Tr>
                                  ))
                                : Array.from({ length: 5 }).map((_, index) => (
                                    <Tr key={index}>
                                      {Array.from({ length: 2 }).map(
                                        (_, index) => (
                                          <Td key={index}>
                                            <Skeleton
                                              width={"auto"}
                                              height={"15px"}
                                            />
                                          </Td>
                                        )
                                      )}
                                    </Tr>
                                  ))}
                            </Tbody>
                          </Table>
                        </TableContainer>
                      </TabPanel>

                      <TabPanel>
                        <TableContainer>
                          <Table>
                            <Thead>
                              <Tr>
                                <Td>
                                  <Text
                                    textAlign={"center"}
                                    fontSize="sm"
                                    color={"medium"}
                                  >
                                    Collection
                                  </Text>
                                </Td>
                                <Td>
                                  <Text
                                    textAlign={"center"}
                                    fontSize="sm"
                                    color={"medium"}
                                  >
                                    Action
                                  </Text>
                                </Td>
                                <Td>
                                  <Text
                                    textAlign={"center"}
                                    fontSize="sm"
                                    color={"medium"}
                                  >
                                    Action Count
                                  </Text>
                                </Td>
                              </Tr>
                            </Thead>
                            <Tbody>
                              {isLoadedStat
                                ? Array.isArray(nftActionCount) &&
                                  nftActionCount.map((item, index) => (
                                    <Tr key={index}>
                                      <Td>
                                        <Flex
                                          direction="row"
                                          alignItems="center"
                                          gap={3}
                                        >
                                          <Text fontWeight={"bold"}>
                                            {index + 1}
                                          </Text>
                                          <Image
                                            src={item.image}
                                            alt="gen2"
                                            width={"40px"}
                                            height={"40px"}
                                          />
                                          <Link
                                            href={`/schema/${item.schema_code}`}
                                            target="_blank"
                                            _hover={{ textDecoration: "none" }}
                                          >
                                            <Tooltip
                                              label={item.schema_code}
                                              aria-label="A tooltip"
                                            >
                                              <Text
                                                fontWeight={"bold"}
                                                style={{
                                                  color: "#5C34A2",
                                                  textDecoration: "none",
                                                  fontFamily:
                                                    "Nunito, Helvetica Neue, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol",
                                                  fontSize: "14px",
                                                  textAlign: "center",
                                                }}
                                              >
                                                {formatSchema(item.schema_code)}
                                              </Text>
                                            </Tooltip>
                                          </Link>
                                        </Flex>
                                      </Td>
                                      <Td>
                                        <Flex
                                          direction="row"
                                          alignItems="center"
                                          gap={3}
                                        >
                                          <Tooltip
                                            label={item.action}
                                            aria-label="A tooltip"
                                          >
                                            <Text>
                                              {formatSchemaAction(item.action)}
                                            </Text>
                                          </Tooltip>
                                        </Flex>
                                      </Td>
                                      <Td>
                                        <Flex
                                          direction="row"
                                          alignItems="center"
                                          gap={3}
                                        >
                                          <Text>{item.count}</Text>
                                        </Flex>
                                      </Td>
                                    </Tr>
                                  ))
                                : Array.from({ length: 5 }).map((_, index) => (
                                    <Tr key={index}>
                                      {Array.from({ length: 3 }).map(
                                        (_, index) => (
                                          <Td key={index}>
                                            <Skeleton
                                              width={"auto"}
                                              height={"15px"}
                                            />
                                          </Td>
                                        )
                                      )}
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
              <GridItem colSpan={{ base: 12, md: 6 }}>
                <Grid templateColumns="repeat(2, 1fr)" gap={6}>
                  <GridItem colSpan={2}>
                    <Card
                      style={{
                        background: "#DADEF2",
                        mixBlendMode: "normal",
                        border: "2px solid #DADEF2",
                        backdropFilter: "blur(3px)",
                        borderRadius: "12px",
                        opacity: "0.8",
                      }}
                      size="lg"
                    >
                      <CardBody>
                        <Flex direction="column" py={2}>
                          <Text
                            fontSize="2xl"
                            fontWeight="bold"
                            style={{
                              background:
                                "linear-gradient(to right, #33337E 0%, #33337E 80%, #7C5CCE 90%, #7C5CCE 100%)",
                              WebkitBackgroundClip: "text",
                              WebkitTextFillColor: "transparent",
                            }}
                          >
                            Dynamic Data Layer (NFT Gen 2)
                          </Text>
                          <Text
                            fontSize="xl"
                            fontWeight="bold"
                            style={{
                              background:
                                "linear-gradient(to right, #33337E 0%, #33337E 80%, #7C5CCE 90%, #7C5CCE 100%)",
                              WebkitBackgroundClip: "text",
                              WebkitTextFillColor: "transparent",
                            }}
                          >
                            Developed to optimize NFT capabilities and
                            seamlessly integrate with the business model.
                          </Text>
                        </Flex>
                        <Text
                          fontSize="xs"
                          style={{
                            background:
                              "linear-gradient(to right, #33337E 0%, #33337E 50%, #7C5CCE 50%, #7C5CCE 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                          }}
                        >
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
                                    {blockNFTStat
                                      ? blockNFTStat.totalNFTS.total
                                      : 0}
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
                                    {blockNFTStat
                                      ? blockNFTStat.totalNFTCollection.total
                                      : 0}
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
                                    {blockNFTStat
                                      ? convertUsixToSix(
                                          parseInt(
                                            blockNFTStat.nftFee.replace(
                                              "usix",
                                              ""
                                            )
                                          )
                                        )
                                      : 0}
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
                          <Td textAlign={"center"}>Txhash</Td>
                          <Td textAlign={"center"}>Action</Td>
                          <Td textAlign={"center"}>TokenID</Td>
                          <Td textAlign={"center"}>Age</Td>
                          <Td textAlign={"center"}>Block</Td>
                          <Td textAlign={"center"}>By</Td>
                          <Td textAlign={"center"}>Schema</Td>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {isLoaded
                          ? latestAction &&
                            latestAction.txs.map((tx: any, index: number) => (
                              <Tr key={index}>
                                <Td>
                                  <Flex direction="column">
                                    <Clickable href={`/tx/${tx.txhash}`}>
                                      <Text
                                        style={{
                                          color: "#5C34A2",
                                          textDecoration: "none",
                                          fontFamily:
                                            "Nunito, Helvetica Neue, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol",
                                          fontSize: "14px",
                                          textAlign: "center",
                                        }}
                                      >
                                        {formatHex(tx.txhash)}
                                      </Text>
                                    </Clickable>
                                  </Flex>
                                </Td>
                                <Td>
                                  <Badge
                                    justifyContent={"center"}
                                    display={"flex"}
                                    width="100%"
                                  >
                                    <Text
                                      style={{
                                        textDecoration: "none",
                                        fontFamily:
                                          "Nunito, Helvetica Neue, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol",
                                        fontSize: "10px",
                                        textAlign: "center",
                                      }}
                                    >
                                      Action:
                                    </Text>
                                    <Tooltip
                                      label={tx.decode_tx.action}
                                      aria-label="A tooltip"
                                    >
                                      <Text
                                        marginLeft={"4px"}
                                        style={{
                                          color: "#5C34A2",
                                          textDecoration: "none",
                                          fontFamily:
                                            "Nunito, Helvetica Neue, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol",
                                          fontSize: "10px",
                                          textAlign: "center",
                                        }}
                                      >
                                        {formatSchemaAction(
                                          tx.decode_tx.action
                                        )}
                                      </Text>
                                    </Tooltip>
                                  </Badge>
                                </Td>
                                <Td>
                                  {tx.decode_tx.tokenId ? (
                                    <Clickable
                                      href={`/schema/${
                                        tx.decode_tx.nftSchemaCode
                                          ? tx.decode_tx.nftSchemaCode
                                          : tx.decode_tx.nft_schema_code
                                      }/${tx.decode_tx.tokenId}`}
                                    >
                                      <Text
                                        style={{
                                          color: "#5C34A2",
                                          textDecoration: "none",
                                          fontFamily:
                                            "Nunito, Helvetica Neue, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol",
                                          fontSize: "14px",
                                          textAlign: "center",
                                        }}
                                      >
                                        {tx.decode_tx.tokenId}
                                      </Text>
                                    </Clickable>
                                  ) : (
                                    <Text
                                      style={{
                                        color: "#5C34A2",
                                        textDecoration: "none",
                                        fontFamily:
                                          "Nunito, Helvetica Neue, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol",
                                        fontSize: "14px",
                                        textAlign: "center",
                                      }}
                                    >
                                      {"Will be available"}
                                    </Text>
                                  )}
                                </Td>
                                <Td>
                                  <Text>{moment(tx.time_stamp).fromNow()}</Text>
                                </Td>
                                <Td>
                                  <Clickable href={`/block/${tx.block_height}`}>
                                    <Text
                                      style={{
                                        color: "#5C34A2",
                                        textDecoration: "none",
                                        fontFamily:
                                          "Nunito, Helvetica Neue, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol",
                                        fontSize: "14px",
                                        textAlign: "center",
                                      }}
                                    >
                                      {tx.block_height}
                                    </Text>
                                  </Clickable>
                                </Td>
                                <Td>
                                  {tx.decode_tx.creator ? (
                                    <Clickable
                                      href={`/address/${tx.decode_tx.creator}`}
                                    >
                                      <Text
                                        style={{
                                          color: "#5C34A2",
                                          textDecoration: "none",
                                          fontFamily:
                                            "Nunito, Helvetica Neue, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol",
                                          fontSize: "14px",
                                          textAlign: "center",
                                        }}
                                      >
                                        {formatHex(tx.decode_tx.creator)}
                                      </Text>
                                    </Clickable>
                                  ) : (
                                    <Text
                                      style={{
                                        color: "#5C34A2",
                                        textDecoration: "none",
                                        fontFamily:
                                          "Nunito, Helvetica Neue, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol",
                                        fontSize: "14px",
                                        textAlign: "center",
                                      }}
                                    >
                                      {"Will be available"}
                                    </Text>
                                  )}
                                </Td>
                                <Td>
                                  {tx.decode_tx.nftSchemaCode ||
                                  tx.decode_tx.nft_schema_code ? (
                                    <Clickable
                                      href={`/schema/${
                                        tx.decode_tx.nftSchemaCode
                                          ? tx.decode_tx.nftSchemaCode
                                          : tx.decode_tx.nft_schema_code
                                      }`}
                                    >
                                      <Text
                                        style={{
                                          color: "#5C34A2",
                                          textDecoration: "none",
                                          fontFamily:
                                            "Nunito, Helvetica Neue, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol",
                                          fontSize: "14px",
                                          textAlign: "center",
                                        }}
                                      >
                                        {formatHex(
                                          tx.decode_tx.nftSchemaCode
                                            ? tx.decode_tx.nftSchemaCode
                                            : tx.decode_tx.nft_schema_code
                                        )}
                                      </Text>
                                    </Clickable>
                                  ) : (
                                    <Text
                                      style={{
                                        color: "#5C34A2",
                                        textDecoration: "none",
                                        fontFamily:
                                          "Nunito, Helvetica Neue, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol",
                                        fontSize: "14px",
                                        textAlign: "center",
                                      }}
                                    >
                                      {"Will be available"}
                                    </Text>
                                  )}
                                </Td>
                              </Tr>
                            ))
                          : Array.from({ length: 10 }).map((_, index) => (
                              <Tr key={index}>
                                {Array.from({ length: 7 }).map((_, index) => (
                                  <Td key={index}>
                                    <Skeleton width={"auto"} height={"15px"} />
                                  </Td>
                                ))}
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
  // const endDate = new Date();
  // const preYear = endDate.getFullYear() - 3;
  // const startDate = new Date(preYear, endDate.getMonth(), endDate.getDate());

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
  let end_time;
  const day = start24h.getDate();
  const month = start24h.getMonth() + 1;
  const year = start24h.getFullYear();
  if (month > 9) {
    end_time = `${day}/${month}/${year}`;
  } else {
    end_time = `${day}/0${month}/${year}`;
  }

  let lower_chainName = process.env.NEXT_PUBLIC_CHAIN_NAME?.toLowerCase();

  if (lower_chainName === "mainnet" || lower_chainName === "sixnet") {
    const [
      // nftActionCount,
      totalNFTCollection,
      totalNFTS,
      nftFee,
      action24h,
      // latestAction,
    ] = await Promise.all([
      // getNFTActionCountStat(
      //   schemaCode,
      //   page,
      //   pageSize
      // ),
      getTotalNFTCollection(),
      getTotalNFTS(),
      getNFTFee(),
      getNFTActionCountStatDaily(schemaCode, end_time),
    ]);

    if (action24h) {
      count24h += action24h.count;
    }

    const blockNFTStat = {
      totalNFTCollection: totalNFTCollection,
      totalNFTS: totalNFTS,
      nftFee: nftFee,
      action24h: count24h,
    };

    // if (!latestAction) {
    //   return {
    //     props: {
    //       nftActionCount: null,
    //       blockNFTStat: null,
    //       // latestAction: null,
    //     },
    //   };
    // }

    return {
      props: {
        // nftActionCount,
        blockNFTStat,
      },
    };
  } else {
    return {
      props: {
        // nftActionCount,
        blockNFTStat: null,
      },
    };
  }
};
