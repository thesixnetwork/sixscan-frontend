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
} from "@chakra-ui/react";
// ------------------------- NextJS -------------------------
import Head from "next/head";
// import Image from "next/image";
// ------------------------- Styles -------------------------
import styles from "@/styles/Home.module.css";
import {
  FaArrowRight,
  FaChevronDown,
  FaChevronUp,
  FaCopy,
  FaDollarSign,
  FaExpand,
  FaScroll,
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

const formatNumber = (num: number) => {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
};

export default function Schema({ schema }: { schema: any }) {
  const [isShowMore, setIsShowMore] = useState(false);
  return (
    <Flex minHeight={"100vh"} direction={"column"} bgColor="lightest">
      {/* testing eslint */}
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
                <Image
                  rounded={{ base: "sm", md: "md", lg: "lg" }}
                  src="/mfer.png"
                  alt="mfer"
                  width="100%"
                />
              </GridItem>
              <GridItem colSpan={{ base: 12, md: 9 }}>
                <Flex direction="column" gap={4}>
                  <Flex direction="column">
                    <Text fontSize="2xl" fontWeight="bold">
                      {schema.name} Collection
                    </Text>
                    <Flex direction="row" gap={1}>
                      <Text fontSize="sm">Contract</Text>
                      <Text fontSize="sm">
                        <Clickable href="/" underline>
                          {SCHEMA.nFTSchema.origin_data.origin_contract_address}
                        </Clickable>
                      </Text>
                    </Flex>
                  </Flex>
                  <Flex direction="row" gap={4}>
                    <Flex direction="row" gap={1}>
                      <Text>test</Text>
                      <Text fontWeight={"bold"}>test2</Text>
                    </Flex>
                  </Flex>
                  <Flex direction="column">
                    {isShowMore ? (
                      <Text>
                        {`The "Whale Gate" collection is the world's first NFT Gen 2 collection, consisting of 600 unique
                                                Klaytn-based NFTs. The collection is a collaboration between the world's leading NFT artists and
                                                the world's first NFT Gen 2 platform, Whale Gate. The collection is a collaboration between the
                                                world's leading NFT artists and the world's first NFT Gen 2 platform, Whale Gate.`}
                      </Text>
                    ) : (
                      <Text>
                        {`The "Whale Gate" collection is the world's first NFT Gen 2 collection, consisting of 600 unique
                                            Klaytn-based NFTs...`}
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
                          value={JSON.stringify(SCHEMA, null, 2)}
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
                                      <Text fontSize="sm" color={"primary.500"}>
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
  return {
    props: {
      schema,
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

const CONFIG = [
  {
    title: "unique owners",
    value: "593",
  },
  {
    title: "organisation",
    value: "sixnetwork",
  },
  {
    title: "whalegate",
    value: "schema",
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

const SCHEMA = {
  nFTSchema: {
    code: "sixnetwork.whalegate",
    name: "WHALEGATE",
    owner: "6x1fq5wjklc379gh9lwy00n9xn64m90h6av8t9wsw",
    system_actioners: [
      "6nft16xncggw0w92wdpykzjj5gjvrgkq50dfvzzx0t8",
      "6nft1vhwp0uk94a0m6lzwd68nyhs7zhthtmal6dwd94",
      "6nft1yayu5s3dtp3dktcf93rmjszryjyzefq4uya38s",
      "6nft1xpmx5g9j756zf0l2tp4g7ptmq904nq0a7w9wdn",
      "6nft15f24wafjkjl8ejqjy9u6m5kqqy0qwdmn7eg9th",
      "6x1t3gg4zc30fdfqs06r7c49u8japeh3su5f344uz",
      "6x13n788j2apzzyj3rzk673j8mnscgqmkjyaaylrs",
      "6x1uhs0677mad3vg2cuj2zc93j0l3yrlrkwznqa5c",
      "6x1yete68tsu3vgwu7d3pa92yd5pmuggznuwwy9ul",
    ],
    origin_data: {
      origin_chain: "KLAYTN",
      origin_contract_address: "0x898bb3b662419e79366046C625A213B83fB4809B",
      origin_base_uri:
        "https://ipfs.whalegate.sixprotocol.com/ipfs/Qmd9FJGWveLd1g6yZTDDNjxruVppyDtaUzrA2pkb2XAf8R/",
      attribute_overriding: "CHAIN",
      metadata_format: "opensea",
      origin_attributes: [
        {
          name: "background",
          data_type: "string",
          required: false,
          display_value_field: "value",
          display_option: {
            bool_true_value: "",
            bool_false_value: "",
            opensea: {
              display_type: "",
              trait_type: "Background",
              max_value: "0",
            },
          },
          default_mint_value: null,
          hidden_to_marketplace: false,
          index: "0",
        },
        {
          name: "moon",
          data_type: "string",
          required: false,
          display_value_field: "value",
          display_option: {
            bool_true_value: "",
            bool_false_value: "",
            opensea: {
              display_type: "",
              trait_type: "Moon",
              max_value: "0",
            },
          },
          default_mint_value: null,
          hidden_to_marketplace: false,
          index: "1",
        },
        {
          name: "plate",
          data_type: "string",
          required: false,
          display_value_field: "value",
          display_option: {
            bool_true_value: "",
            bool_false_value: "",
            opensea: {
              display_type: "",
              trait_type: "Plate",
              max_value: "0",
            },
          },
          default_mint_value: null,
          hidden_to_marketplace: false,
          index: "2",
        },
        {
          name: "tail",
          data_type: "string",
          required: false,
          display_value_field: "value",
          display_option: {
            bool_true_value: "",
            bool_false_value: "",
            opensea: {
              display_type: "",
              trait_type: "Tail",
              max_value: "0",
            },
          },
          default_mint_value: null,
          hidden_to_marketplace: false,
          index: "3",
        },
        {
          name: "creature",
          data_type: "string",
          required: false,
          display_value_field: "value",
          display_option: {
            bool_true_value: "",
            bool_false_value: "",
            opensea: {
              display_type: "",
              trait_type: "Creature",
              max_value: "0",
            },
          },
          default_mint_value: null,
          hidden_to_marketplace: false,
          index: "4",
        },
      ],
      uri_retrieval_method: "BASE",
    },
    onchain_data: {
      reveal_required: true,
      reveal_secret: null,
      nft_attributes: [],
      token_attributes: [
        {
          name: "points",
          data_type: "number",
          required: true,
          display_value_field: "value",
          display_option: {
            bool_true_value: "",
            bool_false_value: "",
            opensea: {
              display_type: "",
              trait_type: "Points",
              max_value: "0",
            },
          },
          default_mint_value: {
            number_attribute_value: {
              value: "0",
            },
          },
          hidden_to_marketplace: false,
          index: "5",
        },
        {
          name: "missions_completed",
          data_type: "number",
          required: true,
          display_value_field: "value",
          display_option: {
            bool_true_value: "",
            bool_false_value: "",
            opensea: {
              display_type: "",
              trait_type: "Missions Completed",
              max_value: "3",
            },
          },
          default_mint_value: {
            number_attribute_value: {
              value: "1",
            },
          },
          hidden_to_marketplace: false,
          index: "6",
        },
        {
          name: "bonus_1",
          data_type: "boolean",
          required: true,
          display_value_field: "value",
          display_option: {
            bool_true_value: "Yes",
            bool_false_value: "No",
            opensea: {
              display_type: "",
              trait_type: "Bonus 1",
              max_value: "0",
            },
          },
          default_mint_value: {
            boolean_attribute_value: {
              value: false,
            },
          },
          hidden_to_marketplace: false,
          index: "7",
        },
        {
          name: "bonus_2",
          data_type: "boolean",
          required: true,
          display_value_field: "value",
          display_option: {
            bool_true_value: "Yes",
            bool_false_value: "No",
            opensea: {
              display_type: "",
              trait_type: "Bonus 2",
              max_value: "0",
            },
          },
          default_mint_value: {
            boolean_attribute_value: {
              value: false,
            },
          },
          hidden_to_marketplace: false,
          index: "8",
        },
        {
          name: "checked_in",
          data_type: "boolean",
          required: true,
          display_value_field: "value",
          display_option: {
            bool_true_value: "Yes",
            bool_false_value: "No",
            opensea: {
              display_type: "",
              trait_type: "Checked In",
              max_value: "0",
            },
          },
          default_mint_value: {
            boolean_attribute_value: {
              value: false,
            },
          },
          hidden_to_marketplace: false,
          index: "9",
        },
        {
          name: "redeemed",
          data_type: "boolean",
          required: true,
          display_value_field: "value",
          display_option: {
            bool_true_value: "Yes",
            bool_false_value: "No",
            opensea: {
              display_type: "",
              trait_type: "Redeemed",
              max_value: "0",
            },
          },
          default_mint_value: {
            boolean_attribute_value: {
              value: false,
            },
          },
          hidden_to_marketplace: false,
          index: "10",
        },
        {
          name: "transformed",
          data_type: "boolean",
          required: true,
          display_value_field: "value",
          display_option: {
            bool_true_value: "Yes",
            bool_false_value: "No",
            opensea: {
              display_type: "",
              trait_type: "Transformed",
              max_value: "0",
            },
          },
          default_mint_value: {
            boolean_attribute_value: {
              value: false,
            },
          },
          hidden_to_marketplace: false,
          index: "11",
        },
      ],
      actions: [
        {
          name: "check_in",
          desc: "Check In",
          disable: false,
          when: "meta.GetBoolean('checked_in') == false",
          then: [
            "meta.SetBoolean('checked_in', true)",
            "meta.SetNumber('missions_completed', meta.GetNumber('missions_completed') + 1)",
            "meta.SetNumber('points', meta.GetNumber('points') + 200)",
          ],
          allowed_actioner: "ALLOWED_ACTIONER_ALL",
          params: [],
        },
        {
          name: "claim_bonus_1",
          desc: "Claim Bonus 1",
          disable: false,
          when: "meta.GetBoolean('bonus_1') == false",
          then: [
            "meta.SetBoolean('bonus_1', true)",
            "meta.SetNumber('points', meta.GetNumber('points') + 200)",
          ],
          allowed_actioner: "ALLOWED_ACTIONER_ALL",
          params: [],
        },
        {
          name: "claim_bonus_2",
          desc: "Claim Bonus 2",
          disable: false,
          when: "meta.GetBoolean('bonus_2') == false",
          then: [
            "meta.SetBoolean('bonus_2', true)",
            "meta.SetNumber('points', meta.GetNumber('points') + 200)",
          ],
          allowed_actioner: "ALLOWED_ACTIONER_ALL",
          params: [],
        },
        {
          name: "redeem_200",
          desc: "Redeem gift for 200 points",
          disable: false,
          when: "meta.GetBoolean('redeemed') == false && meta.GetNumber('points') >= 200 && meta.GetBoolean('transformed') == false && meta.GetNumber('missions_completed') == 2",
          then: [
            "meta.SetBoolean('redeemed', true)",
            "meta.SetNumber('points', meta.GetNumber('points') - 200)",
            "meta.SetNumber('missions_completed', meta.GetNumber('missions_completed') + 1)",
            "meta.SetBoolean('transformed', true)",
            "meta.SetImage(meta.ReplaceAllString(meta.GetImage(),'.png','-t.png'))",
          ],
          allowed_actioner: "ALLOWED_ACTIONER_ALL",
          params: [],
        },
        {
          name: "redeem_400",
          desc: "Redeem gift for 400 points",
          disable: false,
          when: "meta.GetBoolean('redeemed') == false && meta.GetNumber('points') >= 400 && meta.GetBoolean('transformed') == false && meta.GetNumber('missions_completed') == 2",
          then: [
            "meta.SetBoolean('redeemed', true)",
            "meta.SetNumber('points', meta.GetNumber('points') - 400)",
            "meta.SetNumber('missions_completed', meta.GetNumber('missions_completed') + 1)",
            "meta.SetBoolean('transformed', true)",
            "meta.SetImage(meta.ReplaceAllString(meta.GetImage(),'.png','-t.png'))",
          ],
          allowed_actioner: "ALLOWED_ACTIONER_ALL",
          params: [],
        },
        {
          name: "redeem_600",
          desc: "Redeem gift for 600 points",
          disable: false,
          when: "meta.GetBoolean('redeemed') == false && meta.GetNumber('points') >= 600 && meta.GetBoolean('transformed') == false && meta.GetNumber('missions_completed') == 2",
          then: [
            "meta.SetBoolean('redeemed', true)",
            "meta.SetNumber('points', meta.GetNumber('points') - 600)",
            "meta.SetNumber('missions_completed', meta.GetNumber('missions_completed') + 1)",
            "meta.SetBoolean('transformed', true)",
            "meta.SetImage(meta.ReplaceAllString(meta.GetImage(),'.png','-t.png'))",
          ],
          allowed_actioner: "ALLOWED_ACTIONER_ALL",
          params: [],
        },
      ],
      status: [],
      nft_attributes_value: [],
    },
    isVerified: false,
    mint_authorization: "system",
  },
};

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
