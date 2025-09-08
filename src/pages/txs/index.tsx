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
  Thead,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Spacer,
} from "@chakra-ui/react";
// ------------------------- NextJS -------------------------
import Head from "next/head";
// ------------------------- Styles -------------------------
import { FaSortAmountDown, FaRegWindowClose } from "react-icons/fa";
// ------------- Components ----------------
import CustomCard from "@/components/CustomCard";
import { Clickable } from "@/components/Clickable";

import { formatHex } from "@/libs/utils/format";
import { useEffect, useState } from "react";
// ------------------------- Helper Libs -------------------------
import moment from "moment";
import {
  formatNumber,
  convertUsixToSix,
  convertAsixToSix,
  formatCoinNumber,
  formatMethod,
} from "@/libs/utils/format";

import { getLastNTransactions } from "@/service/txs";
import { _LOG } from "@/libs/utils/logHelper";
import { isArray } from "lodash";

interface Props {
  allTxs: any;
}

export default function Address({ allTxs }: Props) {
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
                              {allTxs.txs &&
                                allTxs.txs.map((tx: any, index: any) => {
                                  const txTypes = tx.type;
                                  const decode_tx = tx.decode_tx || {};
                                  let feeAmount = "0";
                                  if (
                                    txTypes ===
                                    "/ethermint.evm.v1.MsgEthereumTx" || txTypes === "/precompile.tokenmngr.MsgUnWrapToken"
                                  ) {
                                    feeAmount = formatNumber(
                                      convertAsixToSix(
                                        parseInt(decode_tx.fee_amount)
                                      )
                                    );
                                  } else {
                                    feeAmount = formatNumber(
                                      convertUsixToSix(
                                        parseInt(decode_tx.fee_amount)
                                      )
                                    );
                                  }
                                  // fallback values
                                  const toAddress =
                                    decode_tx.toAddress ??
                                    decode_tx.to_address ??
                                    "";
                                  const fromAddress =
                                    decode_tx.fromAddress ??
                                    decode_tx.from_address ??
                                    "";
                                  const delegatorAddress =
                                    decode_tx.delegatorAddress ??
                                    decode_tx.delegator_address ??
                                    "";
                                  const validatorAddress =
                                    decode_tx.validatorAddress ??
                                    decode_tx.validator_address ??
                                    "";
                                  const action = decode_tx.action ?? "";
                                  const amount = Array.isArray(decode_tx.amount)
                                    ? decode_tx.amount[0]
                                    : decode_tx.amount;
                                  return (
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
                                          toAddress,
                                          fromAddress,
                                          action
                                        )}
                                      </Td>
                                      <Td textAlign={"center"}>
                                        <Text>
                                          {(() => {
                                            const ts = Number(tx.time_stamp);
                                            const ms =
                                              ts < 1000000000000
                                                ? ts * 1000
                                                : ts;
                                            return moment(ms).fromNow();
                                          })()}
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
                                        {toAddress ? (
                                          <Clickable
                                            href={`/address/${fromAddress}`}
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
                                              {formatHex(fromAddress)}
                                            </Text>
                                          </Clickable>
                                        ) : (
                                          <Clickable
                                            href={`/address/${delegatorAddress}`}
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
                                                delegatorAddress || fromAddress
                                              )}
                                            </Text>
                                          </Clickable>
                                        )}
                                      </Td>
                                      <Td textAlign={"center"}>
                                        {toAddress ? (
                                          <Clickable
                                            href={`/address/${toAddress}`}
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
                                              {formatHex(toAddress)}
                                            </Text>
                                          </Clickable>
                                        ) : (
                                          <Clickable
                                            href={`/address/${validatorAddress}`}
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
                                                validatorAddress || toAddress
                                              )}
                                            </Text>
                                          </Clickable>
                                        )}
                                      </Td>
                                      <Td textAlign={"center"}>
                                        {amount && (
                                          <Text>
                                            {`${formatCoinNumber(amount)} ${
                                              (amount.denom ||
                                                (Array.isArray(amount) &&
                                                  amount[0]?.denom)) === "usix"
                                                ? "SIX"
                                                : amount.denom
                                            }`}
                                          </Text>
                                        )}
                                      </Td>
                                      <Td textAlign={"center"}>
                                        <Text>{`${feeAmount} SIX`}</Text>
                                      </Td>
                                    </Tr>
                                  );
                                })}
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
  query: { page: string };
}) => {
  const page = context.query.page || "1";
  const pageLimit = 20;

  const allTxs = await getLastNTransactions(String(pageLimit), page);

  return {
    props: { allTxs },
  };
};
