// ------------------------- Chakra UI -------------------------
import {
  Box,
  Flex,
  Text,
  Container,
  Grid,
  GridItem,
  Divider,
  Table,
  TableContainer,
  Tbody,
  Tr,
  Td,
  Badge,
  Thead,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Button,
  Spacer,
  Tooltip,
} from "@chakra-ui/react";
// ------------------------- NextJS -------------------------
import Head from "next/head";
// ------------------------- Styles -------------------------
import {
  FaArrowRight,
  FaCopy,
  FaSortAmountDown,
  FaRegWindowClose,
  FaArrowLeft,
} from "react-icons/fa";
// ------------- Components ----------------
import NavBar from "@/components/NavBar";
import CustomCard from "@/components/CustomCard";
import { Clickable } from "@/components/Clickable";
import { LinkComponent } from "@/components/Chakralink";

import { formatHex } from "@/libs/utils/format";
import { validateAddress } from "@/libs/utils/validate";
import { useEffect, useState } from "react";
import { getValidator } from "@/service/staking";
import { Validator } from "@/types/Staking";
import { Balance } from "@/types/Bank";
// ------------------------- Helper Libs -------------------------
import moment from "moment";
import { getAccount } from "@/service/auth";
import { Account } from "@/types/Auth";
import { getBalance, getBalances } from "@/service/bank";
import {
  formatNumber,
  convertUsixToSix,
  convertAsixToSix,
  convertDecimalToPercent,
  formatCoinNumber,
  formatMethod,
} from "@/libs/utils/format";

import { getPriceFromCoingecko } from "@/service/coingecko";
import { CoinGeckoPrice } from "@/types/Coingecko";
import { getLastNTransactions, getTxsFromAddress } from "@/service/txs";
import { AccountTxs } from "@/types/Txs";
import { _LOG } from "@/libs/utils/logHelper";

interface Props {
  allTxs: any;
}

