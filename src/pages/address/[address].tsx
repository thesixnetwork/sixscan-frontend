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
  FaCircle,
  FaCheck,
  FaSpinner,
  FaBalanceScale,
  FaRegStopCircle,
  FaRegWindowClose,
  FaCheckCircle,
} from "react-icons/fa";
// ------------- Components ----------------
import NavBar from "@/components/NavBar";
import SearchBar from "@/components/SearchBar";
import CustomCard from "@/components/CustomCard";
import CustomTable from "@/components/CustomTable";
import { Footer } from "@/components/Footer";
import { Clickable } from "@/components/Clickable";
import { formatHex } from "@/utils/format";
import { useEffect, useState } from "react";
import { getDelegationsFromValidator, getValidator } from "@/service/staking";
import { Delegation, Validator } from "@/types/Staking";
import { Balance } from "@/types/Bank";
// ------------------------- Helper Libs -------------------------
import moment from "moment";
import { getAccount } from "@/service/auth";
import { Account } from "@/types/Auth";
import { getBalance, getBalances } from "@/service/bank";
import {
  formatNumber,
  convertUsixToSix,
  convertDecimalToPercent,
} from "@/utils/format";

import { validateAddress } from "@/utils/validate";

import { pubkeyToAddress } from "@cosmjs/tendermint-rpc";
import { anyToSinglePubkey } from "@cosmjs/proto-signing";
import { fromBase64, toHex } from "@cosmjs/encoding";
import { getPriceFromCoingecko } from "@/service/coingecko";
import { CoinGeckoPrice } from "@/types/Coingecko";
import { getTxsFromAddress } from "@/service/txs";
import { AccountTxs } from "@/types/Txs";

// create a tokens map

const tokens: any = {
  usix: {
    name: "SIX Token",
    symbol: "SIX",
    logo: "/six.png",
    decimals: 6,
  },
};

