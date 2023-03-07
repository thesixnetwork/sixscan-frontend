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
  Circle,
} from "@chakra-ui/react";
// ------------------------- NextJS -------------------------
import Head from "next/head";
// import Image from "next/image";
// ------------------------- Styles -------------------------
import styles from "@/styles/Home.module.css";
import {
  FaArrowRight,
  FaCheckCircle,
  FaChevronDown,
  FaChevronUp,
  FaCopy,
  FaDollarSign,
  FaExpand,
  FaScroll,
  FaSearch,
  FaSortAmountDown,
  FaSortNumericDown,
} from "react-icons/fa";
// ------------- Components ----------------
import NavBar from "@/components/NavBar";
import SearchBar from "@/components/SearchBar";
import CustomCard from "@/components/CustomCard";
import CustomTable from "@/components/CustomTable";
import { Footer } from "@/components/Footer";
import { Clickable } from "@/components/Clickable";
import { formatHex } from "@/utils/format";
import { useState } from "react";
import { getSchema } from "@/service/nftmngr";
import { NFTSchema } from "@/types/Nftmngr";
import { motion } from "framer-motion";
import { getOpenseaCollectionByName } from "@/service/opensea";
import { Collection } from "@/types/Opensea";
import { useRouter } from "next/router";

export default function Schema({
  schemacode,
  schema,
  openseaCollection,
}: {
  schemacode: string;
  schema: NFTSchema;
  openseaCollection: Collection;
}) {
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
  return (
    <Flex minHeight={"100vh"} direction={"column"} bgColor="lightest">
      <Head>
        <title>SIXSCAN</title>
        <meta name="description" content="SIXSCAN" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NavBar />
      {schema ? (
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
                                    chainConfig[
                                      schema.origin_data?.origin_chain
                                    ].icon
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
                              <Tbody>
                                {ACTIONS.map((action, index) => (
                                  <Tr key={index}>
                                    <Td>
                                      <Text>
                                        <Clickable href="/" underline>
                                          {formatHex(action.txhash)}
                                        </Clickable>
                                      </Text>
                                    </Td>
                                    <Td>
                                      <Text>
                                        <Clickable
                                          href={`/schema/${
                                            METADATA.find(
                                              (metadatum) =>
                                                metadatum.nftData.token_id ===
                                                action.token_id
                                            )?.nftData.nft_schema_code
                                          }/${action.token_id}`}
                                          underline
                                        >
                                          {
                                            METADATA.find(
                                              (metadatum) =>
                                                metadatum.nftData.token_id ===
                                                action.token_id
                                            )?.nftData.token_id
                                          }
                                        </Clickable>
                                      </Text>
                                    </Td>
                                    <Td>
                                      <Text>
                                        <Badge>{action.method}</Badge>
                                      </Text>
                                    </Td>
                                    <Td>
                                      <Text>{action.age}</Text>
                                    </Td>
                                    <Td>
                                      <Text>
                                        <Clickable href="/" underline>
                                          {action.block}
                                        </Clickable>
                                      </Text>
                                    </Td>
                                    <Td>
                                      <Text>
                                        <Clickable href="/" underline>
                                          {formatHex(action.by)}
                                        </Clickable>
                                      </Text>
                                    </Td>
                                    <Td>
                                      <Text>{`${action.gasfee} SIX`}</Text>
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
                            <Button size="sm" colorScheme={"gray"}>
                              <FaExpand fontSize={12} />
                            </Button>
                            <Button size="sm" colorScheme={"gray"}>
                              <FaCopy fontSize={12} />
                            </Button>
                          </Flex>
                          <Textarea
                            value={JSON.stringify(schema, null, 2)}
                            readOnly
                            minH={500}
                          />
                        </TabPanel>
                        <TabPanel>
                          <Grid templateColumns="repeat(12, 1fr)" gap={6}>
                            {METADATA.map((metadata, index) => (
                              <GridItem
                                colSpan={{ base: 6, md: 4, lg: 2 }}
                                key={index}
                              >
                                <CustomCard>
                                  <Link
                                    href={`/schema/${metadata.nftData.nft_schema_code}/${metadata.nftData.token_id}`}
                                  >
                                    <Image
                                      src={
                                        metadata.nftData.onchain_image
                                          ? metadata.nftData.onchain_image
                                          : metadata.nftData.origin_image
                                      }
                                      alt="mfer"
                                      width="100%"
                                    />
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
                                          TokenID
                                        </Text>
                                        <Text
                                          fontSize="sm"
                                          color={"primary.500"}
                                        >
                                          {metadata.nftData.token_id}
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
      ) : (
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
      )}
      <Spacer />
      <Footer />
    </Flex>
  );
}

export const getServerSideProps = async (context: {
  params: { schemacode: string };
}) => {
  const { schemacode } = context.params;
  const schema = await getSchema(schemacode);
  const [organisation, code] = schema
    ? schema.code.includes(".")
      ? schema.code.split(".")
      : ["", schema.code]
    : ["", ""];
  const openseaCollection =
    code && code !== "" ? await getOpenseaCollectionByName(code) : null;
  return {
    props: {
      schemacode,
      schema,
      openseaCollection,
    },
  };
};

const STATS = [
  {
    title: "Items",
    value: "100",
  },
  {
    title: "Created",
    value: "Oct 2022",
  },
  {
    title: "Chain",
    value: "Klaytn",
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
    token_id: "1",
  },
];

const METADATA = [
  {
    nftData: {
      nft_schema_code: "sixnetwork.whalegate",
      token_id: "1",
      token_owner: "0x6A127EF7e02d3Cb83387f2c71db0EEA1e1d0D250",
      owner_address_type: "ORIGIN_ADDRESS",
      origin_image:
        "https://ipfs.whalegate.sixprotocol.com/ipfs/Qmax9JSauGbCYJ8ie3QvDhxutB6xdZHR7ATmE5y3HGbiVb/1.png",
      onchain_image:
        "https://ipfs.whalegate.sixprotocol.com/ipfs/Qmax9JSauGbCYJ8ie3QvDhxutB6xdZHR7ATmE5y3HGbiVb/1-t.png",
      token_uri: "",
      origin_attributes: [
        {
          name: "background",
          string_attribute_value: {
            value: "Galaxy",
          },
          hidden_to_marketplace: false,
        },
        {
          name: "tail",
          string_attribute_value: {
            value: "White",
          },
          hidden_to_marketplace: false,
        },
        {
          name: "creature",
          string_attribute_value: {
            value: "Whale",
          },
          hidden_to_marketplace: false,
        },
      ],
      onchain_attributes: [
        {
          name: "points",
          number_attribute_value: {
            value: "400",
          },
          hidden_to_marketplace: false,
        },
        {
          name: "missions_completed",
          number_attribute_value: {
            value: "3",
          },
          hidden_to_marketplace: false,
        },
        {
          name: "bonus_1",
          boolean_attribute_value: {
            value: true,
          },
          hidden_to_marketplace: false,
        },
        {
          name: "bonus_2",
          boolean_attribute_value: {
            value: true,
          },
          hidden_to_marketplace: false,
        },
        {
          name: "checked_in",
          boolean_attribute_value: {
            value: true,
          },
          hidden_to_marketplace: false,
        },
        {
          name: "redeemed",
          boolean_attribute_value: {
            value: true,
          },
          hidden_to_marketplace: false,
        },
        {
          name: "transformed",
          boolean_attribute_value: {
            value: true,
          },
          hidden_to_marketplace: false,
        },
      ],
    },
  },
  {
    nftData: {
      nft_schema_code: "sixnetwork.whalegate",
      token_id: "2",
      token_owner: "0xC0B5f14c0140aE2DFA4CA15BEA5f19FdE4E24D9A",
      owner_address_type: "ORIGIN_ADDRESS",
      origin_image:
        "https://ipfs.whalegate.sixprotocol.com/ipfs/Qmax9JSauGbCYJ8ie3QvDhxutB6xdZHR7ATmE5y3HGbiVb/2.png",
      onchain_image:
        "https://ipfs.whalegate.sixprotocol.com/ipfs/Qmax9JSauGbCYJ8ie3QvDhxutB6xdZHR7ATmE5y3HGbiVb/2-t.png",
      token_uri: "",
      origin_attributes: [
        {
          name: "background",
          string_attribute_value: {
            value: "CoralPink",
          },
          hidden_to_marketplace: false,
        },
        {
          name: "moon",
          string_attribute_value: {
            value: "Beige",
          },
          hidden_to_marketplace: false,
        },
        {
          name: "plate",
          string_attribute_value: {
            value: "LightPurple",
          },
          hidden_to_marketplace: false,
        },
        {
          name: "tail",
          string_attribute_value: {
            value: "DarkBlue",
          },
          hidden_to_marketplace: false,
        },
        {
          name: "creature",
          string_attribute_value: {
            value: "Whale",
          },
          hidden_to_marketplace: false,
        },
      ],
      onchain_attributes: [
        {
          name: "points",
          number_attribute_value: {
            value: "0",
          },
          hidden_to_marketplace: false,
        },
        {
          name: "missions_completed",
          number_attribute_value: {
            value: "3",
          },
          hidden_to_marketplace: false,
        },
        {
          name: "bonus_1",
          boolean_attribute_value: {
            value: false,
          },
          hidden_to_marketplace: false,
        },
        {
          name: "bonus_2",
          boolean_attribute_value: {
            value: false,
          },
          hidden_to_marketplace: false,
        },
        {
          name: "checked_in",
          boolean_attribute_value: {
            value: true,
          },
          hidden_to_marketplace: false,
        },
        {
          name: "redeemed",
          boolean_attribute_value: {
            value: true,
          },
          hidden_to_marketplace: false,
        },
        {
          name: "transformed",
          boolean_attribute_value: {
            value: true,
          },
          hidden_to_marketplace: false,
        },
      ],
    },
  },
];
