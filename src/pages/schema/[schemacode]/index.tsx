// ------------------------- Chakra UI -------------------------
import {
  Box,
  Flex,
  Text,
  Container,
  Grid,
  GridItem,
  Link,
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
  Skeleton,
} from "@chakra-ui/react";
// ------------------------- NextJS -------------------------
import Head from "next/head";
// ------------------------- Styles -------------------------

import {
  FaArrowLeft,
  FaArrowRight,
  FaCheckCircle,
  FaChevronDown,
  FaChevronUp,
  FaCopy,
  FaExpand,
  FaRegWindowClose,
  FaScroll,
  FaSortAmountDown,
} from "react-icons/fa";
// ------------- Components ----------------
import CustomCard from "@/components/CustomCard";
import { LinkComponent } from "@/components/Chakralink";
import Pagination from "@/components/Pagination";

import { Clickable } from "@/components/Clickable";
import { useEffect, useState, Suspense } from "react";
import { getNftCollection, getMetadata, getImgCollection, getSchema, getNftCollectionNoLoop } from "@/service/nftmngr";
import { NftData, NFTSchema, NFTMetadata } from "@/types/Nftmngr";
import { motion } from "framer-motion";
import { getOpenseaCollectionByName } from "@/service/opensea";
import { Collection } from "@/types/Opensea";
import { useRouter } from "next/router";
import { getTxsFromSchema } from "@/service/txs";
import { convertUsixToSix, formatHex, formatNumber, formatMethod } from "@/utils/format";
import moment from "moment";
import { _LOG } from "@/utils/log_helper";
import { Metadata } from "@/types/Opensea";

import dynamic from 'next/dynamic';
import React from 'react';
import LoadingMetadataBox from "@/components/LoadingMetadataBox";
// import MetadataBox from "@/components/MetadataBox";
// const MetadataBox = React.lazy(() => import('@/components/MetadataBox'));
// import ReactJsonViewer from 'react-json-viewer-cool';
// const ReactJsonViewer = dynamic(
//   () => import('react-json-viewer-cool'),
//   { ssr: false }
// );

const DynamicReactJson = dynamic(
  () => import('react-json-view'),
  { ssr: false }
);

type Txns = {
  txs: any[];
  totalCount: number;
  totalPage: number;
};

interface Props {
  schemacode: string;
  schema: NFTSchema;
  openseaCollection: Collection;
  metadata: Metadata;
  // nftCollection: any;
  // nftCollectionV2: any;
  // txns: Txns;
  totalMetaData: any;
  pageNumber: string;
  metadataPageNumber: string;
  imgCollection: string;
}

