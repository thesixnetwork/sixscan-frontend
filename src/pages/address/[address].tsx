// ------------------------- Chakra UI -------------------------
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  Box,
  CardFooter,
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
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  PopoverAnchor,
  Input,
  Tooltip,
  Skeleton,
} from "@chakra-ui/react";

import {
  CheckCircleIcon,
  WarningTwoIcon,
  ArrowDownIcon,
  ArrowUpIcon,
} from "@chakra-ui/icons";

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
  FaCircle,
  FaCheck,
  FaSpinner,
  FaBalanceScale,
  FaRegStopCircle,
  FaRegWindowClose,
  FaCheckCircle,
} from "react-icons/fa";
// ------------- Components ----------------
import CustomCard from "@/components/CustomCard";
import { LinkComponent } from "@/components/Chakralink";
import { Clickable } from "@/components/Clickable";
import { formatHex, formatMethod } from "@/libs/utils/format";
import { useEffect, useState } from "react";
import {
  getDelegationsFromValidator,
  getValidator,
  getValidators,
} from "@/service/staking";
import { getAllTransactionByAddress } from "@/service/nftmngr/txs";
import { Delegation, Validator } from "@/types/Staking";
import { Balance, BalanceETH } from "@/types/Bank";
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
} from "@/libs/utils/format";

import { validateAddress } from "@/libs/utils/validate";
import { getPriceFromCoingecko } from "@/service/coingecko";
import { CoinGeckoPrice } from "@/types/Coingecko";
import { getTxsFromAddress } from "@/service/txs";
import { AccountTxs } from "@/types/Txs";
import { _LOG } from "@/libs/utils/logHelper";

// create a tokens map

const tokens: any = {
  usix: {
    name: "SIX Token",
    symbol: "SIX",
    logo: "/six.png",
    decimals: 6,
  },
};

interface Props {
  address: string;
  validator: Validator | null;
  account: Account | null;
  balance: Balance | null;
  balances: Balance[] | null;
  accountTxs: AccountTxs;
  delegations: Delegation[] | null;
  latestAction: any;
}

