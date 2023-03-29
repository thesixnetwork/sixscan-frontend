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
  FaChevronDown,
  FaCopy,
  FaExpand,
  FaScroll,
  FaSortAmountDown,
} from "react-icons/fa";
// ------------- Components ----------------
import NavBar from "@/components/NavBar";
import CustomCard from "@/components/CustomCard";

import { Clickable } from "@/components/Clickable";
import { formatHex } from "@/utils/format";
import { formatTraitValue } from "@/utils/format";
import AttributeBox from "@/components/AttributeBox";
import { getMetadata, getSchema } from "@/service/nftmngr";
import { Metadata } from "@/types/Opensea";
import { NFTSchema } from "@/types/Nftmngr";
import { useState } from "react";
import { useRouter } from "next/router";

export default function Schema({
  metadata,
  schema,
}: {
  metadata: Metadata;
  schema: NFTSchema;
}) {
  const STATS = [
    {
      title: "Chain",
      value: schema.origin_data?.origin_chain,
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
              Block does not exist
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
                      {metadata.attributes.map(
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
                      {metadata.attributes.map(
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
                {metadata.attributes.find(
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
                        {metadata.attributes.map(
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
                      {/* <Tab>Latest Actions</Tab> */}
                      <Tab>Metadata</Tab>
                    </TabList>
                    <TabPanels>
                      {/* <TabPanel>
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
                      </TabPanel> */}
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
                        <Textarea
                          value={JSON.stringify(metadata, null, 2)}
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
    </Flex>
  );
}

export const getServerSideProps = async ({
  params: { schemacode, tokenId },
}: {
  params: { schemacode: any; tokenId: any };
}) => {
  const [metadata, schema] = await Promise.all([
    getMetadata(schemacode, tokenId),
    getSchema(schemacode),
  ]);
  return {
    props: { metadata, schema },
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
