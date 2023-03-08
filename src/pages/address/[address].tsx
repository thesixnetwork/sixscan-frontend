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
                <CustomCard>
                  <Tabs isLazy>
                    <TabList>
                      <Tab>Txns (All)</Tab>
                      <Tab>Txns (Data Layer)</Tab>
                      {validator && <Tab>Proposed Blocks</Tab>}
                      {validator && <Tab>Individual Nodes</Tab>}
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
                            {`Latest ${accountTxs.count} from a total of `}
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
                                          [tx.type.split(".").length - 1].slice(
                                            3
                                          )}
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
                                      <Clickable href="/" underline>
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
                                          {formatHex(tx.decode_tx.fromAddress)}
                                        </Clickable>
                                      )}
                                    </Text>
                                  </Td>
                                  <Td>
                                    {tx.decode_tx.toAddress === address ? (
                                      <Badge colorScheme="green">IN</Badge>
                                    ) : tx.decode_tx.fromAddress === address ? (
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
  const isAddressValid = await validateAddress(address);
  if (!isAddressValid) {
    return {
      props: {
        address: null,
        validator: null,
        account: null,
        balance: null,
        balances: null,
        price: null,
        txs: null,
      },
    };
  }
  const validator = await getValidator(address);
  const account = await getAccount(address);
  const balance = await getBalance(address);
  const balances = await getBalances(address);
  const price = await getPriceFromCoingecko("six-network");
  const accountTxs = await getTxsFromAddress(address, "1", "20");
  const delegations = await getDelegationsFromValidator(address);
  return {
    props: {
      address,
      validator,
      account,
      balance,
      balances,
      price,
      accountTxs,
      delegations,
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
