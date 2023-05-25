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
import NavBar from "@/components/NavBar";
import CustomCard from "@/components/CustomCard";

import { Clickable } from "@/components/Clickable";
import { useEffect, useState } from "react";
import { getNftCollection, getSchema } from "@/service/nftmngr";
import { NftData, NFTSchema } from "@/types/Nftmngr";
import { motion } from "framer-motion";
import { getOpenseaCollectionByName } from "@/service/opensea";
import { Collection } from "@/types/Opensea";
import { useRouter } from "next/router";
import { getTxsFromSchema } from "@/service/txs";
import { convertUsixToSix, formatHex, formatNumber } from "@/utils/format";
import moment from "moment";

type Txns = {
  txs: any[];
  totalCount: number;
  totalPage: number;
};

interface Props {
  schemacode: string;
  schema: NFTSchema;
  openseaCollection: Collection;
  nftCollection: any;
  txns: Txns;
  pageNumber: string;
  metadataPageNumber: string;
}

export default function Schema({
  schemacode,
  schema,
  openseaCollection,
  nftCollection,
  txns,
  pageNumber,
  metadataPageNumber,
}: Props) {
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState<NftData[]>([]);
  const [sortedTxs, setSortedTxs] = useState<any[]>([]);
  const [isShowMore, setIsShowMore] = useState(false);
  const router = useRouter();
  const chainConfig: {
    [key: string]: {
      opensea: string;
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
      title: "organization",
      value: organization,
    },
    {
      title: "whalegate",
      value: code,
    },
  ];
  const [page, setPage] = useState(1);
  const perPage = 12;
  const totalPages = schema ? Math.ceil(nftCollection?.pagination.total / perPage) : 0;
  console.log("totalPages", nftCollection);

  const [isCopied, setIsCopied] = useState(false);
  // sort by token_id

  const getExplorerLink = (chain: string, address: string) => {
    if (!chain || !chainConfig[chain]) {
      return "";
    }
    return chainConfig[chain].blockscan + address;
  };
  const getOpenseaLink = (chain: string, address: string) => {
    if (!chain || !chainConfig[chain]) {
      return "";
    }
    return chainConfig[chain].opensea + address;
  };

  const getIcon = (chain: string) => {
    if (!chain || !chainConfig[chain]) {
      return "";
    }
    return chainConfig[schema.origin_data?.origin_chain].icon;
  };

  const handleCopyClick = () => {
    navigator.clipboard.writeText(JSON.stringify(schema, null, 2));
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1000);
  };

  useEffect(() => {
    // sort by token_id
    if (!schema) {
      return;
    }
    nftCollection?.metadata.sort((a: NftData, b: NftData) => parseInt(a.token_id) - parseInt(b.token_id));
    const newItems = nftCollection?.metadata.slice(
      (page - 1) * perPage,
      page * perPage
    );
    setItems(newItems);
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
                    src={openseaCollection.image_url? openseaCollection.image_url : "/logo-nftgen2-01.png"}
                    alt={schema.name}
                    width="100%"
                  />
                ) : (
                  <Flex
                    width="100%"
                    height="100%"
                    alignItems="center"
                    justifyContent="center"
                    bgColor="light"
                    rounded={{ base: "sm", md: "md", lg: "lg" }}
                  >
                    <Text color="dark">No Collection Image Found</Text>
                  </Flex>
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
                            getExplorerLink(
                              schema.origin_data.origin_chain,
                              schema.origin_data.origin_contract_address
                            ) === ""
                              ? false
                              : true
                          }
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
                    <TabList overflow={{ base: "auto", md: "none" }}>
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
                            <Text>
                              {`Showing ${
                                txns ? txns.txs.length : "0"
                              } txns from a total of `}
                              <Clickable>
                                {txns ? txns.totalCount : "0"}
                              </Clickable>{" "}
                              transactions
                            </Text>
                          </Flex>
                          {txns && (
                            <Flex direction="row" gap={2} align="center" px="2">
                              <Button
                                variant={"solid"}
                                size="xs"
                                href={`/schema/${schemacode}?page=1`}
                                as="a"
                                isDisabled={parseInt(pageNumber) === 1}
                              >
                                First
                              </Button>
                              <Button
                                size="xs"
                                href={`/schema/${schemacode}?page=1`}
                                as="a"
                                isDisabled={parseInt(pageNumber) === 1}
                              >
                                <FaArrowLeft fontSize={12} />
                              </Button>
                              <Text fontSize="xs">
                                {`Page ${pageNumber} of ${txns.totalPage}`}
                              </Text>
                              <Button
                                size="xs"
                                href={`/schema/${schemacode}?page=${
                                  parseInt(pageNumber) + 1
                                }`}
                                as="a"
                                isDisabled={
                                  parseInt(pageNumber) === txns.totalPage
                                }
                              >
                                <FaArrowRight fontSize={12} />
                              </Button>
                              <Button
                                size="xs"
                                href={`/schema/${schemacode}?page=${txns.totalPage}`}
                                as="a"
                                isDisabled={
                                  parseInt(pageNumber) === txns.totalPage
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
                                  <Text>Token ID</Text>
                                </Td>
                                <Td>
                                  <Text>Method</Text>
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
                              {sortedTxs.map((tx, index) => (
                                <Tr key={index}>
                                  <Td>
                                    <Flex
                                      direction="row"
                                      gap={1}
                                      align="center"
                                    >
                                      {tx.code !== 0 && (
                                        <FaRegWindowClose
                                          color="red"
                                          fontSize={12}
                                        />
                                      )}
                                      <Text>
                                        <Clickable
                                          href={`/tx/${tx.txhash}`}
                                          underline
                                        >
                                          {formatHex(tx.txhash)}
                                        </Clickable>
                                      </Text>
                                    </Flex>
                                  </Td>
                                  <Td>
                                    <Text>
                                      <Clickable
                                        href={`/schema/${tx.decode_tx.nftSchemaCode}/${tx.decode_tx.tokenId}`}
                                        underline
                                      >
                                        {tx.decode_tx.tokenId}
                                      </Clickable>
                                    </Text>
                                  </Td>
                                  <Td>
                                    <Badge textAlign={"center"} width="100%">
                                      {tx.type
                                        .split(".")
                                        [tx.type.split(".").length - 1].slice(
                                          3
                                        )}
                                    </Badge>
                                  </Td>
                                  <Td>
                                    <Text>
                                      {moment(tx.time_stamp).fromNow()}
                                    </Text>
                                  </Td>
                                  <Td>
                                    <Text>
                                      <Clickable
                                        href={`/block/${tx.block_height}`}
                                        underline
                                      >
                                        {tx.block_height}
                                      </Clickable>
                                    </Text>
                                  </Td>
                                  <Td>
                                    <Text>
                                      {tx.decode_tx.creator && (
                                        <Clickable
                                          href={`/address/${tx.decode_tx.creator}`}
                                          underline
                                        >
                                          {formatHex(tx.decode_tx.creator)}
                                        </Clickable>
                                      )}
                                    </Text>
                                  </Td>
                                  <Td>
                                    <Text>{`${formatNumber(
                                      convertUsixToSix(
                                        parseInt(tx.decode_tx.fee_amount)
                                      )
                                    )} SIX`}</Text>
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
                        <Textarea
                          value={JSON.stringify(schema, null, 2)}
                          readOnly
                          minH={500}
                        />
                      </TabPanel>
                      <TabPanel>
                        {/* <Flex
                          direction="row"
                          gap={2}
                          align="center"
                          py={4}
                          justifyContent="right"
                        >
                          <Button
                            variant={"solid"}
                            size="xs"
                            isDisabled={page === 1}
                            onClick={() => {
                              setPage(1);
                            }}
                          >
                            First
                          </Button>
                          <Button
                            size="xs"
                            isDisabled={page === 1}
                            onClick={() => {
                              setPage(page - 1);
                            }}
                          >
                            <FaArrowLeft fontSize={12} />
                          </Button>
                          <Text fontSize="xs">
                            {`Page ${page} of ${Math.ceil(totalPages)}`}
                          </Text>
                          <Button
                            size="xs"
                            isDisabled={page === Math.ceil(totalPages)}
                            onClick={() => {
                              setPage(page + 1);
                            }}
                          >
                            <FaArrowRight fontSize={12} />
                          </Button>
                          <Button
                            size="xs"
                            isDisabled={page === Math.ceil(totalPages)}
                            onClick={() => {
                              setPage(totalPages);
                            }}
                          >
                            Last
                          </Button>
                        </Flex> */}
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
                            href={`/schema/${schemacode}?metadata_page=1`}
                            as="a"
                            isDisabled={parseInt(metadataPageNumber) === 1}
                          >
                            First
                          </Button>
                          <Button
                            size="xs"
                            href={`/schema/${schemacode}?metadata_page=1`}
                            as="a"
                            isDisabled={parseInt(metadataPageNumber) === 1}
                          >
                            <FaArrowLeft fontSize={12} />
                          </Button>
                          <Text fontSize="xs">
                            {`Page ${metadataPageNumber} of ${totalPages}`}
                          </Text>
                          <Button
                            size="xs"
                            href={`/schema/${schemacode}?metadata_page=${
                              parseInt(metadataPageNumber) + 1
                            }`}
                            as="a"
                            isDisabled={
                              parseInt(metadataPageNumber) === totalPages
                            }
                          >
                            <FaArrowRight fontSize={12} />
                          </Button>
                          <Button
                            size="xs"
                            href={`/schema/${schemacode}?metadata_page=${totalPages}`}
                            as="a"
                            isDisabled={
                              parseInt(metadataPageNumber) === totalPages
                            }
                          >
                            Last
                          </Button>
                        </Flex>
                        <Grid templateColumns="repeat(12, 1fr)" gap={6}>
                          {items?.map((metadata, index) => (
                            <GridItem
                              colSpan={{ base: 6, md: 4, lg: 2 }}
                              key={index}
                            >
                              <CustomCard>
                                <Link
                                  href={`/schema/${metadata.nft_schema_code}/${metadata.token_id}`}
                                  _hover={{
                                    textDecoration: "none",
                                  }}
                                >
                                  <motion.div whileHover={{ scale: 1.05 }}>
                                  <Image
                                      src={
                                        metadata.onchain_image ? metadata.onchain_image : metadata.origin_image
                                      }
                                      alt="mfer"
                                      width="100%"
                                    />
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
                        </Grid>
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
  query: { page = "1", metadata_page = "1" },
}: {
  params: { schemacode: string };
  query: { page: string; metadata_page: string };
}) => {
  const schema = await getSchema(schemacode);
  // console.log("schema: ", schema);
  if (!schema) {
    console.log("schema is not")
    return {
      props: {
        schemacode: null,
        schema: null,
        openseaCollection: null,
        nftCollection: null,
        txns: null,
        pageNumber: null,
        metadataPageNumber: null,
      },
    };
  }
  const [organization = "", code = schema?.code ?? ""] =
    schema.code?.split(".") ?? [];
  const [openseaCollection, nftCollection, txns] = await Promise.all([
    code ? await getOpenseaCollectionByName(code) : null,
    getNftCollection(schemacode, metadata_page),
    getTxsFromSchema(schemacode, page ? page : "1", "20"),
  ]);
  return {
    props: {
      schemacode,
      schema,
      openseaCollection,
      nftCollection,
      txns,
      pageNumber: page,
      metadataPageNumber: metadata_page,
    },
  };
};
