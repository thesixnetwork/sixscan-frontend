// ------------------------- Chakra UI -------------------------
import {
  Box,
  Flex,
  Text,
  Container,
  Grid,
  GridItem,
  Table,
  TableContainer,
  Tbody,
  Tr,
  Td,
  Badge,
  Image,
  Thead,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Textarea,
  Button,
  Spacer,
  Skeleton,
  Tooltip,
} from "@chakra-ui/react";
// ------------------------- NextJS -------------------------
import Head from "next/head";
// ------------------------- Styles -------------------------
import {
  FaArrowLeft,
  FaArrowRight,
  FaChevronDown,
  FaChevronUp,
  FaCopy,
  FaExpand,
  FaScroll,
  FaSortAmountDown,
} from "react-icons/fa";
// ------------- Components ----------------
import NavBar from "@/components/NavBar";
import CustomCard from "@/components/CustomCard";
import { LinkComponent } from "@/components/Chakralink";
import FloatingButton from "@/components/Floating";
import { Clickable } from "@/components/Clickable";
import { convertUsixToSix, formatHex, formatNumber } from "@/utils/format";
import { formatTraitValue, formatMethod } from "@/utils/format";
import AttributeBox from "@/components/AttributeBox";
import { getMetadata } from "@/service/nftmngr/common";
import { getSchema } from "@/service/nftmngr/schema";
import { getAllTransactionByTokenID, getAllActionByTokenID } from "@/service/nftmngr/txs";
import { Metadata } from "@/types/Opensea";
import { NFTSchema, LatestAction } from "@/types/Nftmngr";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import moment from "moment";

import dynamic from 'next/dynamic';
import React from 'react';
// const ReactJsonViewer = dynamic(
//   () => import('react-json-viewer-cool'),
//   { ssr: false }
// );

const DynamicReactJson = dynamic(
  () => import('react-json-view'),
  { ssr: false }
);

interface Props {
  metadata: Metadata;
  schema: NFTSchema;
  // latestAction: LatestAction;
  schemacode: string;
  pageNumber: string;
  tokenId: string;
}