export default function Address({
  address,
  validator,
  account,
  balance,
  balances,
  accountTxs,
  delegations,
  latestAction,
}: Props) {
  const [isCopied, setIsCopied] = useState(false);
  const [totalValue, setTotalValue] = useState(0);
  let totalValueTmp = 0;
  const [filteredBalances, setFilteredBalances] = useState<Balance[] | null>(
    balances
  );

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

  const handleOnChange = (value: string) => {
    if (value === "") {
      setFilteredBalances(balances);
      return;
    }
    const filtered = balances?.filter((balance) => {
      return balance.denom.toLowerCase().includes(value.toLowerCase());
    });
    if (filtered) {
      setFilteredBalances(filtered);
    }
  };

  useEffect(() => {
    setTotalValue(totalValueTmp);
  }, []);

  const [price, setPrice] = useState<CoinGeckoPrice | null>(null);

  useEffect(() => {
    // async function fetchPrice() {
    const fetchPrice = async () => {
      setPrice(await getPriceFromCoingecko("six-network"));
    };

    fetchPrice();
  }, [totalValueTmp]);

  const addressMock = "0xdf2bae2fe6dae6e5bc5e30d016f74ea41c64d11e";
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => setIsOpen(!isOpen);
  _LOG("accountTxs", accountTxs);
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
                  {"Address"}
                </Text>
                <Text fontWeight="bold" color={address ? "medium" : "error"}>
                  {address ? address : "Invalid Address"}
                </Text>
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
                <Text color="error">Please provide a valid 6x address</Text>
              )}
            </Flex>
          </Container>
        </Box>
        <Box p={6}>
          <Container maxW="container.xl">
            <Grid templateColumns="repeat(12, 1fr)" gap={6}>
              <GridItem colSpan={{ base: 12, md: 6 }}>
                <CustomCard title="Overview">
                  <TableContainer>
                    <Table>
                      <Tbody>
                        <Tr>
                          <Td>
                            <Text>Balance:</Text>
                          </Td>
                          <Td>
                            <Flex direction="row" align="center" gap={2}>
                              <Text>
                                {balance && balance.amount !== null
                                  ? formatNumber(
                                      convertUsixToSix(parseInt(balance.amount))
                                    )
                                  : null}
                              </Text>
                              <Image src="/six.png" alt="coin" height={4} />
                            </Flex>
                          </Td>
                        </Tr>
                        <Tr>
                          <Td>
                            <Text>SIX Value:</Text>
                          </Td>
                          <Td>
                            {price && price !== null && balance !== null ? (
                              <Text fontSize={"sm"}>{`$${formatNumber(
                                convertUsixToSix(parseInt(balance.amount)) *
                                  price?.usd
                              )} (@ $${formatNumber(price?.usd)}/SIX)`}</Text>
                            ) : (
                              <Skeleton height="28px" width="150px" />
                            )}
                          </Td>
                        </Tr>
                        <Tr>
                          <Td>
                            <Text>Assets:</Text>
                          </Td>
                          <Td>
                            <Popover placement="bottom" strategy="fixed">
                              <PopoverTrigger>
                                <Flex
                                  px={3}
                                  py={1.5}
                                  rounded="md"
                                  border="1px solid"
                                  borderColor="light"
                                  direction="row"
                                  gap={1}
                                  justify="space-between"
                                  align="center"
                                  _hover={{
                                    cursor: "pointer",
                                    borderColor: "primary.500",
                                  }}
                                >
                                  <Flex direction="row" gap={2} align="center">
                                    <Text color={"dark"} fontSize="sm">
                                      ${formatNumber(totalValue)}
                                    </Text>
                                    <Badge
                                      rounded={"md"}
                                      variant="solid"
                                      colorScheme="primary"
                                    >
                                      {balances !== null ? balances.length : 0}
                                    </Badge>
                                  </Flex>
                                  <FaChevronDown fontSize={10} />
                                </Flex>
                              </PopoverTrigger>
                              <PopoverContent>
                                <PopoverArrow />
                                <PopoverHeader>
                                  <Input
                                    placeholder="Search"
                                    size="sm"
                                    onChange={(e) => {
                                      handleOnChange(e.target.value);
                                    }}
                                  />
                                </PopoverHeader>
                                <PopoverBody>
                                  {filteredBalances &&
                                  filteredBalances.length > 0 ? (
                                    filteredBalances.map((token, index) => (
                                      <Flex
                                        direction="row"
                                        p={2}
                                        align="center"
                                        justify={"space-between"}
                                        borderBottom={
                                          index === filteredBalances.length - 1
                                            ? "none"
                                            : "1px solid"
                                        }
                                        borderColor="light"
                                        key={token.denom}
                                      >
                                        <Flex
                                          direction="row"
                                          gap={2}
                                          align="center"
                                        >
                                          {/* <Image src={token.icon} alt="coin" height={4} /> */}
                                          <Flex direction="column">
                                            <Text
                                              fontSize={"sm"}
                                              color={"dark"}
                                            >
                                              {tokens.usix.name}{" "}
                                              {`(${token.denom})`}
                                            </Text>
                                            <Text
                                              fontSize={"xs"}
                                              color={"dark"}
                                            >
                                              {formatNumber(
                                                convertUsixToSix(
                                                  parseInt(token.amount)
                                                )
                                              )}{" "}
                                              {tokens.usix.symbol}
                                            </Text>
                                          </Flex>
                                        </Flex>
                                        <Flex direction="column">
                                          {price &&
                                            price !== null &&
                                            balance !== null && (
                                              <Text
                                                fontSize={"sm"}
                                                color={"dark"}
                                              >
                                                $
                                                {formatNumber(
                                                  addValueToTotalValue(
                                                    convertUsixToSix(
                                                      parseInt(balance.amount)
                                                    ) * price?.usd
                                                  )
                                                )}
                                              </Text>
                                            )}
                                          {price && price !== null && (
                                            <Text
                                              fontSize={"xs"}
                                              color={"dark"}
                                            >
                                              {`@ ~$${formatNumber(
                                                price?.usd
                                              )}`}
                                            </Text>
                                          )}
                                        </Flex>
                                      </Flex>
                                    ))
                                  ) : (
                                    <Text fontSize="sm" color="dark">
                                      No Assets
                                    </Text>
                                  )}
                                </PopoverBody>
                              </PopoverContent>
                            </Popover>
                          </Td>
                        </Tr>
                      </Tbody>
                    </Table>
                  </TableContainer>
                </CustomCard>
              </GridItem>
              <GridItem colSpan={{ base: 12, md: 6 }}>
                <CustomCard title="More Info">
                  <TableContainer>
                    <Table color="darkest">
                      <Tbody>
                        {validator && (
                          <Tr>
                            <Td>
                              <Text>Name:</Text>
                            </Td>
                            <Td>
                              <Badge>{validator.description.moniker}</Badge>
                            </Td>
                          </Tr>
                        )}
                        {validator && (
                          <Tr>
                            <Td>
                              <Text>Account Address:</Text>
                            </Td>
                            <Td>
                              <Clickable
                                href={`/address/${validator.account_address}`}
                                underline
                              >
                                <Text fontSize={"xs"}>
                                  {validator.account_address}
                                </Text>
                              </Clickable>
                            </Td>
                          </Tr>
                        )}
                        {validator && (
                          <Tr>
                            <Td>
                              <Text>Status:</Text>
                            </Td>
                            <Td>
                              <Badge
                                colorScheme={
                                  validator.status.split("BOND_STATUS_")[1] ==
                                  "BONDED"
                                    ? "green"
                                    : "red"
                                }
                              >
                                <Flex direction="row" align="center" gap={2}>
                                  {validator.status.split("BOND_STATUS_")[1] ==
                                  "BONDED" ? (
                                    <FaCheck />
                                  ) : validator.status.split(
                                      "BOND_STATUS_"
                                    )[1] == "UNBONDED" ? (
                                    <FaRegWindowClose />
                                  ) : (
                                    <FaSpinner />
                                  )}
                                  {validator.status.split("BOND_STATUS_")[1]}
                                </Flex>
                              </Badge>
                            </Td>
                          </Tr>
                        )}
                        {validator && (
                          <Tr>
                            <Td>
                              <Text>Tokens Staked:</Text>
                            </Td>
                            <Td>
                              {formatNumber(
                                parseInt(validator.delegator_shares) / 10 ** 6
                              )}{" "}
                              SIX
                            </Td>
                          </Tr>
                        )}
                        {validator && (
                          <Tr>
                            <Td>
                              <Text>License(s):</Text>
                            </Td>
                            <Td>
                              <Text>{`${validator.license_count}/${validator.max_license}`}</Text>
                            </Td>
                          </Tr>
                        )}
                        {validator && (
                          <Tr>
                            <Td>
                              <Text>Per license:</Text>
                            </Td>
                            <Td>
                              {formatNumber(
                                parseInt(validator.min_delegation) / 10 ** 6
                              )}{" "}
                              SIX
                            </Td>
                          </Tr>
                        )}
                        {validator && (
                          <Tr>
                            <Td>
                              <Text>Commission Rates:</Text>
                            </Td>
                            <Td>
                              <Flex direction="column" gap={1}>
                                <Flex direction="row" gap={2} align="center">
                                  <Text fontWeight="bold">Rate:</Text>
                                  <Text>
                                    {convertDecimalToPercent(
                                      parseInt(
                                        validator.commission.commission_rates
                                          .rate
                                      )
                                    )}
                                  </Text>
                                  <Text fontSize="xs" color="dark">{`(${moment(
                                    validator.commission.update_time
                                  ).fromNow()})`}</Text>
                                </Flex>
                                <Flex direction="row" gap={2} align="center">
                                  <Text fontWeight="bold">Max Rate:</Text>
                                  <Text>
                                    {convertDecimalToPercent(
                                      parseInt(
                                        validator.commission.commission_rates
                                          .max_rate
                                      )
                                    )}
                                  </Text>
                                </Flex>
                                <Flex direction="row" gap={2} align="center">
                                  <Text fontWeight="bold">
                                    Max Change Rate:
                                  </Text>
                                  <Text>
                                    {convertDecimalToPercent(
                                      parseInt(
                                        validator.commission.commission_rates
                                          .max_change_rate
                                      )
                                    )}
                                  </Text>
                                </Flex>
                              </Flex>
                            </Td>
                          </Tr>
                        )}
                      </Tbody>
                    </Table>
                  </TableContainer>
                </CustomCard>
              </GridItem>
              <GridItem colSpan={12}>
                <CustomCard>
                  <Tabs isLazy>
                    <TabList>
                      <Tab>Txns</Tab>
                      <Tab>Txns (Data Layer)</Tab>
                      {validator && <Tab>Delegators</Tab>}
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
                            {`Latest ${
                              (accountTxs && accountTxs.count) || 0
                            } from a total of `}
                            <Clickable underline href={`/txs/${address}`}>
                              {accountTxs ? accountTxs.total_count : "0"}
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
                                  <Text>From</Text>
                                </Td>
                                <Td></Td>
                                <Td>
                                  <Text>To</Text>
                                </Td>
                                <Td>
                                  <Text>Value</Text>
                                </Td>
                                <Td>
                                  <Text>Gas Fee</Text>
                                </Td>
                              </Tr>
                            </Thead>
                            <Tbody>
                              {accountTxs &&
                                accountTxs.txs &&
                                accountTxs.txs.map((tx: any, index) => (
                                  <Tr key={index}>
                                    <Td>
                                      <Flex
                                        direction="row"
                                        gap={1}
                                        align="center"
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
                                        address,
                                        tx.decode_tx.action
                                      )}
                                    </Td>
                                    <Td>
                                      <Text>
                                        {moment(tx.time_stamp).fromNow()}
                                      </Text>
                                    </Td>
                                    <Td>
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
                                    <Td>
                                      {tx.decode_tx.fromAddress ? (
                                        <Clickable
                                          href={`/address/${tx.decode_tx.fromAddress}`}
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
                                            )}
                                          </Text>
                                        </Clickable>
                                      ) : (
                                        <Clickable
                                          href={`/address/${
                                            tx.decode_tx.delegatorAddress
                                              ? tx.decode_tx.delegatorAddress
                                              : tx.decode_tx.fromAddress
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
                                              tx.decode_tx.delegatorAddress
                                                ? tx.decode_tx.delegatorAddress
                                                : tx.decode_tx.fromAddress
                                            )}
                                          </Text>
                                        </Clickable>
                                      )}
                                    </Td>
                                    <Td>
                                      {tx.decode_tx.toAddress === address ? (
                                        <Badge
                                          textAlign={"center"}
                                          width="100%"
                                          colorScheme="green"
                                        >
                                          IN
                                        </Badge>
                                      ) : tx.decode_tx.fromAddress ===
                                        address ? (
                                        <Badge
                                          textAlign={"center"}
                                          width="100%"
                                          colorScheme="orange"
                                        >
                                          OUT
                                        </Badge>
                                      ) : tx.decode_tx.delegatorAddress ===
                                        address ? (
                                        <Badge
                                          textAlign={"center"}
                                          width="100%"
                                          colorScheme="pink"
                                        >
                                          DELEGATE
                                        </Badge>
                                      ) : tx.decode_tx.validatorAddress ===
                                        address ? (
                                        <Badge
                                          textAlign={"center"}
                                          width="100%"
                                          colorScheme="orange"
                                        >
                                          IN
                                        </Badge>
                                      ) : null}
                                    </Td>
                                    <Td>
                                      {tx.decode_tx.toAddress ? (
                                        <Clickable
                                          href={`/address/${tx.decode_tx.toAddress}`}
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
                                            {formatHex(tx.decode_tx.toAddress)}
                                          </Text>
                                        </Clickable>
                                      ) : (
                                        <Clickable
                                          href={`/address/${
                                            tx.decode_tx.validatorAddress
                                              ? tx.decode_tx.validatorAddress
                                              : tx.decode_tx.toAddress
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
                                              tx.decode_tx.validatorAddress
                                                ? tx.decode_tx.validatorAddress
                                                : tx.decode_tx.toAddress
                                            )}
                                          </Text>
                                        </Clickable>
                                      )}
                                    </Td>
                                    <Td isNumeric>
                                      {tx.decode_tx.amount && (
                                        <Text>
                                          {`${formatCoinNumber(
                                            tx.decode_tx.amount
                                          )} ${
                                            (tx.decode_tx.amount.denom ||
                                              tx.decode_tx.amount[0].denom) ==
                                              "usix" || "asix"
                                              ? "SIX"
                                              : tx.decode_tx.amount.denom
                                              ? tx.decode_tx.amount.denom
                                              : tx.decode_tx.amount[0].denom
                                          }`}
                                        </Text>
                                      )}
                                    </Td>
                                    <Td>
                                      <Text>{`${formatNumber(
                                        convertUsixToSix(
                                          (parseInt(tx.decode_tx.gas_wanted) * 125)/100
                                        )
                                      )} SIX`}</Text>
                                    </Td>
                                  </Tr>
                                ))}
                            </Tbody>
                          </Table>
                          <CardFooter>
                            <LinkComponent href={`/txs/${address}`}>
                              <Text decoration={"underline"}>VIEW TXNS</Text>
                            </LinkComponent>
                          </CardFooter>
                        </TableContainer>
                      </TabPanel>

                      {/* ----- Mock data layer ---- */}
                      <TabPanel>
                        <Flex
                          direction="row"
                          gap={2}
                          align="center"
                          color={"dark"}
                        >
                          <FaSortAmountDown fontSize={12} />
                          <Text>
                            {`Latest ${
                              latestAction.txs.length || 0
                            } from a total of `}
                            <Clickable underline href={`/datachain/${address}`}>
                              {latestAction.totalCount
                                ? latestAction.totalCount
                                : "0"}
                            </Clickable>{" "}
                            transactions
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
                                  <Text>Token ID</Text>
                                </Td>
                                <Td textAlign={"center"}>
                                  <Text>Action</Text>
                                </Td>
                                <Td textAlign={"center"}>
                                  <Text>Age</Text>
                                </Td>
                                <Td textAlign={"center"}>
                                  <Text>Block</Text>
                                </Td>
                                <Td textAlign={"center"}>
                                  <Text>By</Text>
                                </Td>
                                <Td textAlign={"center"}>
                                  <Text>Gas Fee</Text>
                                </Td>
                                <Td textAlign={"center"}>
                                  <Text>Schema</Text>
                                </Td>
                              </Tr>
                            </Thead>
                            <Tbody>
                              {latestAction.txs.map((x: any, index: number) => (
                                <Tr key={index}>
                                  <Td textAlign={"center"}>
                                    <Clickable href={`/tx/${x.txhash}`}>
                                      <Text
                                        style={{
                                          color: "#5C34A2",
                                          textDecoration: "none",
                                          fontFamily:
                                            "Nunito, Helvetica Neue, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol",
                                          fontSize: "12px",
                                        }}
                                      >
                                        {formatHex(x.txhash)}
                                      </Text>
                                    </Clickable>
                                  </Td>
                                  <Td textAlign={"center"}>
                                    <Clickable
                                      href={`/schema/${
                                        x.decode_tx.nftSchemaCode
                                          ? x.decode_tx.nftSchemaCode
                                          : x.decode_tx.nft_schema_code
                                      }/${x.decode_tx.tokenId}`}
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
                                        {x.decode_tx.tokenId}
                                      </Text>
                                    </Clickable>
                                  </Td>
                                  <Td>
                                    {/* <Text> */}
                                    <Badge textAlign={"center"} width="100%">
                                      {x.type
                                        .split(".")
                                        [x.type.split(".").length - 1].slice(
                                          3
                                        ) === "PerformActionByAdmin"
                                        ? "Action"
                                        : x.type
                                            .split(".")
                                            [
                                              x.type.split(".").length - 1
                                            ].slice(3)}
                                    </Badge>
                                    {/* </Text> */}
                                  </Td>
                                  <Td textAlign={"center"}>
                                    <Text>
                                      {moment(x.time_stamp).fromNow()}
                                    </Text>
                                  </Td>
                                  <Td textAlign={"center"}>
                                    <Clickable
                                      href={`/block/${x.block_height}`}
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
                                        {x.block_height}
                                      </Text>
                                    </Clickable>
                                  </Td>
                                  <Td textAlign={"center"}>
                                    <Clickable
                                      href={`/address/${x.decode_tx.relate_addr[0]}`}
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
                                        {formatHex(x.decode_tx.relate_addr[0])}
                                      </Text>
                                    </Clickable>
                                  </Td>
                                  <Td textAlign={"center"}>
                                    <Text>{`${formatNumber(
                                      convertUsixToSix(
                                        parseInt(x.decode_tx.fee_amount)
                                      )
                                    )} SIX`}</Text>
                                  </Td>
                                  <Td textAlign={"center"}>
                                    <Clickable
                                      href={`/schema/${
                                        x.decode_tx.nftSchemaCode
                                          ? x.decode_tx.nftSchemaCode
                                          : x.decode_tx.nft_schema_code
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
                                          x.decode_tx.nftSchemaCode
                                            ? x.decode_tx.nftSchemaCode
                                            : x.decode_tx.nft_schema_code
                                        )}
                                      </Text>
                                    </Clickable>
                                  </Td>
                                </Tr>
                              ))}
                            </Tbody>
                          </Table>
                          <CardFooter>
                            <LinkComponent href={`/datachain/${address}`}>
                              <Text decoration={"underline"}>VIEW TXNS</Text>
                            </LinkComponent>
                          </CardFooter>
                        </TableContainer>
                      </TabPanel>
                      {validator && delegations && (
                        <TabPanel>
                          <Flex
                            direction="row"
                            gap={2}
                            align="center"
                            color={"dark"}
                          >
                            <FaSortAmountDown fontSize={12} />
                            <Text>
                              Total of{" "}
                              <Clickable underline href="/">
                                {delegations.length}
                              </Clickable>{" "}
                              Delegators
                            </Text>
                          </Flex>
                          <TableContainer>
                            <Table variant="simple">
                              <Thead>
                                <Tr>
                                  <Td>
                                    <Text>Address</Text>
                                  </Td>
                                  <Td>
                                    <Text>Shares</Text>
                                  </Td>
                                  <Td>
                                    <Text>Licenses</Text>
                                  </Td>
                                </Tr>
                              </Thead>
                              <Tbody>
                                {delegations.map((delegation, index) => (
                                  <Tr key={index}>
                                    <Td>
                                      <Clickable
                                        href={`/address/${delegation.delegation.delegator_address}`}
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
                                          {
                                            delegation.delegation
                                              .delegator_address
                                          }
                                        </Text>
                                      </Clickable>
                                    </Td>
                                    <Td>
                                      <Text>
                                        {formatNumber(
                                          convertUsixToSix(
                                            parseInt(
                                              delegation.delegation.shares
                                            )
                                          )
                                        )}{" "}
                                        SIX
                                      </Text>
                                    </Td>
                                    <Td>
                                      <Text>
                                        {parseInt(
                                          delegation.delegation.shares
                                        ) /
                                          parseInt(
                                            validator.delegation_increment
                                          )}
                                      </Text>
                                    </Td>
                                  </Tr>
                                ))}
                              </Tbody>
                            </Table>
                          </TableContainer>
                        </TabPanel>
                      )}
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
}) => {
  const { address } = context.params;
  const [
    validator,
    account,
    balance,
    balances,
    accountTxs,
    delegations,
    validators,
    latestAction,
  ] = await Promise.all([
    getValidator(address),
    getAccount(address),
    getBalance(address),
    getBalances(address),
    getTxsFromAddress(address, "1", "10"),
    getDelegationsFromValidator(address),
    getValidators(),
    getAllTransactionByAddress(address, "1", "10"),
  ]);
  const isAddressValid = await validateAddress(address);
  return {
    props: isAddressValid
      ? {
          address,
          validator,
          account,
          balance,
          balances,
          accountTxs,
          delegations,
          latestAction,
        }
      : {
          address: null,
          validator: null,
          account: null,
          balance: null,
          balances: null,
          accountTxs: null,
          delegations: null,
          latestAction: null,
        },
  };
};