export default function Address({
  address,
  validator,
  account,
  balance,
  balances,
  price,
  accountTxs,
  delegations,
}: {
  address: string;
  validator: Validator | null;
  account: Account | null;
  balance: Balance | null;
  balances: Balance[] | null;
  price: CoinGeckoPrice | null;
  accountTxs: AccountTxs;
  delegations: Delegation[] | null;
}) {
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
  }, [totalValue]);

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
        <Box>
          <Container maxW="container.xl">
            <Flex direction="column" gap={3} p={3}>
              <Flex direction="row" align="center" gap={4}>
                <Text fontSize="xl" fontWeight="bold" color={"dark"}>
                  Address
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
                                  : 0}
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
                              <Text fontSize={"sm"}>{`$0`}</Text>
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
                                  <Input placeholder="Search" size="sm" />
                                </PopoverHeader>
                                <PopoverBody>
                                  {balances && balances.length > 0 ? (
                                    balances.map((token, index) => (
                                      <Flex
                                        direction="row"
                                        p={2}
                                        align="center"
                                        justify={"space-between"}
                                        borderBottom={
                                          index === TOKENS.length - 1
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
                                              {tokens[token.denom].name}{" "}
                                              {`(${
                                                tokens[token.denom].symbol
                                              })`}
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
                                              {tokens[token.denom].symbol}
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
                                              {`@ $${formatNumber(price?.usd)}`}
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
                <CustomCard footer={"VIEW TXNS"} href={`/txs/${address}`}>
                  <Tabs isLazy>
                    <TabList>
                      <Tab>Txns (All)</Tab>
                      <Tab>Txns (Data Layer)</Tab>
                      {validator && <Tab>Proposed Blocks</Tab>}
                      {validator && <Tab>Individual Nodes</Tab>}
                    </TabList>
                    <TabPanels>
                      {accountTxs && (
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
                                accountTxs.count || 0
                              } from a total of `}
                              <Clickable underline href={`/txs/${address}`}>
                                {accountTxs.total_count}
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
                                {accountTxs.txs.map((tx, index) => (
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
                                        <Text>
                                          <Clickable
                                            href={`/tx/${tx.txhash}`}
                                            underline
                                          >
                                            {formatHex(tx.txhash)}
                                          </Clickable>
                                        </Text>
                                      </Flex>
                                    </Td>
                                    <Td>
                                      <Text>
                                        <Badge>
                                          {tx.type
                                            .split(".")
                                            [
                                              tx.type.split(".").length - 1
                                            ].slice(3)}
                                        </Badge>
                                      </Text>
                                    </Td>
                                    <Td>
                                      <Text>
                                        {moment(tx.time_stamp).fromNow()}
                                      </Text>
                                    </Td>
                                    <Td>
                                      <Text>
                                        <Clickable
                                          href={`/block/${tx.block_height}`}
                                          underline
                                        >
                                          {tx.block_height}
                                        </Clickable>
                                      </Text>
                                    </Td>
                                    <Td>
                                      <Text>
                                        {tx.decode_tx.toAddress && (
                                          <Clickable
                                            href={`/address/${tx.decode_tx.fromAddress}`}
                                            underline
                                          >
                                            {formatHex(
                                              tx.decode_tx.fromAddress
                                            )}
                                          </Clickable>
                                        )}
                                      </Text>
                                    </Td>
                                    <Td>
                                      {tx.decode_tx.toAddress === address ? (
                                        <Badge colorScheme="green">IN</Badge>
                                      ) : tx.decode_tx.fromAddress ===
                                        address ? (
                                        <Badge colorScheme="orange">OUT</Badge>
                                      ) : null}
                                    </Td>
                                    <Td>
                                      <Text>
                                        {tx.decode_tx.toAddress && (
                                          <Clickable
                                            href={`/address/${tx.decode_tx.toAddress}`}
                                            underline
                                          >
                                            {formatHex(tx.decode_tx.toAddress)}
                                          </Clickable>
                                        )}
                                      </Text>
                                    </Td>
                                    <Td>
                                      {tx.decode_tx.amount &&
                                        tx.decode_tx.amount[0]?.amount && (
                                          <Text>{`${formatNumber(
                                            convertUsixToSix(
                                              parseInt(
                                                tx.decode_tx.amount[0].amount
                                              )
                                            )
                                          )} SIX`}</Text>
                                        )}
                                    </Td>
                                    <Td>
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
                      )}
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
                      {validator && (
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
                            <Table variant="simple">
                              <Thead>
                                <Tr>
                                  <Td>
                                    <Text>Block Height</Text>
                                  </Td>
                                  <Td>
                                    <Text>Age</Text>
                                  </Td>
                                  <Td>
                                    <Text>Txns</Text>
                                  </Td>
                                  <Td isNumeric>
                                    <Text>Reward</Text>
                                  </Td>
                                </Tr>
                              </Thead>
                              <Tbody>
                                {blocks.map((block, index) => (
                                  <Tr key={index}>
                                    <Td>
                                      <Text>
                                        <Clickable underline href="/">
                                          {block.blockHeight}
                                        </Clickable>
                                      </Text>
                                    </Td>
                                    <Td>
                                      <Text>{block.time}</Text>
                                    </Td>
                                    <Td>
                                      <Text>{block.txns}</Text>
                                    </Td>
                                    <Td isNumeric>
                                      <Badge>
                                        Reward{" "}
                                        <Clickable href="/">
                                          {block.fee}
                                        </Clickable>{" "}
                                        SIX
                                      </Badge>
                                    </Td>
                                  </Tr>
                                ))}
                              </Tbody>
                            </Table>
                          </TableContainer>
                        </TabPanel>
                      )}
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
                              individual nodes
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
                                      <Text>
                                        <Clickable underline href="/">
                                          {formatHex(
                                            delegation.delegation
                                              .delegator_address
                                          )}
                                        </Clickable>
                                      </Text>
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
      <Footer />
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
    price,
    accountTxs,
    delegations,
  ] = await Promise.all([
    getValidator(address),
    getAccount(address),
    getBalance(address),
    getBalances(address),
    getPriceFromCoingecko("six-network"),
    getTxsFromAddress(address, "1", "20"),
    getDelegationsFromValidator(address),
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
          price,
          accountTxs,
          delegations,
        }
      : {
          address: null,
          validator: null,
          account: null,
          balance: null,
          balances: null,
          price: null,
          accountTxs: null,
          delegations: null,
        },
  };
};

const blocks = [
  {
    blockHeight: 45678,
    time: "6 seconds ago",
    txns: 62,
    fee: 0.4,
    feeRecipient: "6x192A...34kd",
  },
  {
    blockHeight: 45678,
    time: "6 seconds ago",
    txns: 62,
    fee: 0.4,
    feeRecipient: "6x192A...34kd",
  },
  {
    blockHeight: 45678,
    time: "6 seconds ago",
    txns: 62,
    fee: 0.4,
    feeRecipient: "6x192A...34kd",
  },
  {
    blockHeight: 45678,
    time: "6 seconds ago",
    txns: 62,
    fee: 0.4,
    feeRecipient: "6x192A...34kd",
  },
  {
    blockHeight: 45678,
    time: "6 seconds ago",
    txns: 62,
    fee: 0.4,
    feeRecipient: "6x192A...34kd",
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

const TOKENS = [
  {
    name: "Day of Defeat",
    symbol: "DOD",
    amount: 18765,
    value: "400",
    price: "0.1",
    icon: "https://bscscan.com/token/images/dayofdefeat_32.png",
  },
  {
    name: "Day of Defeat",
    symbol: "DOD",
    amount: 18765,
    value: "400",
    price: "0.1",
    icon: "https://bscscan.com/token/images/dayofdefeat_32.png",
  },
];