export default function Schema({ metadata, schema, schemacode, pageNumber, tokenId }: Props) {
  const STATS = [
    {
      title: "Chain",
      value: schema?.origin_data?.origin_chain || "",
    },
  ];
  const [isCopied, setIsCopied] = useState(false);
  const handleCopyClick = () => {
    navigator.clipboard.writeText(JSON.stringify(metadata, null, 2));
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1000);
  };
  const router = useRouter();

  // returnUrl, buttonLabel, buttonColor ==> rt, bl, bc
  const { rt, bl, bc } = router.query;

  ////// fetchData  ///////
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoadedAction, setIsLoadedAction] = useState(false);
  const [isStop, setIsStop] = useState(false);
  const [isPage, setIsPage] = useState("1");
  const [isPageAction, setIsPageAction] = useState("1");
  const [txns, setTxns] = useState<LatestAction | null>(null);
  const [latestAction, setLatestAction] = useState<LatestAction | null>(null);
  // let totalPages = 0;
  //////// get Txns /////////
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoaded(false)
        setTxns(null);
        // const resTxns = await getAllTransactionByTokenID(schemacode, tokenId, isPage, "10");
        const response = await fetch(`/api/getTxByTokenID?schemaCode=${schemacode}&tokenID=${tokenId}&page=${isPage}&limit=10`);
        const resMetadata = await response.json();
        setTxns(resMetadata as LatestAction);
        setIsLoaded(true);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [isPage, isStop])


  /////// get action ////////
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoadedAction(false)
        setLatestAction(null);
        // const resLatestAction = await getAllActionByTokenID(schemacode, tokenId, isPageAction, "10");
        const response = await fetch(`/api/getActionByTokenID?schemaCode=${schemacode}&tokenID=${tokenId}&page=${isPage}&limit=10`);
        const resMetadata = await response.json();
        setLatestAction(resMetadata as LatestAction);
        setIsLoadedAction(true);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [isPageAction, isStop])

  const handlePageLatestAction = (isPage: string) => {
    setIsLoadedAction(false)
    setIsPageAction(isPage);
  };

  const handlePageLatestTxns = (isPage: string) => {
    setIsLoaded(false)
    setIsPage(isPage);
  };

  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  if (isPage) {
    latestAction
  }

  if (!metadata) {
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
              Token does not exist
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
    <Flex minHeight={"100vh"} direction={"column"} bgColor="lightest">
      <Head>
        <title>SIXSCAN</title>
        <meta name="description" content="SIXSCAN" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box>
        <Box p={6}>
          <Container maxW="container.xl">
            <Grid templateColumns="repeat(12, 1fr)" gap={6}>
              <GridItem
                colSpan={{ base: 12, md: 3 }}
                alignItems={"center"}
                justifyContent={"center"}
                display={"flex"}
              >
                {/* {console.log(txns)} */}
                <Image
                  rounded={"lg"}
                  src={metadata.image}
                  alt="mfer"
                  width="100%"
                />
              </GridItem>
              <GridItem colSpan={{ base: 12, md: 9 }}>
                <Flex direction="column" gap={4}>
                  <Flex direction="column">
                    <Text fontSize="2xl" fontWeight="bold">
                      {metadata.name}
                    </Text>
                    <Flex direction="row" gap={1}>
                      <Text fontSize="sm">Schema</Text>
                      <Text fontSize="sm">
                        <Clickable href={`/schema/${schema.code}`} underline>
                          {schema.code}
                        </Clickable>
                      </Text>
                    </Flex>
                  </Flex>
                  <Flex direction="row" gap={4}>
                    {STATS.map((stat, index) => (
                      <Flex direction="row" gap={1} key={index}>
                        <Text>{stat.title}</Text>
                        <Text fontWeight={"bold"}>{stat.value}</Text>
                      </Flex>
                    ))}
                  </Flex>
                  <Flex direction="column">
                    {isExpanded && metadata.description ? metadata.description : `${metadata.description && metadata.description.substring(0, 100)}...`}
                    <Flex align="center" direction="row" gap={1} onClick={toggleExpand}>
                      <Text fontSize={"sm"} fontWeight={"bold"}>
                        {isExpanded ? "SHOW LESS" : "SHOW MORE"}
                      </Text>
                      {isExpanded ? <FaChevronUp fontSize={12} /> : <FaChevronDown fontSize={12} />} 
                    </Flex>
                  </Flex>
                  <Flex direction="row" gap={5}>
                    <Flex direction="column">
                      <Text fontWeight={"bold"}>{latestAction?.totalCount}</Text>
                      <Text color="medium">actions performed</Text>
                    </Flex>
                  </Flex>
                </Flex>
              </GridItem>
              <GridItem colSpan={{ base: 12, lg: 4 }}>
                <Box mb={6}>
                  <CustomCard title="Static Attributes">
                    <Grid templateColumns="repeat(12, 1fr)" gap={4} p={4}>
                      {metadata.attributes?.map(
                        (attr, index) =>
                          attr.is_origin &&
                          !attr.display_type &&
                          attr.value && (
                            <GridItem colSpan={{ base: 12, md: 6 }} key={index}>
                              <AttributeBox {...attr} />
                            </GridItem>
                          )
                      )}
                    </Grid>
                  </CustomCard>
                </Box>
                <Box mb={6}>
                  <CustomCard title="Dynamic Attributes (Gen2)">
                    <Grid templateColumns="repeat(12, 1fr)" gap={4} p={4}>
                      {/* {console.log(metadata.attributes)} */}
                      {metadata.attributes?.map(
                        (attr, index) =>
                          !attr.is_origin &&
                          !attr.display_type &&
                          // attr.value && 
                          (
                            <GridItem colSpan={{ base: 12, md: 6 }} key={index}>
                              <AttributeBox {...attr} />
                            </GridItem>
                          )
                      )}
                    </Grid>
                  </CustomCard>
                </Box>
                {metadata.attributes?.find(
                  (attr) => attr.display_type == "number"
                ) && (
                    <Box>
                      <CustomCard title="Stats">
                        <Grid
                          templateColumns="repeat(12, 1fr)"
                          gap={4}
                          p={4}
                          maxH={"230px"}
                          overflow={"auto"}
                        >
                          {metadata.attributes?.map(
                            (attr, index) =>
                              !attr.is_origin &&
                              attr.display_type && (
                                <GridItem colSpan={12} key={index}>
                                  {/* add space between */}
                                  <Flex p={2} gap={3} align="center">
                                    <Text color={"darkest"}>
                                      {attr.trait_type}
                                    </Text>
                                    <Spacer />
                                    <Flex>
                                      <Text color={"dark"}>
                                        {formatTraitValue(attr.value)}
                                      </Text>
                                      {attr.max_value && (
                                        <Text
                                          color={"dark"}
                                        >{`/${formatTraitValue(
                                          attr.max_value
                                        )}`}</Text>
                                      )}
                                    </Flex>
                                  </Flex>
                                </GridItem>
                              )
                          )}
                        </Grid>
                      </CustomCard>
                    </Box>
                  )}
              </GridItem>
              <GridItem colSpan={{ base: 12, lg: 8 }}>
                <CustomCard>
                  <Tabs isLazy>
                    <TabList>
                      <Tab>Latest Txns</Tab>
                      <Tab>Latest Actions</Tab>
                      <Tab>Metadata</Tab>
                    </TabList>
                    <TabPanels>
                      <TabPanel>
                        <Flex
                          direction="row"
                          gap={2}
                          align="center"
                          color={"dark"}
                          justify="space-between"
                        >
                          {isLoaded ?
                            <Flex direction="row" gap={2} align="center">
                              <FaSortAmountDown fontSize={12} />
                              <Text>
                                Latest {txns?.txs?.length} from a total of{" "}
                                {/* <Clickable href="/"> */}
                                {txns?.totalCount}
                                {/* </Clickable> */}
                                {" "}
                                transaction
                              </Text>
                            </Flex>
                            :
                            <Skeleton width={"200px"} height={"15px"} />
                          }

                          {isLoaded ? txns && (
                            <Flex direction="row" gap={2} align="center" px="2">
                              <Button
                                variant={"solid"}
                                size="xs"
                                isDisabled={parseInt(isPage) === 1}
                                onClick={() => handlePageLatestTxns("1")}
                              >
                                First
                              </Button>
                              <Button
                                size="xs"
                                isDisabled={parseInt(isPage) === 1}
                                onClick={() => handlePageLatestTxns((parseInt(isPage) - 1).toString())}
                              >
                                <FaArrowLeft fontSize={12} />
                              </Button>
                              <Text fontSize="xs">
                                {`Page ${isPage} of ${txns?.totalPage}`}
                              </Text>
                              <Button
                                size="xs"
                                isDisabled={
                                  parseInt(isPage) === txns?.totalPage
                                }
                                onClick={() => handlePageLatestTxns((parseInt(isPage) + 1).toString())}
                              >
                                <FaArrowRight fontSize={12} />
                              </Button>
                              <Button
                                size="xs"
                                isDisabled={
                                  parseInt(isPage) === txns?.totalPage
                                }
                                onClick={() => handlePageLatestTxns(txns?.totalPage.toString())}

                              >
                                Last
                              </Button>
                            </Flex>
                          ) :
                            <Skeleton marginRight={"10px"} width={"20%"} height={"15px"} />
                          }

                        </Flex>
                        <TableContainer>
                          <Table>
                            <Thead>
                              <Tr >
                                <Td textAlign={"center"}>
                                  <Text>Txhash</Text>
                                </Td>
                                <Td textAlign={"center"}>
                                  <Text>Method</Text>
                                </Td>
                                <Td textAlign={"center"}>
                                  <Text>Age</Text>
                                </Td>
                                <Td textAlign={"center"}>
                                  <Text>Block</Text>
                                </Td>
                                <Td textAlign={"center"}>
                                  <Text>By</Text>
                                </Td>
                                <Td textAlign={"center"}>
                                  <Text>Gas Fee</Text>
                                </Td>
                              </Tr>
                            </Thead>
                            <Tbody>
                              {isLoaded ? txns?.txs?.map((action: any, index: number) => (
                                <Tr key={index}>
                                  <Td textAlign={"center"}>
                                    <Clickable href={`/tx/${action.txhash}`}>
                                      <Text style={{
                                        color: "#5C34A2",
                                        textDecoration: "none",
                                        fontFamily: "Nunito, Helvetica Neue, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol",
                                        fontSize: "12px"
                                      }}>
                                        {formatHex(action.txhash)}
                                      </Text>
                                    </Clickable>
                                  </Td>
                                  <Td>
                                    <Text>
                                      <Badge textAlign={"center"} width="100%">{formatMethod(action.type)}</Badge>
                                    </Text>
                                  </Td>
                                  <Td textAlign={"center"}>
                                    <Text>{moment(action.time_stamp).fromNow()}</Text>
                                  </Td>
                                  <Td textAlign={"center"}>
                                    <Clickable href={`/block/${action.block_height}`} >
                                      <Text style={{
                                        color: "#5C34A2",
                                        textDecoration: "none",
                                        fontFamily: "Nunito, Helvetica Neue, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol",
                                        fontSize: "12px"
                                      }}>
                                        {action.block_height}
                                      </Text>
                                    </Clickable>
                                  </Td>
                                  <Td textAlign={"center"}>
                                    <Clickable href={`/address/${action.decode_tx.creator}`} >
                                      <Text style={{
                                        color: "#5C34A2",
                                        textDecoration: "none",
                                        fontFamily: "Nunito, Helvetica Neue, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol",
                                        fontSize: "12px"
                                      }}>
                                        {formatHex(action.decode_tx.creator)}
                                      </Text>
                                    </Clickable>
                                  </Td>
                                  <Td textAlign={"center"}>
                                    <Text>{`${formatNumber(convertUsixToSix(parseInt(action.decode_tx.fee_amount)))} SIX`}</Text>
                                  </Td>
                                </Tr>
                              )) :
                                Array.from({ length: 10 }).map((_, index) => (
                                  <Tr key={index}>
                                    {Array.from({ length: 6 }).map((_, index) => (
                                      <Td key={index}>
                                        <Skeleton width={"auto"} height={"15px"} />
                                      </Td>
                                    ))}
                                  </Tr>
                                ))
                              }
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
                          justify="space-between"
                        >
                          {isLoadedAction ?
                            <Flex direction="row" gap={2} align="center">
                              <FaSortAmountDown fontSize={12} />
                              <Text>
                                Latest {latestAction?.txs?.length} from a total of{" "}
                                {/* <Clickable href="/"> */}
                                {latestAction?.totalCount}
                                {/* </Clickable> */}
                                {" "}
                                actions
                              </Text>
                            </Flex> :
                            <Skeleton width={"200px"} height={"15px"} />
                          }
                          {isLoadedAction ? latestAction && (
                            <Flex direction="row" gap={2} align="center" px="2">
                              <Button
                                variant={"solid"}
                                size="xs"
                                isDisabled={parseInt(isPageAction) === 1}
                                onClick={() => handlePageLatestAction("1")}
                              >
                                First
                              </Button>
                              <Button
                                size="xs"
                                isDisabled={parseInt(isPageAction) === 1}
                                onClick={() => handlePageLatestAction((parseInt(isPageAction) - 1).toString())}
                              >
                                <FaArrowLeft fontSize={12} />
                              </Button>
                              <Text fontSize="xs">
                                {`Page ${isPageAction} of ${latestAction?.totalPage}`}
                              </Text>
                              <Button
                                size="xs"
                                isDisabled={
                                  parseInt(isPageAction) === latestAction?.totalPage
                                }
                                onClick={() => handlePageLatestAction((parseInt(isPageAction) + 1).toString())}
                              >
                                <FaArrowRight fontSize={12} />
                              </Button>
                              <Button
                                size="xs"
                                isDisabled={
                                  parseInt(isPageAction) === latestAction?.totalPage
                                }
                                onClick={() => handlePageLatestAction(latestAction?.totalPage.toString())}

                              >
                                Last
                              </Button>
                            </Flex>
                          ) :
                            <Skeleton marginRight={"10px"} width={"20%"} height={"15px"} />
                          }

                        </Flex>
                        <TableContainer>
                          <Table>
                            <Thead>
                              <Tr >
                                <Td textAlign={"center"}>
                                  <Text>Txhash</Text>
                                </Td>
                                <Td textAlign={"center"}>
                                  <Text>Action</Text>
                                </Td>
                                <Td textAlign={"center"}>
                                  <Text>Age</Text>
                                </Td>
                                <Td textAlign={"center"}>
                                  <Text>Block</Text>
                                </Td>
                                <Td textAlign={"center"}>
                                  <Text>By</Text>
                                </Td>
                                <Td textAlign={"center"}>
                                  <Text>Gas Fee</Text>
                                </Td>
                              </Tr>
                            </Thead>
                            <Tbody>
                              {isLoaded ? latestAction?.txs?.map((action: any, index: number) => (
                                <Tr key={index}>
                                  <Td textAlign={"center"}>
                                    <Clickable href={`/tx/${action.txhash}`}>
                                      <Text style={{
                                        color: "#5C34A2",
                                        textDecoration: "none",
                                        fontFamily: "Nunito, Helvetica Neue, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol",
                                        fontSize: "12px"
                                      }}>
                                        {formatHex(action.txhash)}
                                      </Text>
                                    </Clickable>
                                  </Td>
                                  <Td>
                                    <Text>
                                      <Badge textAlign={"center"} width="100%">{action.decode_tx.action ? action.decode_tx.action : "unknow"}</Badge>
                                    </Text>
                                  </Td>
                                  <Td textAlign={"center"}>
                                    <Text>{moment(action.time_stamp).fromNow()}</Text>
                                  </Td>
                                  <Td textAlign={"center"}>
                                    <Clickable href={`/block/${action.block_height}`} >
                                      <Text style={{
                                        color: "#5C34A2",
                                        textDecoration: "none",
                                        fontFamily: "Nunito, Helvetica Neue, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol",
                                        fontSize: "12px"
                                      }}>
                                        {action.block_height}
                                      </Text>
                                    </Clickable>
                                  </Td>
                                  <Td textAlign={"center"}>
                                    <Clickable href={`/address/${action.decode_tx.creator}`} >
                                      <Text style={{
                                        color: "#5C34A2",
                                        textDecoration: "none",
                                        fontFamily: "Nunito, Helvetica Neue, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol",
                                        fontSize: "12px"
                                      }}>
                                        {formatHex(action.decode_tx.creator)}
                                      </Text>
                                    </Clickable>
                                  </Td>
                                  <Td textAlign={"center"}>
                                    <Text>{`${formatNumber(convertUsixToSix(parseInt(action.decode_tx.fee_amount)))} SIX`}</Text>
                                  </Td>
                                </Tr>
                              )) :
                                Array.from({ length: 10 }).map((_, index) => (
                                  <Tr key={index}>
                                    {Array.from({ length: 6 }).map((_, index) => (
                                      <Td key={index}>
                                        <Skeleton width={"auto"} height={"15px"} />
                                      </Td>
                                    ))}
                                  </Tr>
                                ))
                              }
                            </Tbody>
                          </Table>
                        </TableContainer>
                      </TabPanel>

                      <TabPanel>
                        <Flex
                          direction="row"
                          gap={2}
                          align="center"
                          justify="space-between"
                          py={2}
                        >
                          <Flex align="center" direction="row" gap={2}>
                            <FaScroll fontSize={12} />
                            <Text>Metadata Source Code</Text>
                          </Flex>
                          <Spacer />
                          <Tooltip
                            label={isCopied ? "Copied" : "Copy"}
                            placement="top"
                          >
                            <Box
                              bgColor="light"
                              p={1.5}
                              rounded="full"
                              onClick={handleCopyClick}
                              cursor="pointer"
                            >
                              <FaCopy fontSize={12} />
                            </Box>
                          </Tooltip>
                        </Flex>
                        {/* <Textarea
                          value={JSON.stringify(metadata, null, 2)}
                          readOnly
                          minH={500}
                        /> */}
                        <Box height={"400px"} overflowY="auto" overflowX="hidden" backgroundColor={"#f4f4f4"} borderRadius={"10px"} >
                          <Flex p={3}>
                            <DynamicReactJson src={metadata} collapsed={1} displayDataTypes={false} />
                          </Flex>
                        </Box>
                      </TabPanel>
                    </TabPanels>
                  </Tabs>
                </CustomCard>
              </GridItem>
            </Grid>
          </Container>
        </Box>
      </Box>
      {rt && bl && (
        <FloatingButton
          return_url={rt as string}
          button_label={bl as string}
          button_color={bc as string}
        />
      )}
      <Spacer />
    </Flex>
  );
}

export const getServerSideProps = async ({
  params: { schemacode, tokenId },
  query: { page = "1" },
}: {
  params: { schemacode: any; tokenId: any; };
  query: { page: string; },
}) => {
  const [metadata, schema, latestAction] = await Promise.all([
    getMetadata(schemacode, tokenId),
    getSchema(schemacode),
    getAllTransactionByTokenID(schemacode, tokenId, page, "10")
  ]);
  const pageNumber = page
  if (!schema) {
    return { props: { metadata: null, schema: null } };
  }
  return {
    props: { metadata, schema, latestAction, schemacode, pageNumber, tokenId },
  };
};

// const CONFIG = [
//   {
//     title: "actions performed",
//     value: "593",
//   },
// ];

// const ACTIONS = [
//   {
//     txhash: "0x898bb3b662419e79366046C625A213B83fB4809B",
//     method: "transfer",
//     age: "1 day",
//     block: "123456",
//     by: "0x898bb3b662419e79366046C625A213B83fB4809B",
//     gasfee: "0.1",
//   },
// ];
