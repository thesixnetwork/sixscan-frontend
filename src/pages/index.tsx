// ------------------------- Chakra UI -------------------------
import { useEffect, useState } from "react";
import Image from "next/image";
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
  Spacer,
  TableContainer,
  Table,
  Tbody,
  Thead,
  Td,
  Tr,
  Badge,
  useDisclosure,
  Skeleton,
  useMediaQuery,
} from "@chakra-ui/react";
import { Clickable } from "@/components/Clickable";
// ------------------------- NextJS -------------------------
import Head from "next/head";
// ------------------------- Styles -------------------------
import {
  FaDollarSign,
  FaMoneyBillWave,
  FaPiggyBank,
  FaPrint,
} from "react-icons/fa";
// ------------- Components ----------------
import SearchBar from "@/components/SearchBar";
import CustomCard from "@/components/CustomCard";
import { getPool, getValidator, getValidators } from "@/service/staking";
import { getTHB } from "@/service/priceUSD";
import { Pool, Validator } from "@/types/Staking";
import {
  convertDecimalToPercent,
  convertUsixToSix,
  formatNumberAndRoundUp,
} from "@/libs/utils/format";
import { getInflation } from "@/service/mint";
import { getSupply, getSupplySixNet } from "@/service/bank";
import { Balance } from "@/types/Bank";
import {
  getBlocksResult,
  getLatestBlock,
  getLatestBlocks,
} from "@/service/block";
import { Block, BlockchainResult, BlockMeta, BlockResult } from "@/types/Block";
import {
  getBlockRewardAmount,
  getBlockRewardValidator,
} from "@/libs/block/block";
// ------------------------- Helper Libs -------------------------
import { formatNumber } from "@/libs/utils/format";
import { getPriceFromCoingecko } from "@/service/coingecko";
import { CoinGeckoPrice } from "@/types/Coingecko";

interface Props {
  modalstate: { isOpen: boolean; onOpen: () => void; onClose: () => void };
  pool: Pool;
  inflation: string;
  supply: Balance;
  latestBlock: Block;
  latestBlocks: BlockchainResult;
  blocksResult: BlockResult[];
  validators: Validator[];
  priceTHB: number;
  supplySixNet: string;
}