export default function Schema({
  schemacode,
  schema,
  openseaCollection,
  metadata,
  // nftCollection,
  // nftCollectionV2,
  totalMetaData,
  pageNumber,
  metadataPageNumber,
  imgCollection,
}: Props) {
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState<NFTMetadata[]>([]);
  const [txns, setTxns] = useState<Txns | null>(null);
  const [sortedTxs, setSortedTxs] = useState<any[]>([]);
  const [isShowMore, setIsShowMore] = useState(false);
  const [imageError, setImageError] = useState(false);
  const router = useRouter();
  const chainConfig: {
    [key: string]: {
      opensea?: string;
      blockscan: string;
      icon?: string;
    };
  } = {
    ETHEREUM: {
      opensea: `https://opensea.io/assets/ethereum/`,
      blockscan: `https://etherscan.io/address/`,
      icon: `/eth-logo.png`,
    },
    KLAYTN: {
      opensea: `https://opensea.io/assets/klaytn/`,
      blockscan: `https://www.klaytnfinder.io/account/`,
      icon: `/klaytn-logo.png`,
    },
    GOERLI: {
      opensea: `https://opensea.io/assets/goerli/`,
      blockscan: `https://goerli.etherscan.io/address/`,
      icon: `/eth-logo.png`,
    },
    SIXNET: {
      blockscan: `https://evm.sixscan.io/address/`,
      icon: `/six.png`,
    },
    FIVENET: {
      blockscan: `https://fivenet.evm.sixscan.io/address/`,
      icon: `/six.png`,
    },
  };
  const [organization, code] = schema
    ? schema.code.includes(".")
      ? schema.code.split(".")
      : ["", schema.code]
    : ["", ""];
  const CONFIG = [
    // {
    //   title: "unique owners",
    //   value: "0",
    // },
    {
      title: "Organization",
      value: organization,
    },
    {
      title: "NFT Schema Code",
      value: code,
    },
  ];
  const [page, setPage] = useState(1);
  const [nftCollection, setNftCollection] = useState<any>([]);
  const perPage = 13;
  // const totalPages = schema ? Math.ceil(nftCollection?.pagination.total / perPage) : 0;
  let totalPages = 0;
  _LOG("nftCollection", nftCollection);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const totalPagess: number = 10; // จำนวนหน้าทั้งหมดให้แทนที่ด้วยค่าจริงของคุณ

  const handlePageChange = (newPage: number) => {
    setIsLoaded(false)
    setCurrentPage(newPage);
    setIsPage(newPage.toString());
  };

  const [isCopied, setIsCopied] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoadedTxns, setIsLoadedTxns] = useState(false);
  const [isStop, setIsStop] = useState(false);
  const [isPage, setIsPage] = useState("1");
  const [isPageTxns, setIsPageTxns] = useState("1");
  const [isSchemaCode, setIsSchemaCode] = useState(schemacode);
  ///////  get nft metadata /////////
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoaded(false)
        setItems([]);
        setNftCollection([]);
        // const resMetadata = await getNftCollectionByClient(schemacode, isPage);
        const response = await fetch(`/api/getNftCollection?schemaCode=${schemacode}&isPage=${isPage}`);
        const resMetadata = await response.json();
        setNftCollection(resMetadata);
        setIsLoaded(true);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [schemacode, isPage, isStop])

  if (nftCollection) {
    totalPages = schema ? Math.ceil(nftCollection?.pagination?.total / perPage) : 0;
  }

  const handlePageMetaData = (isPage: string) => {
    setIsLoaded(false)
    setIsPage(isPage);
  };

  //////////// get Txns /////////
  useEffect(() => {
    const fetchDataTxs = async () => {
      try {
        setIsLoadedTxns(false)
        setTxns(null);
        // const resTxns = await getTxsFromSchema(schemacode, isPageTxns, "15");
        const response = await fetch(`/api/getTxsFromSchema?schemaCode=${schemacode}&isPage=${isPageTxns}&isPageSize=15`);
        const resTxns = await response.json();
        setTxns(resTxns);
        setIsLoadedTxns(true);
      } catch (error) {
        console.log(error);
      }
    };
    fetchDataTxs();
  }, [schemacode, isPageTxns, isStop])

  const handlePageTxns = (isPage: string) => {
    setIsLoadedTxns(false)
    setIsPageTxns(isPage);
  };

  const getExplorerLink = (chain: string, address: string) => {
    chain = chain.toUpperCase();
    if (!chain || !chainConfig[chain]) {
      return "";
    }
    return chainConfig[chain].blockscan + address;
  };
  const getOpenseaLink = (chain: string, address: string) => {
    chain = chain.toUpperCase();
    if (!chain || !chainConfig[chain]) {
      return "";
    }
    if (chainConfig[chain].opensea) {
      return chainConfig[chain].opensea + address;
    }
    return "";
  };

  const getIcon = (chain: string) => {
    chain = chain.toUpperCase();
    if (!chain || !chainConfig[chain]) {
      return "";
    }
    return chainConfig[chain].icon;
  };

  const checkImage = () => {
    setImageError(true);
  };

  const handleCopyClick = () => {
    navigator.clipboard.writeText(JSON.stringify(schema, null, 2));
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1000);
  };
  const isTotalMeta = Math.ceil(totalMetaData.total / perPage)
  useEffect(() => {
    // sort by token_id
    if (!schema) {
      return;
    }
    if (nftCollection) {
      nftCollection?.metadata?.sort((a: NFTMetadata, b: NFTMetadata) => parseInt(a.token_id) - parseInt(b.token_id));

      const newItems = nftCollection?.metadata?.slice(
        (page - 1) * perPage,
        page * perPage
      );
      _LOG("newItems", newItems);
      setItems(newItems);
    }
    // sort txs
    if (txns) {
      setSortedTxs(
        txns.txs.sort((a: any, b: any) => b.time_stamp - a.time_stamp)
      );
    }
  }, [nftCollection, page, sortedTxs]);
  if (!schema) {
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
              Schema not found
            </Text>
            <Text fontSize={{ base: "xl", lg: "xl" }} mb={4}>
              Oops! Schema{" "}
              <Text as="span" fontWeight="bold">
                {schemacode}
              </Text>{" "}
              does not exist.
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
                {openseaCollection && openseaCollection.image_url ? (
                  <Image
                    rounded={{ base: "sm", md: "md", lg: "lg" }}
                    src={openseaCollection.image_url ? openseaCollection.image_url : "/logo-nftgen2-01.png"}
                    alt={schema.name}
                    width="100%"
                  />
                ) : (
                  <Image
                    rounded={{ base: "sm", md: "md", lg: "lg" }}
                    src={imgCollection ? imgCollection : "/logo-nftgen2-01.png"}
                    alt={"collection image not found"}
                    placeholder={"empty"}
                    width="100%"
                  />
                )}
              </GridItem>
              <GridItem colSpan={{ base: 12, md: 9 }}>
                <Flex direction="column" gap={4}>
                  <Flex direction="column">
                    <Flex direction="row" gap={2} alignItems="center">
                      <Text fontSize="2xl" fontWeight="bold">
                        {schema.name}
                      </Text>
                      {!schema.isVerified && (
                        <FaCheckCircle color={"rgb(69,153,234)"} />
                      )}
                    </Flex>
                    <Flex direction="row" gap={1}>
                      <Text fontSize="sm">Contract</Text>
                      <Text fontSize="sm">
                        <Clickable
                          href={getExplorerLink(
                            schema.origin_data.origin_chain,
                            schema.origin_data.origin_contract_address
                          )}
                          underline={
                            getExplorerLink(schema.origin_data.origin_chain, schema.origin_data.origin_contract_address) === "" ? false : true}
                        >
                          {getExplorerLink(
                            schema.origin_data.origin_chain,
                            schema.origin_data.origin_contract_address
                          )
                            ? schema.origin_data?.origin_contract_address
                            : "N/A"}
                        </Clickable>
                      </Text>
                    </Flex>
                  </Flex>
                  <Flex direction="row" gap={2}>
                    {getOpenseaLink(
                      schema.origin_data.origin_chain,
                      schema.origin_data.origin_contract_address
                    ) && (
                        <Flex direction="row" gap={1} alignItems="center">
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Link
                              href={getOpenseaLink(
                                schema.origin_data.origin_chain,
                                schema.origin_data.origin_contract_address
                              )}
                              target="_blank"
                            >
                              <Image
                                src="/opensea-logo.svg"
                                alt="opensea"
                                width={6}
                              />
                            </Link>
                          </motion.div>
                        </Flex>
                      )}
                    <Flex direction="row" gap={1} alignItems="center">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Link
                          href={getExplorerLink(
                            schema.origin_data.origin_chain,
                            schema.origin_data.origin_contract_address
                          )}
                          target="_blank"
                        >
                          {getIcon(schema.origin_data.origin_chain) && (
                            <Box
                              bgColor="light"
                              p={1}
                              borderRadius="full"
                              border="1px solid"
                              borderColor={"blackAlpha.100"}
                            >
                              {schema.origin_data?.origin_chain && (
                                <Image
                                  src={getIcon(schema.origin_data.origin_chain)}
                                  alt="icon"
                                  height={3.5}
                                />
                              )}
                            </Box>
                          )}
                        </Link>
                      </motion.div>
                    </Flex>
                  </Flex>
                  {openseaCollection && openseaCollection.description && (
                    <Flex direction="column">
                      {isShowMore ? (
                        <Text>{openseaCollection.description}</Text>
                      ) : (
                        <Text>
                          {`${openseaCollection.description.slice(0, 100)}...`}
                        </Text>
                      )}
                      <Flex align="center" direction="row" gap={1}>
                        <Box
                          onClick={() => setIsShowMore(!isShowMore)}
                          cursor={"pointer"}
                          display={"flex"}
                          alignItems={"center"}
                          justifyContent={"center"}
                          gap={1}
                        >
                          <Text fontSize={"sm"} fontWeight={"bold"}>
                            {isShowMore ? `SHOW LESS` : `SHOW MORE`}
                          </Text>
                          {isShowMore ? (
                            <FaChevronUp fontSize={12} />
                          ) : (
                            <FaChevronDown fontSize={12} />
                          )}
                        </Box>
                      </Flex>
                    </Flex>
                  )}
                  {!openseaCollection &&  (
                    <Flex direction="column">
                      {isShowMore && metadata.description ? metadata.description : `${metadata.description && metadata.description.substring(0, 100)}...`}
                      <Flex align="center" direction="row" gap={1} onClick={() => setIsShowMore(!isShowMore)}>
                        <Text fontSize={"sm"} fontWeight={"bold"}>
                          {isShowMore ? "SHOW LESS" : "SHOW MORE"}
                        </Text>
                        {isShowMore ? <FaChevronUp fontSize={12} /> : <FaChevronDown fontSize={12} />}
                      </Flex>
                    </Flex>
                  )
                  }
                  <Flex direction="row" gap={5}>
                    {CONFIG.map((config, index) => (
                      <Flex direction="column" key={index}>
                        <Text fontWeight={"bold"}>{config.value}</Text>
                        <Text color="medium">{config.title}</Text>
                      </Flex>
                    ))}
                  </Flex>
                </Flex>
              </GridItem>
              <GridItem colSpan={12}>
                <CustomCard>
                  <Tabs
                    isLazy
                    defaultIndex={parseInt(metadataPageNumber) > 1 ? 2 : 0}
                  >
                    <TabList>
                      <Tab>Txns</Tab>
                      <Tab>Schema</Tab>
                      <Tab>Metadata</Tab>
                      <Spacer />
                    </TabList>
                    <TabPanels>
                      <TabPanel>
                        <Flex
                          direction="row"
                          align="center"
                          color={"dark"}
                          justify="space-between"
                        >
                          <Flex direction="row" gap={2} align="center">
                            <FaSortAmountDown fontSize={12} />
                            {isLoadedTxns ?
                              <Text>
                                {`Showing ${txns ? txns.txs.length : "0"
                                  } txns from a total of `}
                                <Clickable>
                                  {txns ? txns.totalCount : "0"}
                                </Clickable>{" "}
                                transactions
                              </Text>
                              :
                              <Skeleton width={"200px"} height={"15px"} />
                            }
                          </Flex>
                          {isLoadedTxns ? txns && (
                            <Flex
                              direction="row"
                              gap={2}
                              align="center"
                              py={4}
                              justifyContent="right"
                            >
                              <Button
                                variant={"solid"}
                                size="xs"
                                isDisabled={parseInt(isPageTxns) === 1}
                                onClick={() => handlePageTxns("1")}
                              >
                                First
                              </Button>
                              <Button
                                size="xs"
                                isDisabled={parseInt(isPageTxns) === 1}
                                onClick={() => handlePageTxns((parseInt(isPageTxns) - 1).toString())}
                              >
                                <FaArrowLeft fontSize={12} />
                              </Button>
                              <Text fontSize="xs">
                                {`Page ${isPageTxns} of ${txns.totalPage}`}
                              </Text>
                              <Button
                                size="xs"
                                isDisabled={
                                  parseInt(isPageTxns) >= txns.totalPage
                                }
                                onClick={() => handlePageTxns((parseInt(isPageTxns) + 1).toString())}
                              >
                                <FaArrowRight fontSize={12} />
                              </Button>
                              <Button
                                size="xs"
                                isDisabled={
                                  parseInt(isPageTxns) >= txns.totalPage
                                }
                                onClick={() => handlePageTxns(txns.totalPage.toString())}
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
                              <Tr>
                                <Td>
                                  <Text textAlign={'center'}>Txhash</Text>
                                </Td>
                                <Td>
                                  <Text textAlign={'center'}>Token ID</Text>
                                </Td>
                                <Td>
                                  <Text textAlign={'center'}>Method</Text>
                                </Td>
                                <Td>
                                  <Text textAlign={'center'}>Age</Text>
                                </Td>
                                <Td>
                                  <Text textAlign={'center'}>Block</Text>
                                </Td>
                                <Td>
                                  <Text textAlign={'center'}>By</Text>
                                </Td>
                                <Td>
                                  <Text textAlign={'center'}>Gas Fee</Text>
                                </Td>
                              </Tr>
                            </Thead>
                            <Tbody>
                              {isLoadedTxns ? txns && txns.txs.map((tx, index) => (
                                <Tr key={index}>
                                  <Td>
                                    <Flex
                                      direction="row"
                                      gap={1}
                                      align="center"
                                      justifyContent={"center"}
                                    >
                                      {tx.code !== 0 && (
                                        <FaRegWindowClose
                                          color="red"
                                          fontSize={12}
                                        />
                                      )}
                                      <Clickable
                                        href={`/tx/${tx.txhash}`}
                                      >
                                        <Text style={{
                                          color: "#5C34A2",
                                          textDecoration: "none",
                                          fontFamily: "Nunito, Helvetica Neue, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol",
                                          fontSize: "14px",
                                          textAlign: "center",
                                        }}>
                                          {formatHex(tx.txhash)}
                                        </Text>
                                      </Clickable>
                                    </Flex>
                                  </Td>
                                  <Td>
                                    <Clickable
                                      href={`/schema/${tx.decode_tx.nftSchemaCode ? tx.decode_tx.nftSchemaCode : tx.decode_tx.nft_schema_code}/${tx.decode_tx.tokenId}`}
                                    >
                                      <Text style={{
                                        color: "#5C34A2",
                                        textDecoration: "none",
                                        fontFamily: "Nunito, Helvetica Neue, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol",
                                        fontSize: "14px",
                                        textAlign: "center",
                                      }}>
                                        {tx.decode_tx.tokenId}
                                      </Text>
                                    </Clickable>
                                  </Td>
                                  <Td>
                                    <Badge textAlign={"center"} width="100%">
                                      {formatMethod(tx.type)}
                                    </Badge>
                                  </Td>
                                  <Td>
                                    <Text textAlign={'center'}>
                                      {moment(tx.time_stamp).fromNow()}
                                    </Text>
                                  </Td>
                                  <Td>
                                    <Clickable
                                      href={`/block/${tx.block_height}`}
                                    >
                                      <Text style={{
                                        color: "#5C34A2",
                                        textDecoration: "none",
                                        fontFamily: "Nunito, Helvetica Neue, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol",
                                        fontSize: "14px",
                                        textAlign: "center"
                                      }}>
                                        {tx.block_height}
                                      </Text>
                                    </Clickable>
                                  </Td>
                                  <Td>
                                    {tx.decode_tx.creator && (
                                      <Clickable
                                        href={`/address/${tx.decode_tx.creator}`}
                                      >
                                        <Text style={{
                                          color: "#5C34A2",
                                          textDecoration: "none",
                                          fontFamily: "Nunito, Helvetica Neue, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol",
                                          fontSize: "14px",
                                          textAlign: "center"
                                        }}>
                                          {formatHex(tx.decode_tx.creator)}
                                        </Text>
                                      </Clickable>
                                    )}
                                  </Td>
                                  <Td>
                                    <Text textAlign={'center'}>{`${formatNumber(
                                      convertUsixToSix(
                                        parseInt(tx.decode_tx.fee_amount)
                                      )
                                    )} SIX`}</Text>
                                  </Td>
                                </Tr>
                              )) :
                                Array.from({ length: 10 }).map((_, index) => (
                                  <Tr key={index}>
                                    {Array.from({ length: 7 }).map((_, index) => (
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
                            <Text>Schema Source Code</Text>
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
                          value={JSON.stringify(schema, null, 2)}
                          readOnly
                          minH={500}
                        /> */}
                        <Box minHeight={"200px"} height={"400px"} width={"auto"} overflowY="auto" overflowX="hidden" backgroundColor={"#f4f4f4"} borderRadius={"10px"} >
                          <Flex p={3}>
                            <DynamicReactJson src={schema} collapsed={1} displayDataTypes={false} />
                          </Flex>
                        </Box>
                      </TabPanel>
                      <TabPanel>
                        <Pagination
                          currentPage={currentPage}
                          totalPages={isTotalMeta}
                          onPageChange={handlePageChange}
                        />
                        <Grid templateColumns="repeat(12, 1fr)" gap={6}>
                          {isLoaded && items?.map((metadata, index) => (
                            <GridItem
                              colSpan={{ base: 6, md: 4, lg: 2 }}
                              key={index}
                            >
                              <CustomCard>
                                <Link
                                  href={`/schema/${schema.code}/${metadata.token_id}`}
                                  _hover={{
                                    textDecoration: "none",
                                  }}
                                  as={LinkComponent}
                                >
                                  <motion.div whileHover={{ scale: 1.05 }}>
                                    {
                                      imageError ? (
                                        <Image
                                          src={
                                            "/logo-nftgen2-01.png"
                                          }
                                          alt="mfer"
                                          width="100%"
                                        />
                                      ) : (
                                        <Image
                                          src={
                                            metadata.image ? metadata.image : "/logo-nftgen2-01.png"
                                          }
                                          onError={checkImage}
                                          alt="mfer"
                                          width="100%"
                                        />
                                      )
                                    }
                                  </motion.div>
                                  <Flex direction="column" p={2}>
                                    <Flex
                                      direction="row"
                                      gap={2}
                                      align="center"
                                    >
                                      <Text
                                        fontSize="sm"
                                        fontWeight="bold"
                                        color="dark"
                                      >
                                        #
                                      </Text>
                                      <Text fontSize="sm" color={"primary.500"}>
                                        {metadata.token_id}
                                      </Text>
                                    </Flex>
                                  </Flex>
                                </Link>
                              </CustomCard>
                            </GridItem>
                          ))}
                          {!isLoaded && !items && Array.from({ length: 12 }).map((_, index) => (
                            <GridItem
                              colSpan={{ base: 6, md: 4, lg: 2 }}
                              key={index}
                            >
                              <CustomCard>
                                <Skeleton
                                  height="228px"
                                  width="auto"
                                />
                              </CustomCard>
                            </GridItem>
                          ))}
                        </Grid>
                        {/* <Suspense fallback={<LoadingMetadataBox />}>
                          <MetadataBox schema={schemacode} isPage={isPage}/>
                        </Suspense> */}
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
  params: { schemacode },
  // query: { page = "1", metadata_page = "1" },
}: {
  params: { schemacode: string };
  // query: { page: string; metadata_page: string };
}) => {
  const schema = await getSchema(schemacode);
  _LOG("schema: ", schema);
  if (!schema) {
    return {
      props: {
        schemacode: null,
        schema: null,
        openseaCollection: null,
        // nftCollection: null,
        txns: null,
        pageNumber: null,
        metadataPageNumber: null,
      },
    };
  }
  const [organization = "", code = schema?.code ?? ""] =
    schema.code?.split(".") ?? [];
  const [openseaCollection, totalMetaData, imgCollection, metadata] = await Promise.all([
    code ? await getOpenseaCollectionByName(code) : null,
    getNftCollectionNoLoop(schemacode),
    getImgCollection(schemacode, "1"),
    getMetadata(schemacode, "1"),
    // getTxsFromSchema(schemacode, page ? page : "1", "20"),
  ]);

  return {
    props: {
      schemacode,
      schema,
      openseaCollection,
      imgCollection,
      totalMetaData,
      metadata,
    },
  };
};
