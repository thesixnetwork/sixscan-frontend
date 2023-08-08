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

import { formatHex } from "@/utils/format";
import { validateAddress } from "@/utils/validate";
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
} from "@/utils/format";

import { getPriceFromCoingecko } from "@/service/coingecko";
import { CoinGeckoPrice } from "@/types/Coingecko";
import { getTxsFromAddress } from "@/service/txs";
import { AccountTxs } from "@/types/Txs";
import { _LOG } from "@/utils/log_helper";

interface Props {
  address: string;
  validator: Validator | null;
  account: Account | null;
  accountTxs: AccountTxs;
}

export default function Address({
  address,
  validator,
  account,
  accountTxs,
}: Props) {
  const [isCopied, setIsCopied] = useState(false);
  const [totalValue, setTotalValue] = useState(0);
  let totalValueTmp = 0;

  const handleCopyClick = () => {
    navigator.clipboard.writeText(address);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1000);
  };

  const addValueToTotalValue = (value: number) => {
    totalValueTmp += value;
    return value;
  };

  useEffect(() => {
    setTotalValue(totalValueTmp);
  }, [totalValue, totalValueTmp]);

  _LOG(accountTxs)

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
        <Box>
          <Container maxW="container.xl">
            <Flex direction="column" gap={3} p={3}>
              <Flex direction="row" align="center" gap={4}>
                <Text fontSize="xl" fontWeight="bold" color={"dark"}>
                  Txns for:
                </Text>
                <Text fontWeight="bold" color={address ? "medium" : "error"}>
                  {address ? address : "Invalid Address"}
                </Text>
                {address && (
                  <Tooltip label={isCopied ? "Copied" : "Copy"} placement="top">
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
                )}
              </Flex>
              <Flex direction="row" align="center" gap={4}>
                {validator && <Badge>Validators</Badge>}
                {account && <Badge>{account["@type"].split(".")[3]}</Badge>}
                {validator && validator.jailed && (
                  <Badge colorScheme={"red"}>Jailed</Badge>
                )}
              </Flex>
              <Divider />
              {!address && (
                <Text color="error">Please provide a valid address</Text>
              )}
            </Flex>
          </Container>
        </Box>
        <Box p={6}>
          <Container maxW="container.xl">
            <Grid templateColumns="repeat(12, 1fr)" gap={6}>
              {address && (
                <GridItem colSpan={12}>
                  <CustomCard>
                    <Tabs isLazy>
                      <TabList>
                        <Tab>Txns</Tab>
                        <Spacer />
                        {accountTxs && accountTxs.page_total > 1 && (
                          <Flex direction="row" gap={2} align="center" px="2">
                            <Button
                              variant={"solid"}
                              size="xs"
                              href={`/txs/${address}?page=1`}
                              as={LinkComponent}
                              isDisabled={
                                parseInt(accountTxs.page_number) === 1
                              }
                            >
                              First
                            </Button>
                            <Button
                              size="xs"
                              href={`/txs/${address}?page=1`}
                              as={LinkComponent}
                              isDisabled={
                                parseInt(accountTxs.page_number) === 1
                              }
                            >
                              <FaArrowLeft fontSize={12} />
                            </Button>
                            <Text fontSize="xs">
                              {`Page ${accountTxs.page_number} of ${accountTxs.page_total}`}
                            </Text>
                            <Button
                              size="xs"
                              href={`/txs/${address}?page=${parseInt(accountTxs.page_number) + 1
                                }`}
                              as={LinkComponent}
                              isDisabled={
                                parseInt(accountTxs.page_number) ===
                                accountTxs.page_total
                              }
                            >
                              <FaArrowRight fontSize={12} />
                            </Button>
                            <Button
                              size="xs"
                              href={`/txs/${address}?page=${accountTxs.page_total}`}
                              as={LinkComponent}
                              isDisabled={
                                parseInt(accountTxs.page_number) ===
                                accountTxs.page_total
                              }
                            >
                              Last
                            </Button>
                          </Flex>
                        )}
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
                              {`A total of ${accountTxs ? accountTxs.total_count : "0"
                                } txns found.`}
                            </Text>
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
                                {accountTxs &&
                                  accountTxs.txs.map((tx, index) => (
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
                                          <Clickable
                                            href={`/tx/${tx.txhash}`}
                                          >
                                            <Text style={{
                                              color: "#5C34A2",
                                              textDecoration: "none",
                                              fontFamily: "Nunito, Helvetica Neue, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol",
                                              fontSize: "12px"
                                            }}>
                                              {formatHex(tx.txhash)}
                                            </Text>

                                          </Clickable>
                                        </Flex>
                                      </Td>
                                      <Td>
                                        <Text justifyContent={"center"}>
                                          <Badge textAlign={"center"} width="100%">
                                            {
                                              tx.type
                                                .split(".")
                                              [
                                                tx.type.split(".").length - 1
                                              ].slice(3) === "Send" ?
                                                tx.decode_tx.toAddress === address ? "Receiver" : "Send"
                                                :
                                                tx.type
                                                  .split(".")
                                                [
                                                  tx.type.split(".").length - 1
                                                ].slice(3) === "PerformActionByAdmin" ? "Action" : 
                                                tx.type
                                                  .split(".")
                                                [
                                                  tx.type.split(".").length - 1
                                                ].slice(3)
                                            }
                                          </Badge>
                                        </Text>
                                      </Td>
                                      <Td textAlign={"center"}>
                                        <Text>
                                          {moment(tx.time_stamp).fromNow()}
                                        </Text>
                                      </Td>
                                      <Td textAlign={"center"}>
                                        <Clickable href={`/block/${tx.block_height}`}>
                                          <Text style={{
                                            color: "#5C34A2",
                                            textDecoration: "none",
                                            fontFamily: "Nunito, Helvetica Neue, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol",
                                            fontSize: "12px"
                                          }}>
                                            {tx.block_height}
                                          </Text>
                                        </Clickable>
                                      </Td>
                                      <Td textAlign={"center"}>
                                        {tx.decode_tx.toAddress && (
                                          <Clickable
                                            href={`/address/${tx.decode_tx.fromAddress}`}
                                          >
                                            <Text style={{
                                              color: "#5C34A2",
                                              textDecoration: "none",
                                              fontFamily: "Nunito, Helvetica Neue, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol",
                                              fontSize: "12px"
                                            }}>
                                              {formatHex(
                                                tx.decode_tx.fromAddress
                                              )}
                                            </Text>
                                          </Clickable>
                                        )}
                                      </Td>
                                      <Td textAlign={"center"}>
                                        {tx.decode_tx.toAddress && (
                                          <Clickable
                                            href={`/address/${tx.decode_tx.toAddress}`}
                                          >
                                            <Text style={{
                                              color: "#5C34A2",
                                              textDecoration: "none",
                                              fontFamily: "Nunito, Helvetica Neue, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol",
                                              fontSize: "12px"
                                            }}>
                                              {formatHex(
                                                tx.decode_tx.toAddress
                                              )}
                                            </Text>
                                          </Clickable>
                                        )}
                                      </Td>
                                      <Td textAlign={"center"}>
                                        {tx.decode_tx.amount && (
                                            <Text>{`${
                                              formatCoinNumber(tx.decode_tx.amount)
                                            } SIX`  }
                                            </Text>
                                          )}
                                      </Td>
                                      <Td textAlign={"center"}>
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
                      </TabPanels>
                    </Tabs>
                  </CustomCard>
                </GridItem>
              )}
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
  const { address } = context.params;
  const { page } = context.query;
  const isAddressValid = await validateAddress(address);
  if (!isAddressValid) {
    return {
      props: {
        address: null,
        validator: null,
        account: null,
        txs: null,
      },
    };
  }
  const [validator, account, accountTxs] = await Promise.all([
    getValidator(address),
    getAccount(address),
    getTxsFromAddress(address, page ? page : "1", "20"),
  ]);
  return {
    props: {
      address,
      validator,
      account,
      accountTxs,
    },
  };
};
