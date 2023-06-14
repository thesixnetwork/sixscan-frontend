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
  Tooltip,
} from "@chakra-ui/react";
// ------------------------- NextJS -------------------------
import Head from "next/head";
// ------------------------- Styles -------------------------
import {
  FaArrowLeft,
  FaArrowRight,
  FaChevronDown,
  FaCopy,
  FaExpand,
  FaScroll,
  FaSortAmountDown,
} from "react-icons/fa";
// ------------- Components ----------------
import NavBar from "@/components/NavBar";
import CustomCard from "@/components/CustomCard";
import { LinkComponent } from "@/components/Chakralink";
import { Clickable } from "@/components/Clickable";
import { convertUsixToSix, formatHex, formatNumber } from "@/utils/format";
import { formatTraitValue } from "@/utils/format";
import AttributeBox from "@/components/AttributeBox";
import { getMetadata, getSchema, getAllTransactionByTokenID } from "@/service/nftmngr";
import { Metadata } from "@/types/Opensea";
import { NFTSchema, LatestAction } from "@/types/Nftmngr";
import { useState } from "react";
import { useRouter } from "next/router";
import moment from "moment";

import dynamic from 'next/dynamic';
import React from 'react';
const ReactJsonViewer = dynamic(
  () => import('react-json-viewer-cool'),
  { ssr: false } // สำคัญ! บอกให้ Next.js ไม่โหลดโมดูลนี้ในระหว่างการสร้างเว็บไซต์
);


interface Props {
  metadata: Metadata;
  schema: NFTSchema;
  latestAction: LatestAction;
  schemacode: string;
  pageNumber: string;
  tokenId: string;
}

export default function Schema({ metadata, schema, latestAction, schemacode, pageNumber, tokenId }: Props) {
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
                    <Text>{metadata.description}</Text>
                    <Flex align="center" direction="row" gap={1}>
                      <Text fontSize={"sm"} fontWeight={"bold"}>
                        SHOW MORE
                      </Text>
                      <FaChevronDown fontSize={12} />
                    </Flex>
                  </Flex>
                  <Flex direction="row" gap={5}>
                    <Flex direction="column">
                      <Text fontWeight={"bold"}>{latestAction.txs.length}</Text>
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
                      {metadata.attributes?.map(
                        (attr, index) =>
                          !attr.is_origin &&
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
                          <Flex direction="row" gap={2} align="center">
                            <FaSortAmountDown fontSize={12} />
                            <Text>
                              Latest {latestAction.txs.length} from a total of{" "}
                              {/* <Clickable href="/"> */}
                                {latestAction.totalCount}
                              {/* </Clickable> */}
                              {" "}
                              transactions
                            </Text>
                          </Flex>

                          {latestAction && (
                            <Flex direction="row" gap={2} align="center" px="2">
                              <Button
                                variant={"solid"}
                                size="xs"
                                href={`/schema/${schemacode}/${tokenId}?page=1`}
                                as={LinkComponent}
                                isDisabled={parseInt(pageNumber) === 1}
                              >
                                First
                              </Button>
                              <Button
                                size="xs"
                                href={`/schema/${schemacode}/${tokenId}?page=1`}
                                as={LinkComponent}
                                isDisabled={parseInt(pageNumber) === 1}
                              >
                                <FaArrowLeft fontSize={12} />
                              </Button>
                              <Text fontSize="xs">
                                {`Page ${pageNumber} of ${latestAction.totalPage}`}
                              </Text>
                              <Button
                                size="xs"
                                href={`/schema/${schemacode}/${tokenId}?page=${parseInt(pageNumber) + 1
                                  }`}
                                as={LinkComponent}
                                isDisabled={
                                  parseInt(pageNumber) === latestAction.totalPage
                                }
                              >
                                <FaArrowRight fontSize={12} />
                              </Button>
                              <Button
                                size="xs"
                                href={`/schema/${schemacode}/${tokenId}?page=${latestAction.totalPage}`}
                                as={LinkComponent}
                                isDisabled={
                                  parseInt(pageNumber) === latestAction.totalPage
                                }
                              >
                                Last
                              </Button>
                            </Flex>
                          )}

                        </Flex>
                        <TableContainer>
                          <Table>
                            <Thead>
                              <Tr>
                                <Td>
                                  <Text>Txhash</Text>
                                </Td>
                                <Td>
                                  <Text>Action</Text>
                                </Td>
                                <Td>
                                  <Text>Age</Text>
                                </Td>
                                <Td>
                                  <Text>Block</Text>
                                </Td>
                                <Td>
                                  <Text>By</Text>
                                </Td>
                                <Td>
                                  <Text>Gas Fee</Text>
                                </Td>
                              </Tr>
                            </Thead>
                            <Tbody>
                              {latestAction.txs.map((action: any, index: number) => (
                                <Tr key={index}>
                                  <Td>
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
                                      <Badge>{action.decode_tx.action ? action.decode_tx.action : "unknow"}</Badge>
                                    </Text>
                                  </Td>
                                  <Td>
                                    <Text>{moment(action.time_stamp).fromNow()}</Text>
                                  </Td>
                                  <Td>
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
                                  <Td>
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
                                  <Td>
                                    <Text>{`${formatNumber(convertUsixToSix(parseInt(action.decode_tx.fee_amount)))} SIX`}</Text>
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
                            <ReactJsonViewer data={metadata} />
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
    getAllTransactionByTokenID(schemacode, tokenId, page, "3")
  ]);
  const pageNumber = page
  if (!schema) {
    return { props: { metadata: null, schema: null } };
  }
  return {
    props: { metadata, schema, latestAction, schemacode, pageNumber, tokenId },
  };
};

const CONFIG = [
  {
    title: "actions performed",
    value: "593",
  },
];

const ACTIONS = [
  {
    txhash: "0x898bb3b662419e79366046C625A213B83fB4809B",
    method: "transfer",
    age: "1 day",
    block: "123456",
    by: "0x898bb3b662419e79366046C625A213B83fB4809B",
    gasfee: "0.1",
  },
];