export default function Home({
  modalstate,
  pool,
  inflation,
  supply,
  latestBlock,
  latestBlocks,
  blocksResult,
  validators,
  priceTHB,
  supplySixNet,
}: Props) {
  const [price, setPrice] = useState<CoinGeckoPrice | null>(null);
  const [priceSIXUSD, setPriceSIXUSD] = useState<number>(12673103.29);
  const [isMobile] = useMediaQuery("(max-width: 768px)");

  const [latestBlockState, setLatestBlock] = useState<Block>(latestBlock);
  const [latestBlocksState, setLatestBlocks] =
    useState<BlockchainResult>(latestBlocks);
  const [blocksResultState, setBlocksResult] =
    useState<BlockResult[]>(blocksResult);
  const [validatorsState, setValidators] = useState<Validator[]>(validators);

  // fetch last block interval
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`/api/rpcLatestBlock`);
      const latestBlock = await response.json();
      setLatestBlock(latestBlock ? latestBlock : latestBlockState);
    };
    // Fetch data initially
    fetchData();
    const intervalId = setInterval(fetchData, 6000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const latestBlock = latestBlockState;
      const latestBlockHeight = latestBlockState
        ? parseInt(latestBlock?.block?.header?.height) ?? null
        : null;
      const minBlockHeight = latestBlockHeight ? latestBlockHeight - 20 : null;
      // const [latestBlocks, blocksResult, validators] = await Promise.all([
      //   getLatestBlocks(minBlockHeight, latestBlockHeight),
      //   getBlocksResult(minBlockHeight, latestBlockHeight),
      //   getValidators(),
      // ]);

      const latestBlocksResponse = fetch(
        `/api/rpcLatestBlocks?minBlockHeight=${minBlockHeight}&maxBlockHeight=${latestBlockHeight}`
      );
      const blocksResultResponse = fetch(
        `/api/rpcBlocksResult?minBlockHeight=${minBlockHeight}&maxBlockHeight=${latestBlockHeight}`
      );
      const validatorsResponse = fetch("/api/validators");

      const [latestBlocks, blocksResult, validators] = await Promise.all([
        latestBlocksResponse,
        blocksResultResponse,
        validatorsResponse,
      ]).then((responses) =>
        Promise.all(responses.map((response) => response.json()))
      );

      setLatestBlocks(latestBlocks ? latestBlocks : latestBlocksState);
      setBlocksResult(blocksResult ? blocksResult : blocksResultState);
      setValidators(validators ? validators : validatorsState);
    };
    fetchData();
  }, [latestBlockState]);

  useEffect(() => {
    // async function fetchPrice() {
    const fetchPrice = async () => {
      const priceGecko: CoinGeckoPrice | null = await getPriceFromCoingecko(
        "six-network"
      );
      // const suppySixTotal = await convertUsixToSix(parseInt(supplySixNet));
      setPrice(priceGecko);
      const isSupplySixNet = Number(supplySixNet).toFixed(2);
      setPriceSIXUSD(Number(isSupplySixNet));
    };

    fetchPrice();
  }, []);

  const stats = [
    {
      title: "PRICE",
      value: price && price.usd ? `$${formatNumber(price.usd, 8)}` : "",
      badge: price ? `${formatNumber(price?.usd_24h_change)}%` : "",
      icon: FaDollarSign,
    },
    {
      title: "STAKED",
      value: `${formatNumberAndRoundUp(
        convertUsixToSix(parseInt(pool.bonded_tokens))
      )} SIX`,
      badge: `${convertDecimalToPercent(
        parseInt(pool.bonded_tokens) / parseInt(supply.amount)
      )}%`,
      icon: FaPiggyBank,
    },
    {
      title: "MARKET CAP",
      value: price ? `$${formatNumber(price?.usd_market_cap)}` : "",
      icon: FaMoneyBillWave,
    },
    {
      title: "INFLATION",
      value: `${convertDecimalToPercent(parseFloat(inflation))}%`,
      icon: FaPrint,
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
      <Box
        bgImage={"/banner.png"}
        bgSize={"cover"}
        bgPosition={"center"}
        paddingTop={10}
        paddingBottom={20}
      >
        <Container maxW="container.lg">
          <Flex direction="column" gap={3} p={3}>
            <Text
              fontSize="xl"
              fontWeight="bold"
              color={"white"}
              textShadow="0px 4px 4px rgba(0, 0, 0, 0.5)"
            >
              SIX Protocol Blockchain Explorer
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
        <Container maxW="container.lg">
          <Flex direction="column" gap={3} p={3}>
            {(process.env.NEXT_PUBLIC_CHAIN_NAME?.toLowerCase() == "mainnet" ||
              process.env.NEXT_PUBLIC_CHAIN_NAME?.toLowerCase() ==
                "sixnet") && (
              <Box
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginBottom: "20px",
                }}
              >
                <Flex
                  style={{
                    background:
                      "linear-gradient(90deg, #538CEE 0%, #8B60EE 100%)",
                    // width: {isMobile ? "90%" : "635px"},
                    // height: {isMobile ? "auto" : "196px"},
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontSize: "24px",
                    borderRadius: "20px",
                    padding: "20px",
                  }}
                  w={isMobile ? "100%" : "635px"}
                  h={isMobile ? "auto" : "196px"}
                >
                  {/* Top row: Title */}
                  <Box
                    style={{
                      color: "rgba(204, 227, 255, 1)",
                      fontFamily:
                        "Nunito, Helvetica Neue, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol",
                      fontWeight: 457,
                      // fontSize: "22px",
                      lineHeight: "100%",
                      letterSpacing: "0%",
                      fontVariant: "small-caps",
                      textAlign: "center",
                      marginBottom: "10px",
                    }}
                    fontSize={isMobile ? "16px" : "22px"}
                  >
                    TOTAL ASSET VALUE ON SIX PROTOCOL
                  </Box>

                  {/* Bottom row: Image + Value */}
                  <Flex
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginTop: "10px",
                    }}
                    // flexDirection={isMobile ? "column" : "row"}
                  >
                    <Image
                      src="/up2.png"
                      alt="coin"
                      height={isMobile ? 36 : 56}
                      width={isMobile ? 34 : 54}
                      style={{ marginRight: isMobile ? "6px" : "15px" }}
                    />
                    <Box
                      style={{
                        color: "rgba(255, 255, 255, 1)",
                        fontFamily:
                          "Nunito, Helvetica Neue, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol",
                        fontWeight: 700,
                        // fontSize: "64px",
                        lineHeight: "100%",
                        letterSpacing: "0%",
                        fontVariant: "small-caps",
                      }}
                      fontSize={isMobile ? "40px" : "64px"}
                    >
                      ${formatNumber(priceSIXUSD ? priceSIXUSD : 0, 2)}
                    </Box>
                  </Flex>
                </Flex>
              </Box>
            )}

            <Card size="lg">
              <CardBody p={0}>
                <Grid templateColumns="repeat(2, 1fr)">
                  {stats.map((item, index) => (
                    <GridItem
                      key={index}
                      colSpan={{ base: 2, lg: 1 }}
                      borderBottom={"1px solid"}
                      borderRight={index - (1 % 2) !== 0 ? "1px solid" : "none"}
                      borderColor={"light"}
                    >
                      <Flex
                        direction={"row"}
                        p={4}
                        alignItems={"center"}
                        gap={3}
                      >
                        <Icon as={item.icon} w={6} h={6} color={"dark"} />
                        <Flex direction={"column"}>
                          <Text fontSize="sm" color={"medium"}>
                            {item.title}
                          </Text>
                          {item.value ? (
                            <Flex
                              direction={"row"}
                              alignItems={"center"}
                              gap={2}
                            >
                              <Text
                                fontSize="2xl"
                                fontWeight="bold"
                                color={"darkest"}
                              >
                                {item.value}
                              </Text>
                              {item.badge && (
                                <Text
                                  fontSize="sm"
                                  color={
                                    item.badge.includes("-")
                                      ? "error"
                                      : "success"
                                  }
                                >
                                  {`(${item.badge})`}
                                </Text>
                              )}
                            </Flex>
                          ) : (
                            <Skeleton height="28px" width="150px" />
                          )}
                        </Flex>
                      </Flex>
                    </GridItem>
                  ))}
                </Grid>
              </CardBody>
            </Card>
            <CustomCard
              title={"Latest Blocks"}
              footer={"VIEW BLOCKS"}
              href={"/blocks"}
            >
              <TableContainer>
                <Table variant="simple">
                  <Tbody>
                    {latestBlocksState?.block_metas.map((block, index) => (
                      <Tr key={index}>
                        <Td>
                          <Flex direction="column">
                            <Clickable href={`/block/${block.header.height}`}>
                              <Text
                                style={{
                                  color: "#5C34A2",
                                  textDecoration: "none",
                                  fontFamily:
                                    "Nunito, Helvetica Neue, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol",
                                  fontSize: "15px",
                                }}
                              >
                                {block.header.height}
                              </Text>
                            </Clickable>
                            <Text fontSize="xs" color="medium">
                              {new Date(block.header.time).toLocaleString()}
                            </Text>
                          </Flex>
                        </Td>
                        <Td>
                          <Flex direction="column">
                            <Flex direction="row">
                              Proposer{` `}
                              <Clickable
                                href={`/address/${getBlockRewardValidator(
                                  block,
                                  blocksResultState
                                )}`}
                              >
                                <Text
                                  style={{
                                    color: "#5C34A2",
                                    textDecoration: "none",
                                    fontFamily:
                                      "Nunito, Helvetica Neue, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol",
                                    fontSize: "14px",
                                    marginLeft: "6px",
                                  }}
                                >
                                  {validatorsState.map((validator) => {
                                    if (
                                      validator.operator_address ===
                                      getBlockRewardValidator(
                                        block,
                                        blocksResultState
                                      )
                                    ) {
                                      return validator.description.moniker;
                                    }
                                  })}
                                </Text>
                              </Clickable>
                            </Flex>
                            <Text fontSize="xs" color="medium">
                              Txns{` `}
                              <Clickable
                                href={`/block/${block.header.height}`}
                                underline={false}
                              >
                                {block.num_txs}
                              </Clickable>
                            </Text>
                          </Flex>
                        </Td>
                        <Td isNumeric>
                          <Badge display={"inline-flex"}>
                            Reward{" "}
                            <Text
                              style={{
                                color: "#5C34A2",
                                textDecoration: "none",
                                fontFamily:
                                  "Nunito, Helvetica Neue, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol",
                                fontSize: "14px",
                                marginLeft: "6px",
                                marginRight: "6px",
                              }}
                            >
                              {getBlockRewardAmount(block, blocksResultState)}
                            </Text>{" "}
                            SIX
                          </Badge>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </CustomCard>
          </Flex>
        </Container>
      </Box>
      <Spacer />
    </Flex>
  );
}

export const getServerSideProps = async () => {
  const [
    pool,
    inflation,
    supply,
    latestBlock,
    validators,
    priceTHB,
    supplySixNet,
  ] = await Promise.all([
    getPool(),
    getInflation(),
    getSupply("usix"),
    getLatestBlock(),
    getValidators(),
    getTHB(),
    getSupplySixNet(),
  ]);

  const latestBlockHeight = latestBlock
    ? parseInt(latestBlock?.block?.header?.height)
    : null;
  const minBlockHeight = latestBlockHeight ? latestBlockHeight - 10 : null;

  const [latestBlocks, blocksResult] =
    latestBlockHeight && minBlockHeight
      ? await Promise.all([
          getLatestBlocks(minBlockHeight, latestBlockHeight),
          getBlocksResult(minBlockHeight, latestBlockHeight),
        ])
      : [null, null];

  return {
    props: {
      pool,
      inflation,
      supply,
      latestBlock,
      latestBlocks,
      blocksResult,
      validators,
      priceTHB,
      supplySixNet,
    },
  };
};
