// ------------------------- Chakra UI -------------------------
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  Box,
  Flex,
  Text,
  Container,
  Card,
  CardBody,
  Center,
  Grid,
  GridItem,
  Icon,
  Stack,
  Link,
  Divider,
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
  Table,
  TableContainer,
  Thead,
  Tbody,
  Th,
  Tr,
  Td,
  Badge,
  Spacer,
  Skeleton,
  Button,
} from "@chakra-ui/react";

import {
  CopyIcon,
  TimeIcon
} from "@chakra-ui/icons";
// ------------------------- NextJS -------------------------
import Head from "next/head";
import Image from "next/image";
// ------------------------- Styles -------------------------
import styles from "@/styles/Home.module.css";
import { FaArrowRight, FaDollarSign } from "react-icons/fa";
// ------------- Components ----------------
import NavBar from "@/components/NavBar";
import SearchBar from "@/components/SearchBar";
import CustomCard from "@/components/CustomCard";
import CustomTable from "@/components/CustomTable";
import { useEffect, useState } from "react";

import moment from "moment";

import { Clickable } from "@/components/Clickable";
import { getTxFromHash, getTxEVMFromHash, getTxsFromHash } from "@/service/txs";
import { getBlockEVM } from "@/service/block";
import { getIsContract } from "@/service/auth";
import { Transaction, Transactions, TransactionEVM } from "@/types/Txs";
import { IsContract } from "@/types/Auth";
import { BlockEVM } from "@/types/Block";

import { useRouter } from "next/router";

import { formatNumber, convertAsixToSix, convertUsixToSix } from "@/utils/format";
import { getPriceFromCoingecko } from "@/service/coingecko";
import { CoinGeckoPrice } from "@/types/Coingecko";

import ENV from "@/utils/ENV";
import axios from "axios";
import { parse } from "path";
import { DateTime } from "@cosmjs/tendermint-rpc";


interface Props {
  tx: Transaction;
  txs: Transactions;
  block_evm: BlockEVM;
  tx_evm: TransactionEVM;
  isContract: IsContract;
}

