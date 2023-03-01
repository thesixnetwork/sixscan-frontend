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
  FaChevronDown,
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
import { Footer } from "@/components/Footer";
import { Clickable } from "@/components/Clickable";
import { formatHex } from "@/utils/format";
import { formatTraitValue } from "@/utils/format";
import AttributeBox from "@/components/AttributeBox";

export default function Schema() {
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
                  rounded={"lg"}
                  src={METADATA.image}
                  alt="mfer"
                  width="100%"
                />
              </GridItem>
              <GridItem colSpan={{ base: 12, md: 9 }}>
                <Flex direction="column" gap={4}>
                  <Flex direction="column">
                    <Text fontSize="2xl" fontWeight="bold">
                      {METADATA.name}
                    </Text>
                    <Flex direction="row" gap={1}>
                      <Text fontSize="sm">Schema</Text>
                      <Text fontSize="sm">
                        <Clickable href="/" underline>
                          BUAKAW1XTAT
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
                    <Text>
                      {`The "Whale Gate" collection is the world's first NFT Gen 2 collection, consisting of 600 unique
                                            Klaytn-based NFTs...`}
                    </Text>
                    <Flex align="center" direction="row" gap={1}>
                      <Text fontSize={"sm"} fontWeight={"bold"}>
                        SHOW MORE
                      </Text>
                      <FaChevronDown fontSize={12} />
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
              <GridItem colSpan={{ base: 12, lg: 4 }}>
                <Box mb={6}>
                  <CustomCard title="Static Attributes">
                    <Grid templateColumns="repeat(12, 1fr)" gap={4} p={4}>
                      {METADATA.attributes.map(
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
                      {METADATA.attributes.map(
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
                {METADATA.attributes.find(
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
                        {METADATA.attributes.map(
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
                            <Text>Metadata Source Code</Text>
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
                          value={JSON.stringify(METADATA, null, 2)}
                          readOnly
                          minH={500}
                        />
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

const getSchema = async (schemacode: string) => {
  return {
    schemacode,
  };
};

const getMetadata = async (schemacode: string, tokenId: string) => {
  return {
    schemacode,
    tokenId,
  };
};

export const getServerSideProps = async (context: {
  params: { schemacode: any; tokenId: any };
}) => {
  const { schemacode, tokenId } = context.params;
  const schema = await getSchema(schemacode);
  const metadata = await getMetadata(schemacode, tokenId);
  return {
    props: {
      schema,
      metadata,
    },
  };
};

const STATS = [
  {
    title: "Chain",
    value: "Klaytn",
  },
];

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

{
  /* const METADATA = {
    nftData: {
        nft_schema_code: "sixnetwork.whalegate",
        token_id: "1",
        token_owner: "0x6A127EF7e02d3Cb83387f2c71db0EEA1e1d0D250",
        owner_address_type: "ORIGIN_ADDRESS",
        origin_image: "https://ipfs.whalegate.sixprotocol.com/ipfs/Qmax9JSauGbCYJ8ie3QvDhxutB6xdZHR7ATmE5y3HGbiVb/1.png",
        onchain_image: "https://ipfs.whalegate.sixprotocol.com/ipfs/Qmax9JSauGbCYJ8ie3QvDhxutB6xdZHR7ATmE5y3HGbiVb/1-t.png",
        token_uri: "",
        origin_attributes: [
            {
                name: "background",
                string_attribute_value: {
                    value: "Galaxy"
                },
                hidden_to_marketplace: false
            },
            {
                name: "tail",
                string_attribute_value: {
                    value: "White"
                },
                hidden_to_marketplace: false
            },
            {
                name: "creature",
                string_attribute_value: {
                    value: "Whale"
                },
                hidden_to_marketplace: false
            }
        ],
        onchain_attributes: [
            {
                name: "points",
                number_attribute_value: {
                    value: "400"
                },
                hidden_to_marketplace: false
            },
            {
                name: "missions_completed",
                number_attribute_value: {
                    value: "3"
                },
                hidden_to_marketplace: false
            },
            {
                name: "bonus_1",
                boolean_attribute_value: {
                    value: true
                },
                hidden_to_marketplace: false
            },
            {
                name: "bonus_2",
                boolean_attribute_value: {
                    value: true
                },
                hidden_to_marketplace: false
            },
            {
                name: "checked_in",
                boolean_attribute_value: {
                    value: true
                },
                hidden_to_marketplace: false
            },
            {
                name: "redeemed",
                boolean_attribute_value: {
                    value: true
                },
                hidden_to_marketplace: false
            },
            {
                name: "transformed",
                boolean_attribute_value: {
                    value: true
                },
                hidden_to_marketplace: false
            }
        ]
    }
} */
}

const METADATA = {
  image:
    "https://bk1nft.sixnetwork.io/ipfs/QmXPw4285ou45pWNbqF4KDgixRJsr1imCsk6j9sJ7KSKWC/1.jpg",
  name: "Buakaw1 x Amazing Thailand #0001",
  description:
    "This collection is a collaboration project between Buakaw Banchamek, a Muaythai living legend, and the Tourism Authority of Thailand. The NFT holder will earn extra privileges giving them access to a wide range of enhanced travel-oriented benefits and experiences under the theme of Amazing Thailand.",
  attributes: [
    {
      trait_type: "Background",
      is_origin: true,
      value: "Sukhothai - Wat Chang Lom",
    },
    {
      trait_type: "Influencer",
      is_origin: true,
      value: "Teerawat Yioyim",
    },
    {
      trait_type: "Body L",
      is_origin: false,
      value: "L Body Normal Gentleman",
    },
    {
      trait_type: "Body R",
      is_origin: false,
      value: "",
    },
    {
      trait_type: "Head L",
      is_origin: false,
      value: "L NON HEAD",
    },
    {
      trait_type: "Head R",
      is_origin: false,
      value: "",
    },
    {
      trait_type: "Clothes L",
      is_origin: false,
      value: "L Robe Golden",
    },
    {
      trait_type: "Clothes R",
      is_origin: false,
      value: "",
    },
    {
      trait_type: "Extra L",
      is_origin: false,
      value: "L NO EXTRA",
    },
    {
      trait_type: "Extra R",
      is_origin: false,
      value: "",
    },
    {
      trait_type: "Hand L",
      is_origin: false,
      value: "L Glove Black BV",
    },
    {
      trait_type: "Hand R",
      is_origin: false,
      value: "",
    },
    {
      trait_type: "Serum Applied",
      is_origin: false,
      value: "None",
    },
    {
      display_type: "number",
      trait_type: "Chaanburi Boutique Resort",
      max_value: "999",
      is_origin: false,
      value: 0,
    },
    {
      display_type: "number",
      trait_type: "Tohsang Heritage Ubon Hotel",
      max_value: "999",
      is_origin: false,
      value: 0,
    },
    {
      display_type: "number",
      trait_type: "RatiLanna Riverside Spa Resort, Chiang Mai",
      max_value: "999",
      is_origin: false,
      value: 0,
    },
    {
      display_type: "number",
      trait_type: "Belle Villa Resort, Chiang Mai",
      max_value: "999",
      is_origin: false,
      value: 0,
    },
    {
      display_type: "number",
      trait_type: "The Galla Hotel",
      max_value: "999",
      is_origin: false,
      value: 0,
    },
    {
      display_type: "number",
      trait_type: "Rimnaam Klangchan Hotel",
      max_value: "999",
      is_origin: false,
      value: 0,
    },
    {
      display_type: "number",
      trait_type: "Siam Triangle Hotel",
      max_value: "999",
      is_origin: false,
      value: 0,
    },
    {
      display_type: "number",
      trait_type: "Centra by Centara Cha Am Beach Resort Hua Hin",
      max_value: "999",
      is_origin: false,
      value: 0,
    },
    {
      display_type: "number",
      trait_type: "Centara Villas Samui",
      max_value: "999",
      is_origin: false,
      value: 0,
    },
    {
      display_type: "number",
      trait_type: "Grand Mercure Phuket Patong Resort & Villas",
      max_value: "999",
      is_origin: false,
      value: 0,
    },
    {
      display_type: "number",
      trait_type: "Siripanna Villa Resort & Spa Chiang Mai",
      max_value: "999",
      is_origin: false,
      value: 0,
    },
    {
      display_type: "number",
      trait_type: "Aonang Princeville Villa Resort & Spa",
      max_value: "999",
      is_origin: false,
      value: 0,
    },
    {
      display_type: "number",
      trait_type: "Paradise Koh Yao Resort",
      max_value: "999",
      is_origin: false,
      value: 0,
    },
    {
      display_type: "number",
      trait_type: "Treehouse Villas Koh Yao",
      max_value: "999",
      is_origin: false,
      value: 0,
    },
    {
      display_type: "number",
      trait_type: "Samui Resotel Beach Resort",
      max_value: "999",
      is_origin: false,
      value: 0,
    },
    {
      display_type: "number",
      trait_type: "Chaweng Cove Beach Resort",
      max_value: "999",
      is_origin: false,
      value: 0,
    },
    {
      display_type: "number",
      trait_type: "Ananda Lanta Resort",
      max_value: "999",
      is_origin: false,
      value: 0,
    },
    {
      display_type: "number",
      trait_type: "Ramada Plaza Chaofah Phuket",
      max_value: "999",
      is_origin: false,
      value: 0,
    },
    {
      display_type: "number",
      trait_type: "The Vijitt Resort Phuket",
      max_value: "999",
      is_origin: false,
      value: 0,
    },
    {
      display_type: "number",
      trait_type: "Orchidacea Resort",
      max_value: "999",
      is_origin: false,
      value: 0,
    },
    {
      display_type: "number",
      trait_type: "Vacation Village Phra Nang Inn",
      max_value: "999",
      is_origin: false,
      value: 0,
    },
    {
      display_type: "number",
      trait_type: "Vacation Village Phra Nang Lanta",
      max_value: "999",
      is_origin: false,
      value: 0,
    },
    {
      display_type: "number",
      trait_type: "WAREERAK HOT SPRING & WELLNESS",
      max_value: "999",
      is_origin: false,
      value: 0,
    },
    {
      display_type: "number",
      trait_type: "Siripanna Villa Resort & Spa Chiangmai",
      max_value: "999",
      is_origin: false,
      value: 0,
    },
    {
      display_type: "number",
      trait_type: "Merdelong Hotel",
      max_value: "999",
      is_origin: false,
      value: 0,
    },
    {
      display_type: "number",
      trait_type: "Panviman Chiang mai Spa Resort",
      max_value: "999",
      is_origin: false,
      value: 0,
    },
    {
      display_type: "number",
      trait_type: "Koh Yao Yai Village Beach Resort",
      max_value: "999",
      is_origin: false,
      value: 0,
    },
    {
      display_type: "number",
      trait_type: "The Memory At On On Hotel",
      max_value: "999",
      is_origin: false,
      value: 0,
    },
    {
      display_type: "number",
      trait_type: "Siam Bayshore Resort Pattaya",
      max_value: "999",
      is_origin: false,
      value: 0,
    },
    {
      display_type: "number",
      trait_type: "The Bayview Pattaya",
      max_value: "999",
      is_origin: false,
      value: 0,
    },
    {
      display_type: "number",
      trait_type: "Melati Beach Resort & Spa, Koh Samui",
      max_value: "999",
      is_origin: false,
      value: 0,
    },
    {
      display_type: "number",
      trait_type: "Chaweng Regent Beach Resort",
      max_value: "999",
      is_origin: false,
      value: 0,
    },
    {
      display_type: "number",
      trait_type: "The Elements Krabi Resort",
      max_value: "999",
      is_origin: false,
      value: 0,
    },
    {
      display_type: "number",
      trait_type: "KC Beach Club & Pool Villa",
      max_value: "999",
      is_origin: false,
      value: 0,
    },
    {
      display_type: "number",
      trait_type: "The B Ranong Trend Hotel",
      max_value: "999",
      is_origin: false,
      value: 0,
    },
    {
      display_type: "number",
      trait_type: "Blu Monkey Hub & Hotel Chanthaburi",
      max_value: "999",
      is_origin: false,
      value: 0,
    },
    {
      display_type: "number",
      trait_type: "Sukhothai Treasure Resort and Spa",
      max_value: "999",
      is_origin: false,
      value: 0,
    },
    {
      display_type: "number",
      trait_type: "Baan Imm Sook Resort",
      max_value: "999",
      is_origin: false,
      value: 0,
    },
    {
      display_type: "number",
      trait_type: "Diamond Cliff Resort & Spa",
      max_value: "999",
      is_origin: false,
      value: 0,
    },
    {
      display_type: "number",
      trait_type: "Sri Pakpra Boutique Resort Phatthalung",
      max_value: "999",
      is_origin: false,
      value: 0,
    },
    {
      display_type: "number",
      trait_type: "Tohsang Heritage Khongjiam",
      max_value: "999",
      is_origin: false,
      value: 0,
    },
    {
      display_type: "number",
      trait_type: "Lake House Phatthalung",
      max_value: "999",
      is_origin: false,
      value: 0,
    },
    {
      display_type: "number",
      trait_type: "Phu Chaisai Mountain Resort",
      max_value: "999",
      is_origin: false,
      value: 0,
    },
    {
      display_type: "number",
      trait_type: "The Mantrini Chiang Rai",
      max_value: "999",
      is_origin: false,
      value: 0,
    },
    {
      display_type: "number",
      trait_type: "Fortune River View Hotel Chiang Khong",
      max_value: "999",
      is_origin: false,
      value: 0,
    },
    {
      display_type: "number",
      trait_type: "DusitD2 Chiang Mai",
      max_value: "999",
      is_origin: false,
      value: 0,
    },
    {
      display_type: "number",
      trait_type: "The Phu Beach Hotel Krabi",
      max_value: "999",
      is_origin: false,
      value: 0,
    },
    {
      display_type: "number",
      trait_type: "The Zign Premium Villa",
      max_value: "999",
      is_origin: false,
      value: 0,
    },
    {
      display_type: "number",
      trait_type: "Z Through by The Zign",
      max_value: "999",
      is_origin: false,
      value: 0,
    },
    {
      display_type: "number",
      trait_type: "Kram Pattaya",
      max_value: "999",
      is_origin: false,
      value: 0,
    },
    {
      display_type: "number",
      trait_type: "Rueanrubkwan",
      max_value: "999",
      is_origin: false,
      value: 0,
    },
    {
      display_type: "number",
      trait_type: "New Travellodge Hotel",
      max_value: "999",
      is_origin: false,
      value: 0,
    },
    {
      display_type: "number",
      trait_type: "InterContinental Koh Samui Resort",
      max_value: "999",
      is_origin: false,
      value: 0,
    },
    {
      display_type: "number",
      trait_type: "Deevana Patong Resort & Spa",
      max_value: "999",
      is_origin: false,
      value: 0,
    },
    {
      display_type: "number",
      trait_type: "Deevana Plaza Phuket Patong",
      max_value: "999",
      is_origin: false,
      value: 0,
    },
    {
      display_type: "number",
      trait_type: "Ramada by Wyndham Phuket Deevana",
      max_value: "999",
      is_origin: false,
      value: 0,
    },
    {
      display_type: "number",
      trait_type: "Ayara Kamala Resort & Spa",
      max_value: "999",
      is_origin: false,
      value: 0,
    },
    {
      display_type: "number",
      trait_type: "Mera Mare Pattaya",
      max_value: "999",
      is_origin: false,
      value: 0,
    },
    {
      display_type: "number",
      trait_type: "Long beach Garden Hotel & Pavilions",
      max_value: "999",
      is_origin: false,
      value: 0,
    },
    {
      display_type: "number",
      trait_type: "Garden Seaview Resort",
      max_value: "999",
      is_origin: false,
      value: 0,
    },
    {
      display_type: "number",
      trait_type: "Bangsaen Heritage Hotel",
      max_value: "999",
      is_origin: false,
      value: 0,
    },
    {
      display_type: "number",
      trait_type: "Angsana Laguna Phuket",
      max_value: "999",
      is_origin: false,
      value: 0,
    },
    {
      display_type: "number",
      trait_type: "Laguna Holiday Club Phuket Resort",
      max_value: "999",
      is_origin: false,
      value: 0,
    },
    {
      display_type: "number",
      trait_type: "Worita Cove Hotel",
      max_value: "999",
      is_origin: false,
      value: 0,
    },
    {
      display_type: "number",
      trait_type: "Krabi Resort",
      max_value: "999",
      is_origin: false,
      value: 0,
    },
    {
      display_type: "number",
      trait_type: "Kata Palm Resort",
      max_value: "999",
      is_origin: false,
      value: 0,
    },
    {
      display_type: "number",
      trait_type: "Rawai Palm Beach Resort",
      max_value: "999",
      is_origin: false,
      value: 0,
    },
    {
      display_type: "number",
      trait_type: "Maikhao Palm Beach Resort",
      max_value: "999",
      is_origin: false,
      value: 0,
    },
    {
      display_type: "number",
      trait_type: "The Little Garden Resort",
      max_value: "999",
      is_origin: false,
      value: 0,
    },
    {
      display_type: "number",
      trait_type: "Supalai Pasak Resort Hotel & Spa, Saraburi",
      max_value: "999",
      is_origin: false,
      value: 0,
    },
  ],
  schema_code: "buakaw1.buakaw1xamazingthailand",
};