export default function Address({ allTxs }: Props) {
  const [isCopied, setIsCopied] = useState(false);
  const [totalValue, setTotalValue] = useState(0);
  let totalValueTmp = 0;

  const addValueToTotalValue = (value: number) => {
    totalValueTmp += value;
    return value;
  };

  useEffect(() => {
    setTotalValue(totalValueTmp);
  }, [totalValue, totalValueTmp]);

  return (
    <Flex minHeight={"100vh"} direction={"column"} bgColor="lightest">
      {/* testing eslint */}
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
              <GridItem colSpan={12}>
                <CustomCard>
                  <Tabs isLazy>
                    <TabList>
                      <Tab>Txns</Tab>
                      <Spacer />
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
                        </Flex>
                        <TableContainer>
                          <Table>
                            <Thead>
                              <Tr>
                                <Td textAlign={"center"}>
                                  <Text>Txhash</Text>
                                </Td>
                                <Td textAlign={"center"}>
                                  <Text>Method</Text>
                                </Td>
                                <Td textAlign={"center"}>
                                  <Text>Age</Text>
                                </Td>
                                <Td textAlign={"center"}>
                                  <Text>Block</Text>
                                </Td>
                                <Td textAlign={"center"}>
                                  <Text>From</Text>
                                </Td>
                                <Td textAlign={"center"}>
                                  <Text>To</Text>
                                </Td>
                                <Td textAlign={"center"}>
                                  <Text>Value</Text>
                                </Td>
                                <Td textAlign={"center"}>
                                  <Text>Gas Fee</Text>
                                </Td>
                              </Tr>
                            </Thead>
                            <Tbody>
                              {allTxs &&
                                allTxs.map((tx: any, index: any) => (
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
                                        <Clickable href={`/tx/${tx.txhash}`}>
                                          <Text
                                            style={{
                                              color: "#5C34A2",
                                              textDecoration: "none",
                                              fontFamily:
                                                "Nunito, Helvetica Neue, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol",
                                              fontSize: "12px",
                                            }}
                                          >
                                            {formatHex(tx.txhash)}
                                          </Text>
                                        </Clickable>
                                      </Flex>
                                    </Td>
                                    <Td>
                                      {formatMethod(
                                        tx.type,
                                        tx.decode_tx.toAddress
                                          ? tx.decode_tx.toAddress
                                          : tx.decode_tx.to_address,
                                        tx.decode_tx.fromAddress
                                          ? tx.decode_tx.fromAddress
                                          : tx.decode_tx.from_address,
                                        tx.decode_tx.action
                                      )}
                                    </Td>
                                    <Td textAlign={"center"}>
                                      <Text>
                                        {moment(tx.time_stamp).fromNow()}
                                      </Text>
                                    </Td>
                                    <Td textAlign={"center"}>
                                      <Clickable
                                        href={`/block/${tx.block_height}`}
                                      >
                                        <Text
                                          style={{
                                            color: "#5C34A2",
                                            textDecoration: "none",
                                            fontFamily:
                                              "Nunito, Helvetica Neue, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol",
                                            fontSize: "12px",
                                          }}
                                        >
                                          {tx.block_height}
                                        </Text>
                                      </Clickable>
                                    </Td>
                                    <Td textAlign={"center"}>
                                      {" "}
                                      {tx.decode_tx.toAddress ||
                                      tx.decode_tx.to_address ? (
                                        <Clickable
                                          href={`/address/${
                                            tx.decode_tx.fromAddress
                                              ? tx.decode_tx.fromAddress
                                              : tx.decode_tx.from_address
                                          }`}
                                        >
                                          <Text
                                            style={{
                                              color: "#5C34A2",
                                              textDecoration: "none",
                                              fontFamily:
                                                "Nunito, Helvetica Neue, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol",
                                              fontSize: "12px",
                                            }}
                                          >
                                            {formatHex(
                                              tx.decode_tx.fromAddress
                                                ? tx.decode_tx.fromAddress
                                                : tx.decode_tx.from_address
                                            )}
                                          </Text>
                                        </Clickable>
                                      ) : (
                                        <Clickable
                                          href={`/address/${
                                            tx.decode_tx.delegatorAddress
                                              ? tx.decode_tx.delegatorAddress
                                              : tx.decode_tx.delegator_address
                                          }`}
                                        >
                                          <Text
                                            style={{
                                              color: "#5C34A2",
                                              textDecoration: "none",
                                              fontFamily:
                                                "Nunito, Helvetica Neue, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol",
                                              fontSize: "12px",
                                            }}
                                          >
                                            {formatHex(
                                              tx.decode_tx?.delegatorAddress ??
                                                tx.decode_tx
                                                  ?.delegator_address ??
                                                tx.decode_tx?.fromAddress ??
                                                tx.decode_tx?.from_address
                                            )}
                                          </Text>
                                        </Clickable>
                                      )}
                                    </Td>
                                    <Td textAlign={"center"}>
                                      {tx.decode_tx.toAddress ||
                                      tx.decode_tx.to_address ? (
                                        <Clickable
                                          href={`/address/${
                                            tx.decode_tx.toAddress
                                              ? tx.decode_tx.toAddress
                                              : tx.decode_tx.to_address
                                          }`}
                                        >
                                          <Text
                                            style={{
                                              color: "#5C34A2",
                                              textDecoration: "none",
                                              fontFamily:
                                                "Nunito, Helvetica Neue, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol",
                                              fontSize: "12px",
                                            }}
                                          >
                                            {formatHex(
                                              tx.decode_tx.toAddress
                                                ? tx.decode_tx.toAddress
                                                : tx.decode_tx.to_address
                                            )}
                                          </Text>
                                        </Clickable>
                                      ) : (
                                        <Clickable
                                          href={`/address/${
                                            tx.decode_tx.validatorAddress
                                              ? tx.decode_tx.validatorAddress
                                              : tx.decode_tx.validator_address
                                          }`}
                                        >
                                          <Text
                                            style={{
                                              color: "#5C34A2",
                                              textDecoration: "none",
                                              fontFamily:
                                                "Nunito, Helvetica Neue, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol",
                                              fontSize: "12px",
                                            }}
                                          >
                                            {formatHex(
                                              tx.decode_tx?.validatorAddress ??
                                                tx.decode_tx
                                                  ?.validator_address ??
                                                tx.decode_tx?.toAddress ??
                                                tx.decode_tx?.to_address
                                            )}
                                          </Text>
                                        </Clickable>
                                      )}
                                    </Td>
                                    <Td textAlign={"center"}>
                                      {tx.decode_tx.amount && (
                                        <Text>
                                          {`${formatCoinNumber(
                                            tx.decode_tx.amount
                                          )} ${
                                            (tx.decode_tx.amount.denom ||
                                              tx.decode_tx.amount[0].denom) ==
                                            "usix"
                                              ? "SIX"
                                              : tx.decode_tx.amount.denom
                                          }`}
                                        </Text>
                                      )}
                                    </Td>
                                    <Td textAlign={"center"}>
                                      {tx.decode_tx.amount?.denom == "usix" ? (
                                        <Text>{`${formatNumber(
                                          convertUsixToSix(
                                            parseInt(tx.decode_tx.fee_amount)
                                          )
                                        )} SIX`}</Text>
                                      ) : (
                                        <Text>{`${formatNumber(
                                          convertAsixToSix(
                                            parseInt(tx.decode_tx.fee_amount)
                                          )
                                        )} SIX`}</Text>
                                      )}
                                    </Td>
                                  </Tr>
                                ))}
                            </Tbody>
                          </Table>
                        </TableContainer>
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

export const getServerSideProps = async (context: {
  params: { address: string };
  query: { page: string };
}) => {
  const allTxs = await getLastNTransactions(20);

  return {
    props: {
      allTxs,
    },
  };
};
