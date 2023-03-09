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
  FaScroll,
  FaSortAmountDown,
} from "react-icons/fa";
// ------------- Components ----------------
import NavBar from "@/components/NavBar";
import CustomCard from "@/components/CustomCard";
import { Footer } from "@/components/Footer";
import { Clickable } from "@/components/Clickable";
import { useEffect, useState } from "react";
import { getNftCollection, getSchema } from "@/service/nftmngr";
import { NftData, NFTSchema } from "@/types/Nftmngr";
import { motion } from "framer-motion";
import { getOpenseaCollectionByName } from "@/service/opensea";
import { Collection } from "@/types/Opensea";
import { useRouter } from "next/router";

export default function Schema({
  schemacode,
  schema,
  openseaCollection,
  nftCollection,
}: {
  schemacode: string;
  schema: NFTSchema;
  openseaCollection: Collection;
  nftCollection: any;
}) {
  const [items, setItems] = useState<NftData[]>([]);
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
  const [organisation, code] = schema
    ? schema.code.includes(".")
      ? schema.code.split(".")
      : ["", schema.code]
    : ["", ""];
  const CONFIG = [
    {
      title: "unique owners",
      value: "0",
    },
    {
      title: "organisation",
      value: organisation,
    },
    {
      title: "whalegate",
      value: code,
    },
  ];
  const [page, setPage] = useState(1);
  const perPage = 12;
  const totalPages = nftCollection.pagination.total / perPage;

  const [isCopied, setIsCopied] = useState(false);
  // sort by token_id

  const handleCopyClick = () => {
    navigator.clipboard.writeText(JSON.stringify(schema, null, 2));
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1000);
  };

  useEffect(() => {
    // sort by token_id
    nftCollection.nftCollection.sort(
      (a: NftData, b: NftData) => parseInt(a.token_id) - parseInt(b.token_id)
    );
    const newItems = nftCollection.nftCollection.slice(
      (page - 1) * perPage,
      page * perPage
    );
    setItems(newItems);
  }, [nftCollection, page]);
  if (!schema) {
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
        <Footer />
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
      <NavBar />
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
                {openseaCollection && openseaCollection.image_url && (
                  <Image
                    rounded={{ base: "sm", md: "md", lg: "lg" }}
                    src={openseaCollection.image_url}
                    alt={schema.name}
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
                          href={
                            schema.origin_data?.origin_chain
                              ? chainConfig[schema.origin_data?.origin_chain]
                                  .blockscan +
                                schema.origin_data?.origin_contract_address
                              : ""
                          }
                          underline
                        >
                          {schema.origin_data?.origin_contract_address}
                        </Clickable>
                      </Text>
                    </Flex>
                  </Flex>
                  <Flex direction="row" gap={2}>
                    <Flex direction="row" gap={1} alignItems="center">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Link
                          href={
                            schema.origin_data?.origin_chain
                              ? chainConfig[schema.origin_data?.origin_chain]
                                  .opensea +
                                schema.origin_data?.origin_contract_address
                              : ""
                          }
                        >
                          <Image
                            src="/opensea-logo.svg"
                            alt="opensea"
                            width={6}
                          />
                        </Link>
                      </motion.div>
                    </Flex>
                    <Flex direction="row" gap={1} alignItems="center">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Link
                          href={
                            schema.origin_data?.origin_chain
                              ? chainConfig[schema.origin_data?.origin_chain]
                                  .blockscan +
                                schema.origin_data?.origin_contract_address
                              : ""
                          }
                        >
                          <Box
                            bgColor="light"
                            p={1}
                            borderRadius="full"
                            border="1px solid"
                            borderColor={"blackAlpha.100"}
                          >
                            {schema.origin_data?.origin_chain && (
                              <Image
                                src={
                                  chainConfig[schema.origin_data?.origin_chain]
                                    .icon
                                }
                                alt="icon"
                                height={3.5}
                              />
                            )}
                          </Box>
                        </Link>
                      </motion.div>
                    </Flex>
                  </Flex>
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
                  <Tabs isLazy>
                    <TabList>
                      <Tab>Latest Actions</Tab>
                      <Tab>Schema</Tab>
                      <Tab>Metadata</Tab>
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
                            Latest 25 from a total of{" "}
                            <Clickable underline href="/">
                              92
                            </Clickable>{" "}
                            transactions
                          </Text>
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
                            <Tbody></Tbody>
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
                        </Flex>
                        <Grid templateColumns="repeat(12, 1fr)" gap={6}>
                          {items.map((metadata, index) => (
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
                                        metadata.onchain_image
                                          ? metadata.onchain_image
                                          : metadata.origin_image
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
      <Footer />
    </Flex>
  );
}

export const getServerSideProps = async ({
  params: { schemacode },
}: {
  params: { schemacode: string };
}) => {
  const schema = await getSchema(schemacode);
  const [organisation = "", code = schema?.code ?? ""] =
    schema?.code?.split(".") ?? [];
  const openseaCollection = code
    ? await getOpenseaCollectionByName(code)
    : null;
  const nftCollection = await getNftCollection(schemacode);
  return {
    props: {
      schemacode,
      schema,
      openseaCollection,
      nftCollection,
    },
  };
};