export default function Tx({ tx, txs, block_evm, tx_evm, isContract }: Props) {
  const router = useRouter();
  const [totalValue, setTotalValue] = useState(0);
  let totalValueTmp = 0;

  // console.log("tx22 =>", JSON.parse(tx.tx_result.log)[0])
  console.log("Txs =>", txs)
  // console.log("Txs2 =>", txs.tx.body.messages[0].amount[0].amount)
  ////// Get Price SIX ///////
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
  const [isOpen, setIsOpen] = useState(false);
  const handleClick = () => setIsOpen(!isOpen);
  useEffect(() => {
    // async function fetchPrice() {
    const fetchPrice = async () => {
      setPrice(await getPriceFromCoingecko("six-network"));
    };

    fetchPrice();
  }, []);

  ///////////////////////////////

  if (!tx && !block_evm) {
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
              Tx does not exist
            </Text>
            <Button colorScheme="blue" onClick={() => router.push("/")}>
              Go Home
            </Button>
          </Box>
        </Box>
      </Flex>
    );
  }

  if (!block_evm) {
    return (
      <Flex minHeight={"100vh"} direction={"column"}>
        <Head>
          <title>SIXSCAN</title>
          <meta name="description" content="SIXSCAN" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <Box>
          <Container maxW="container.xl">
            <Flex direction="column" gap={3} p={3}>
              <Text fontSize="xl" fontWeight="bold" color={"darkest"}>
                Transaction Details
              </Text>
              <Divider />
            </Flex>
          </Container>
        </Box>
        <Box p={6}>
          <Container maxW="container.xl">
            <Flex direction={"column"} gap={6}>
              <CustomCard>
                <TableContainer>
                  <Tabs isLazy>
                    <TabList>
                      <Tab>Overview</Tab>
                      <Tab>Logs({Array.isArray(txs.tx_response.logs) && txs.tx_response.logs[0] !== undefined ? txs.tx_response.logs[0].events.length : "0"})</Tab>
                      <Tab>Events({Array.isArray(txs.tx_response.events) && txs.tx_response.events.length})</Tab>
                    </TabList>
                    <TabPanels>
                      {/* ///// Over view //// */}
                      <TabPanel>
                        <Table>
                          <Tbody>
                            <Tr>
                              <Td borderBottom="none">
                                <Flex direction="column">
                                  <Text>{`Transaction Hash:`}</Text>
                                </Flex>
                              </Td>
                              <Td borderBottom="none">
                                <Flex direction="column">
                                  <Text>{txs.tx_response.txhash}</Text>
                                </Flex>
                              </Td>
                            </Tr>
                            <Tr>
                              <Td borderBottom="none">
                                <Flex direction="column">
                                  <Text>{`Status:`}</Text>
                                </Flex>
                              </Td>
                              <Td borderBottom="none">
                                <Flex direction="column">
                                  <Text>
                                    {txs.tx_response.code === 0 ?
                                      <Badge colorScheme={"green"}>
                                        Success
                                      </Badge>
                                      : <Badge colorScheme={"red"}>
                                        Failed
                                      </Badge>
                                    }
                                  </Text>
                                </Flex>
                              </Td>
                            </Tr>
                            <Tr>
                              <Td borderBottom="none">
                                <Flex direction="column">
                                  <Text>{`Block:`}</Text>
                                </Flex>
                              </Td>
                              <Td borderBottom="none">
                                <Flex direction="column">
                                  <Text>
                                    <Clickable underline href={`/block/${tx.height}`}>
                                      {txs.tx_response.height}
                                    </Clickable>
                                  </Text>
                                </Flex>
                              </Td>
                            </Tr>
                            <Tr>
                              <Td>
                                <Flex direction="column">
                                  <Text>{`Timestamp:`}</Text>
                                </Flex>
                              </Td>
                              <Td>
                                <Flex direction="row">
                                  <TimeIcon style={{ marginRight: '5px' }} />
                                  {moment(txs.tx_response.timestamp).format("HH:mm:ss YYYY-MM-DD")}{" "}
                                  ({moment(txs.tx_response.timestamp).fromNow()})
                                </Flex>
                              </Td>
                            </Tr>

                            {/* ///// Form-to/lal ///// */}
                            {Array.isArray(txs.tx.body.messages) && txs.tx.body.messages[0].from_address &&
                              <Tr>
                                <Td borderBottom="none">
                                  <Flex direction="column">
                                    <Text>{`Form:`}</Text>
                                  </Flex>
                                </Td>
                                <Td borderBottom="none">
                                  <Flex direction="row">
                                    <Text style={{ marginRight: '5px' }}>
                                      {Array.isArray(txs.tx.body.messages) && txs.tx.body.messages.length > 0 && (
                                        <Clickable
                                          href={`/address/${txs.tx.body.messages[0].from_address}`}
                                          underline
                                        >
                                          {txs.tx.body.messages[0].from_address}
                                        </Clickable>
                                      )}
                                    </Text>
                                  </Flex>
                                </Td>
                              </Tr>
                            }
                            {Array.isArray(txs.tx.body.messages) && txs.tx.body.messages[0].to_address &&
                              <Tr>
                                <Td>
                                  <Flex direction="column">
                                    <Text>{`To:`}</Text>
                                  </Flex>
                                </Td>
                                <Td>
                                  <Flex direction="row">
                                    <Text style={{ marginRight: '5px' }}>
                                      {Array.isArray(txs.tx.body.messages) && txs.tx.body.messages.length > 0 && (
                                        <Clickable
                                          href={`/address/${txs.tx.body.messages[0].to_address}`}
                                          underline
                                        >
                                          {txs.tx.body.messages[0].to_address}
                                        </Clickable>
                                      )}
                                    </Text>
                                  </Flex>
                                </Td>
                              </Tr>
                            }

                            {/* //// action nft //// */}
                            {Array.isArray(txs.tx.body.messages) && txs.tx.body.messages[0].nft_schema_code &&
                              <Tr>
                                <Td borderBottom="none">
                                  <Flex direction="column">
                                    <Text>{`NFT Schema Code:`}</Text>
                                  </Flex>
                                </Td>
                                <Td borderBottom="none">
                                  <Flex direction="row">
                                    {Array.isArray(txs.tx.body.messages) && (
                                      <Text style={{ marginRight: '5px' }}>{txs.tx.body.messages[0]?.nft_schema_code}</Text>
                                    )}
                                  </Flex>
                                </Td>
                              </Tr>
                            }
                            {Array.isArray(txs.tx.body.messages) && txs.tx.body.messages[0].action &&
                              <Tr>
                                <Td borderBottom="none">
                                  <Flex direction="column">
                                    <Text>{`Action:`}</Text>
                                  </Flex>
                                </Td>
                                <Td borderBottom="none">
                                  <Flex direction="row">
                                    {Array.isArray(txs.tx.body.messages) && (
                                      <Text style={{ marginRight: '5px' }}>{txs.tx.body.messages[0]?.action}</Text>
                                    )}
                                  </Flex>
                                </Td>
                              </Tr>
                            }
                            {Array.isArray(txs.tx.body.messages) && txs.tx.body.messages[0].tokenId &&
                              <Tr>
                                <Td borderBottom="none">
                                  <Flex direction="column">
                                    <Text>{`Token ID:`}</Text>
                                  </Flex>
                                </Td>
                                <Td borderBottom="none">
                                  <Flex direction="row">
                                    {Array.isArray(txs.tx.body.messages) && (
                                      <Text style={{ marginRight: '5px' }}>{txs.tx.body.messages[0]?.tokenId}</Text>
                                    )}
                                  </Flex>
                                </Td>
                              </Tr>
                            }
                            {Array.isArray(txs.tx.body.messages) && txs.tx.body.messages[0].ref_id &&
                              <Tr>
                                <Td borderBottom="none">
                                  <Flex direction="column">
                                    <Text>{`Ref ID:`}</Text>
                                  </Flex>
                                </Td>
                                <Td borderBottom="none">
                                  <Flex direction="row">
                                    {Array.isArray(txs.tx.body.messages) && (
                                      <Text style={{ marginRight: '5px' }}>{txs.tx.body.messages[0]?.ref_id}</Text>
                                    )}
                                  </Flex>
                                </Td>
                              </Tr>
                            }
                            {/* //////////////////// */}

                            {Array.isArray(txs.tx.body.messages) && txs.tx.body.messages[0].receiver &&
                              <Tr>
                                <Td borderBottom="none">
                                  <Flex direction="column">
                                    <Text>{`Receiver:`}</Text>
                                  </Flex>
                                </Td>
                                <Td borderBottom="none">
                                  <Flex direction="row">
                                    <Text style={{ marginRight: '5px' }}>
                                      {Array.isArray(txs.tx.body.messages) && txs.tx.body.messages.length > 0 && (
                                        <Clickable
                                          href={`/address/${txs.tx.body.messages[0].receiver}`}
                                          underline
                                        >
                                          {txs.tx.body.messages[0].receiver}
                                        </Clickable>
                                      )}
                                    </Text>
                                  </Flex>
                                </Td>
                              </Tr>
                            }
                            {Array.isArray(txs.tx.body.messages) && txs.tx.body.messages[0].creator &&
                              <Tr>
                                <Td>
                                  <Flex direction="column">
                                    <Text>{`Creator:`}</Text>
                                  </Flex>
                                </Td>
                                <Td>
                                  <Flex direction="row">
                                    <Text style={{ marginRight: '5px' }}>
                                      {Array.isArray(txs.tx.body.messages) && txs.tx.body.messages.length > 0 && (
                                        <Clickable
                                          href={`/address/${txs.tx.body.messages[0].creator}`}
                                          underline
                                        >
                                          {txs.tx.body.messages[0].creator}
                                        </Clickable>
                                      )}
                                    </Text>
                                  </Flex>
                                </Td>
                              </Tr>
                            }
                            {/* ///////////////////////// */}
                            {Array.isArray(txs.tx.body.messages) && txs.tx.body.messages[0].amount !== undefined &&
                              <Tr>
                                <Td borderBottom="none">
                                  <Flex direction="column">
                                    <Text>{`Value:`}</Text>
                                  </Flex>
                                </Td>
                                <Td borderBottom="none">
                                  <Flex direction="row">
                                    <Image src="/six.png" alt="coin" height={20} width={20} style={{ marginRight: '5px' }} />
                                    <Text style={{ marginRight: '5px' }} >{Array.isArray(txs.tx.body.messages) && txs.tx.body.messages[0].amount.amount !== undefined ? convertUsixToSix(parseInt(txs.tx.body.messages[0].amount.amount)) : convertUsixToSix(parseInt(txs.tx.body.messages[0].amount[0].amount))} SIX </Text>
                                    <Text style={{ color: '#6c757d' }} >{price && price.usd ? `($${formatNumber(5 * price.usd)})` : `($999)`}</Text>
                                  </Flex>
                                </Td>
                              </Tr>
                            }
                            <Tr>
                              <Td borderBottom="none">
                                <Flex direction="column">
                                  <Text>{`Gas:`}</Text>
                                </Flex>
                              </Td>
                              <Td borderBottom="none">
                                <Flex direction="row">
                                  <Text style={{ marginRight: '5px' }}>{tx.tx_result.gas_used}</Text>
                                  <Center height='23px' style={{ marginRight: '5px' }}>
                                    <Divider orientation='vertical' />
                                  </Center>
                                  <Text style={{ marginRight: '5px' }}>{tx.tx_result.gas_wanted}</Text>
                                  <Text>({((parseInt(tx.tx_result.gas_used) / parseInt(tx.tx_result.gas_wanted)) * 100).toFixed(2)}%)</Text>
                                </Flex>
                              </Td>
                            </Tr>
                            <Tr>
                              <Td borderBottom="none">
                                <Flex direction="column">
                                  <Text>{`Fee:`}</Text>
                                </Flex>
                              </Td>
                              <Td borderBottom="none">
                                <Flex direction="row">
                                  <Text style={{ marginRight: '5px' }}>{convertUsixToSix(parseInt(txs.tx_response.gas_wanted) * 125 / 100)} SIX {price && price.usd ? `($${formatNumber(convertUsixToSix(parseInt(txs.tx_response.gas_wanted) * 125 / 100) * price.usd)})` : `($999)`}</Text>
                                </Flex>
                              </Td>
                            </Tr>
                            <Tr>
                              <Td borderBottom="none">
                                <Flex direction="column">
                                  <Text>{`@Type:`}</Text>
                                </Flex>
                              </Td>
                              <Td borderBottom="none">
                                <Flex direction="row">
                                  {Array.isArray(txs.tx.body.messages) && txs.tx.body.messages.length > 0 && (
                                    <Text style={{ marginRight: '5px' }}>{txs.tx.body.messages[0]?.["@type"]}</Text>
                                  )}
                                </Flex>
                              </Td>
                            </Tr>



                          </Tbody>
                        </Table>
                      </TabPanel>

                      {/* ///// Logs ///// */}
                      <TabPanel>
                        <Table>
                          <Tbody>
                            {Array.isArray(txs.tx_response.logs) && txs.tx_response.logs[0] !== undefined && txs.tx_response.logs[0].events.map((event: any, index: any) => (
                              <Tr key={index}>
                                <Td>
                                  <Badge>{event.type}</Badge>
                                </Td>
                                <Td>
                                  {event.attributes.map((attr: any, index: any) => (
                                    <Flex
                                      direction="row"
                                      gap={2}
                                      alignItems="center"
                                      key={index}
                                    >
                                      {attr.key && (
                                        <Text style={{ marginBottom: '10px', color: '#4a4f55', fontWeight: 'bold' }}>
                                          {attr.key}
                                        </Text>
                                      )}
                                      {attr.value && (
                                        <Text style={{ marginBottom: '10px' }}>
                                          {/* {attr.value} */}
                                          {attr.key === 'action' && <Text>{attr.value}</Text>}
                                          {attr.value.startsWith('6x') && <Text>
                                            <Clickable
                                              href={`/address/${attr.value}`}
                                              underline
                                            >
                                              {attr.value}
                                            </Clickable>
                                          </Text>}
                                          {attr.value.endsWith('usix') && <Text style={{ display: 'flex' }}>
                                            {convertUsixToSix(parseInt(attr.value.split('usix')[0]))}
                                            <Text style={{ marginLeft: '5px' }}> SIX</Text>
                                          </Text>}
                                          {attr.value.endsWith('asix') && <Text style={{ display: 'flex' }}>
                                            {convertAsixToSix(parseInt(attr.value.split('usix')[0]))}
                                            <Text style={{ marginLeft: '5px' }}> WrapSIX</Text>
                                          </Text>}
                                        </Text>
                                      )}

                                    </Flex>
                                  ))}
                                </Td>
                              </Tr>
                            ))}
                          </Tbody>
                        </Table>
                      </TabPanel>

                      <TabPanel>
                        <Table>
                          <Tbody>
                            {Array.isArray(txs.tx_response.events) && txs.tx_response.events.map((event: any, index: any) => (
                              <Tr key={index}>
                                <Td>
                                  <Badge>{event.type}</Badge>
                                </Td>
                                <Td>
                                  {event.attributes.map((attr: any, index: any) => (
                                    <Flex
                                      direction="row"
                                      gap={2}
                                      alignItems="center"
                                      key={index}
                                    >
                                      {attr.key && (
                                        <Text style={{ fontWeight: 'bold', color: '#4a4f55' }}>
                                          {Buffer.from(attr.key, "base64").toString()}
                                        </Text>
                                      )}
                                      {attr.value && (
                                        <Text>
                                          {Buffer.from(attr.value, "base64").toString()}
                                        </Text>
                                      )}
                                    </Flex>
                                  ))}
                                </Td>
                              </Tr>
                            ))}
                          </Tbody>
                        </Table>
                      </TabPanel>

                    </TabPanels>
                  </Tabs>
                </TableContainer>
              </CustomCard>



            </Flex>
          </Container>
        </Box>
        <Spacer />
      </Flex>
    );
  } else {

    //////////////////// Txs EVM  /////////////////////////
    return (
      <Flex minHeight={"100vh"} direction={"column"}>
        <Head>
          <title>SIXSCAN</title>
          <meta name="description" content="SIXSCAN" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <Box>
          <Container maxW="container.xl">
            <Flex direction="column" gap={3} p={3}>
              <Text fontSize="xl" fontWeight="bold" color={"darkest"}>
                Transaction Details EVM
              </Text>
              <Divider />
            </Flex>
          </Container>
        </Box>
        <Box p={6}>
          <Container maxW="container.xl">
            <Flex direction={"column"} gap={6}>
              <CustomCard>
                <TableContainer>
                  <Table>
                    <Tbody>
                      <Tr>
                        <Td borderBottom="none">
                          <Flex direction="column">
                            <Text>{`Transaction Hash:`}</Text>
                          </Flex>
                        </Td>
                        <Td borderBottom="none">
                          <Flex direction="row">
                            <Text style={{ marginRight: '5px' }}>{tx_evm.hash}</Text>
                            <CopyIcon onClick={() => navigator.clipboard.writeText(tx_evm.hash)} />
                          </Flex>
                        </Td>
                      </Tr>
                      <Tr>
                        <Td borderBottom="none">
                          <Flex direction="column">
                            <Text>{`Status:`}</Text>
                          </Flex>
                        </Td>
                        <Td borderBottom="none">
                          <Flex direction="column">
                            <Text>
                              <Badge colorScheme={"green"}>
                                {tx_evm.transactionIndex === null ? "Failed" : "Success"}
                              </Badge>
                            </Text>
                          </Flex>
                        </Td>
                      </Tr>
                      <Tr>
                        <Td borderBottom="none">
                          <Flex direction="column">
                            <Text>{`Block:`}</Text>
                          </Flex>
                        </Td>
                        <Td borderBottom="none">
                          <Flex direction="column">
                            <Text>
                              <Clickable underline href={`/block/${parseInt(block_evm.number, 16)}`}>
                                {parseInt(block_evm.number, 16)}
                              </Clickable>
                            </Text>
                          </Flex>
                        </Td>
                      </Tr>
                      <Tr>
                        <Td>
                          <Flex direction="column">
                            <Text>{`Timestamp:`}</Text>
                          </Flex>
                        </Td>
                        <Td>
                          <Flex direction="column">
                            {`${moment(
                              parseInt(block_evm.timestamp, 16) * 1000
                            ).fromNow()} (${moment(
                              parseInt(block_evm.timestamp, 16) * 1000
                            ).format("YYYY-MM-DD HH:mm:ss")})`}
                          </Flex>
                        </Td>
                      </Tr>
                      <Tr>
                        <Td borderBottom="none">
                          <Flex direction="column">
                            <Text>{`From:`}</Text>
                          </Flex>
                        </Td>
                        <Td borderBottom="none">
                          <Flex direction="column">
                            <Text>
                              <Clickable
                                href={`/address/${tx_evm.from}`}
                                underline
                              >
                                {tx_evm.from}
                              </Clickable>
                            </Text>
                          </Flex>
                        </Td>
                      </Tr>
                      <Tr>
                        <Td>
                          <Flex direction="column">
                            <Text>{`To:`}</Text>
                          </Flex>
                        </Td>
                        <Td>
                          <Flex direction="row">
                            {isContract ? <Text style={{ marginRight: "10px" }}>Contract</Text> : null}
                            <Text>
                              <Clickable
                                href={`/address/${tx_evm.to}`}
                                underline
                              >
                                {tx_evm.to}
                              </Clickable>
                            </Text>
                          </Flex>
                        </Td>
                      </Tr>
                      <Tr>
                        <Td borderBottom="none">
                          <Flex direction="column">
                            <Text>{`Value:`}</Text>
                          </Flex>
                        </Td>
                        <Td borderBottom="none">
                          <Flex direction="row">
                            <Image src="/six.png" alt="coin" height={20} width={20} style={{ marginRight: '5px' }} />
                            <Text style={{ marginRight: '5px' }} >{convertAsixToSix(parseInt(tx_evm.value, 16))} SIX </Text>
                            <Text style={{ color: '#6c757d' }} >{price && price.usd ? `($${formatNumber(convertAsixToSix(parseInt(tx_evm.value, 16)) * price.usd)})` : ''}</Text>
                          </Flex>
                        </Td>
                      </Tr>
                      <Tr>
                        <Td>
                          <Flex direction="column">
                            <Text>{`Transaction Fee:`}</Text>
                          </Flex>
                        </Td>
                        <Td>
                          <Flex direction="row">
                            <Text style={{ marginRight: '5px' }} >{convertAsixToSix(parseInt(tx_evm.gas, 16) * parseInt(tx_evm.gasPrice, 16))} SIX </Text>
                            <Text style={{ color: '#6c757d' }} >{price && price.usd ? `(${formatNumber(convertAsixToSix(parseInt(tx_evm.gas, 16) * parseInt(tx_evm.gasPrice, 16)) * price?.usd)})` : ''}</Text>

                          </Flex>
                        </Td>
                      </Tr>


                    </Tbody>
                  </Table>
                </TableContainer>
              </CustomCard>

            </Flex>
          </Container>
        </Box>

        <Box px={6} >
          <Container maxW="container.xl">
            <Flex direction={"column"} gap={6}>
              <CustomCard>
                <Accordion allowMultiple maxW="container.xl">
                  <AccordionItem>

                    <AccordionPanel pb={4}>
                      <TableContainer>
                        <Table>
                          <Tbody>
                            <Tr>
                              <Td borderBottom="none">
                                <Flex direction="column">
                                  <Text>{`Gas Used:`}</Text>
                                </Flex>
                              </Td>
                              <Td borderBottom="none">
                                <Flex direction="column">
                                  <Text>{parseInt(tx_evm.gas, 16)}</Text>
                                </Flex>
                              </Td>
                            </Tr>
                            <Tr>
                              <Td borderBottom="none">
                                <Flex direction="column">
                                  <Text>{`Gas Price:`}</Text>
                                </Flex>
                              </Td>
                              <Td borderBottom="none">
                                <Flex direction="row">
                                  <Text style={{ marginRight: '5px' }} >{convertAsixToSix(parseInt(tx_evm.gasPrice, 16))} SIX</Text>
                                  <Text style={{ color: '#6c757d' }} >{price && price.usd ? `(${formatNumber(convertAsixToSix(parseInt(tx_evm.gasPrice, 16)) * price?.usd)})` : ''}</Text>
                                </Flex>
                              </Td>
                            </Tr>
                            <Tr>
                              <Td>
                                <Flex direction="column">
                                  <Text>{`Gas Limit & Usage by Txn:`}</Text>
                                </Flex>
                              </Td>
                              <Td>
                                <Flex direction="column">
                                  <Text>{parseInt(block_evm.gasLimit, 16)} | {parseInt(tx_evm.gas, 16)} ({((parseInt(tx_evm.gas, 16) / parseInt(block_evm.gasLimit, 16)) * 100).toFixed(2)}%)</Text>
                                </Flex>
                              </Td>
                            </Tr>
                            <Tr>
                              <Td borderBottom="none">
                                <Flex direction="column">
                                  <Text>{`Other Attributes:`}</Text>
                                </Flex>
                              </Td>
                              <Td borderBottom="none">
                                <Flex
                                  direction="row"
                                  gap={2}
                                  alignItems="center"
                                >
                                  <Badge>Txn Type: {parseInt(tx_evm.type, 16)}(EIP-2718)</Badge>
                                  <Badge>Nonce: {parseInt(tx_evm.nonce, 16)}</Badge>
                                  <Badge>Position: {parseInt(tx_evm.transactionIndex, 16)}</Badge>
                                </Flex>
                              </Td>
                            </Tr>
                            <Tr>
                              <Td>
                                <Flex direction="column">
                                  <Text>{`Input Data:`}</Text>
                                </Flex>
                              </Td>
                              <Td>
                                <Flex direction="column">
                                  <Card style={{ resize: "both", overflow: "auto", minHeight: "50px", minWidth: "680px", backgroundColor: "#f8f9fa", borderRadius: "10px" }}>
                                    <CardBody>
                                      <Text>{tx_evm.input}</Text>
                                    </CardBody>
                                  </Card>
                                </Flex>
                              </Td>
                            </Tr>

                          </Tbody>
                        </Table>
                      </TableContainer>
                    </AccordionPanel >
                    <AccordionButton onClick={handleClick}>
                      <Box p={3}>
                        <Text style={{ marginRight: "70px" }}>More Details:</Text>

                      </Box>
                      <Text style={{ color: '#0784C3' }} >{isOpen ? '- Click to see Less' : '+ Click to see More'}</Text>
                    </AccordionButton>
                  </AccordionItem>
                </Accordion>
              </CustomCard>
            </Flex>
          </Container>
        </Box>

        <Spacer />
      </Flex>
    );
  }
}

const getTx = async (txhash: string) => {
  return {
    txhash,
  };
};

export const getServerSideProps = async (context: {
  params: { txhash: any };
}) => {
  const { txhash } = context.params;
  let tx;
  let txs;
  let tx_evm;
  let block_evm;
  let isContract
  if (txhash.startsWith('0x')) {
    tx_evm = await getTxEVMFromHash(txhash);
  } else {
    tx = await getTxFromHash(txhash);
    txs = await getTxsFromHash(txhash);
  }
  if (!tx) {
    tx = null;
  }
  if (tx_evm != undefined) {
    block_evm = await getBlockEVM(tx_evm.blockNumber);
    isContract = await getIsContract(tx_evm.to);
  }
  if (!block_evm) {
    block_evm = null;
    tx_evm = null;
    isContract = null;
  }
  console.log("txsssss ==>", txs.tx_response.logs)
  return {
    props: {
      tx,
      txs,
      block_evm,
      tx_evm,
      isContract,
    },
  };
};
