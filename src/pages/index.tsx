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
  Spacer,
  TableContainer,
  Table,
  Tbody,
  Thead,
  Td,
  Tr,
  Badge,
} from "@chakra-ui/react";
import { Clickable } from "@/components/Clickable";
// ------------------------- NextJS -------------------------
import Head from "next/head";
import Image from "next/image";
// ------------------------- Styles -------------------------
import styles from "@/styles/Home.module.css";
import {
  FaDollarSign,
  FaMoneyBillWave,
  FaPiggyBank,
  FaPrint,
} from "react-icons/fa";
// ------------- Components ----------------
import NavBar from "@/components/NavBar";
import SearchBar from "@/components/SearchBar";
import CustomCard from "@/components/CustomCard";
import CustomTable from "@/components/CustomTable";
import { Footer } from "@/components/Footer";
import { getPool, getValidator, getValidators } from "@/service/staking";
import { Pool, Validator } from "@/types/Staking";
import {
  convertDecimalToPercent,
  convertUsixToSix,
  formatHex,
} from "@/utils/format";
import { getInflation } from "@/service/mint";
import { getSupply } from "@/service/bank";
import { Balance } from "@/types/Bank";
import {
  getBlocksResult,
  getLatestBlock,
  getLatestBlocks,
} from "@/service/block";
import { BlockchainResult, BlockMeta, BlockResult } from "@/types/Block";
import {
  getBlockRewardAmount,
  getBlockRewardValidator,
  getValidatorMoniker,
} from "@/utils/block";
// ------------------------- Helper Libs -------------------------
// import moment from "moment";
import { formatNumber } from "@/utils/format";
import { getPriceFromCoingecko } from "@/service/coingecko";
import { CoinGeckoPrice } from "@/types/Coingecko";

export default function Home({
  pool,
  inflation,
  supply,
  latestBlocks,
  blocksResult,
  validators,
  price,
}: {
  pool: Pool;
  inflation: string;
  supply: Balance;
  latestBlocks: BlockchainResult;
  blocksResult: BlockResult[];
  validators: Validator[];
  price: CoinGeckoPrice | null;
}) {
  const data = [
    {
      title: "PRICE",
      value: price && price.usd ? `$${formatNumber(price.usd)}` : "$0",
      badge: price ? `${formatNumber(price?.usd)}%` : "0%",
      icon: FaDollarSign,
    },
    {
      title: "STAKED",
      value: `${formatNumber(
        convertUsixToSix(parseInt(pool.bonded_tokens))
      )} SIX`,
      badge: `${convertDecimalToPercent(
        parseInt(pool.bonded_tokens) / parseInt(supply.amount)
      )}%`,
      icon: FaPiggyBank,
    },
    {
      title: "MARKET CAP",
      value: price ? `$${formatNumber(price?.usd)}` : "$0",
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
      <NavBar variant={"search"} />
      <Box
        // bgGradient={"linear(to-r, #3FC2FA, #3759F0)"}
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
              placeHolder="Search by Address / Txn Hash / Block / Token / SNS"
            />
          </Flex>
        </Container>
      </Box>
      <Box marginTop={-10}>
        <Container maxW="container.lg">
          <Flex direction="column" gap={3} p={3}>
            <Card size="lg">
              <CardBody p={0}>
                <Grid templateColumns="repeat(2, 1fr)">
                  {data.map((item, index) => (
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
                          <Flex direction={"row"} alignItems={"center"} gap={2}>
                            <Text
                              fontSize="2xl"
                              fontWeight="bold"
                              color={"darkest"}
                            >
                              {item.value}
                            </Text>
                            {item.badge && (
                              <Text fontSize="sm" color={"success"}>
                                {`(${item.badge})`}
                              </Text>
                            )}
                          </Flex>
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
                    {latestBlocks.block_metas.map((block, index) => (
                      <Tr key={index}>
                        <Td>
                          <Flex direction="column">
                            <Text>
                              <Clickable underline href="/">
                                {block.header.height}
                              </Clickable>
                            </Text>
                            <Text fontSize="xs" color="medium">
                              {new Date(block.header.time).toLocaleString()}
                            </Text>
                          </Flex>
                        </Td>
                        <Td>
                          <Flex direction="column">
                            <Text>
                              Fee Recipient{` `}
                              <Clickable
                                underline
                                href={`/address/${getBlockRewardValidator(
                                  block,
                                  blocksResult
                                )}`}
                              >
                                {validators.map((validator) => {
                                  if (
                                    validator.operator_address ===
                                    getBlockRewardValidator(block, blocksResult)
                                  ) {
                                    return validator.description.moniker;
                                  }
                                })}
                              </Clickable>
                            </Text>
                            <Text fontSize="xs" color="medium">
                              Txns{` `}
                              <Clickable href="/" underline>
                                {block.num_txs}
                              </Clickable>
                            </Text>
                          </Flex>
                        </Td>
                        <Td isNumeric>
                          <Badge>
                            Reward{" "}
                            <Clickable>
                              {getBlockRewardAmount(block, blocksResult)}
                            </Clickable>{" "}
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
      <Footer />
    </Flex>
  );
}

export const getServerSideProps = async () => {
  const pool = await getPool();
  const inflation = await getInflation();
  const supply = await getSupply("usix");
  const latestBlock = await getLatestBlock();
  const latestBlockHeight = latestBlock
    ? parseInt(latestBlock.block.header.height)
    : null;
  const minBlockHeight = latestBlockHeight ? latestBlockHeight - 10 : null;
  const latestBlocks =
    latestBlockHeight && minBlockHeight
      ? await getLatestBlocks(minBlockHeight, latestBlockHeight)
      : null;
  const blocksResult =
    latestBlockHeight && minBlockHeight
      ? await getBlocksResult(minBlockHeight, latestBlockHeight)
      : null;
  const validators = await getValidators();
  const price = await getPriceFromCoingecko("six-network");
  return {
    props: {
      pool,
      inflation,
      supply,
      latestBlocks,
      blocksResult,
      validators,
      price,
    },
  };
};
