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
  Input,
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
  Textarea,
  Thead,
  Tbody,
  Th,
  Tr,
  Td,
  Badge,
  Select,
  Spacer,
  Skeleton,
  Button,
  textDecoration,
} from "@chakra-ui/react";

import {
  CopyIcon,
  TimeIcon
} from "@chakra-ui/icons";
// ------------------------- NextJS -------------------------
import Head from "next/head";
import Image from "next/image";
// ------------------------- Styles -------------------------
// import styles from "@/styles/Home.module.css";
// import { FaArrowRight, FaDollarSign } from "react-icons/fa";
// ------------- Components ----------------
// import NavBar from "@/components/NavBar";
// import SearchBar from "@/components/SearchBar";
import CustomCard from "@/components/CustomCard";
// import CustomTable from "@/components/CustomTable";
import { useEffect, useState } from "react";
import { LinkComponent } from "@/components/Chakralink";

import moment from "moment";

import { Clickable } from "@/components/Clickable";
import { getTxsByHashFromAPI, getTxEVMFromHash, getTxByHashFromRPC } from "@/service/txs";
import { getBlockEVM } from "@/service/block";
import { getIsContract } from "@/service/auth";
import { Transaction, Transactions, TransactionEVM } from "@/types/Txs";
import { IsContract } from "@/types/Auth";
import { BlockEVM } from "@/types/Block";

import { useRouter } from "next/router";

import { formatNumber, convertAsixToSix, convertUsixToSix, formatEng, formatBank, convertAmountToSix, convertStringAmountToCoin } from "@/utils/format";
import { getPriceFromCoingecko } from "@/service/coingecko";
import { CoinGeckoPrice } from "@/types/Coingecko";

import ENV from "@/utils/ENV";
import { _LOG } from "@/utils/log_helper";
import axios from "axios";
import { parse } from "path";
import { DateTime } from "@cosmjs/tendermint-rpc";
import { parseJsonText } from "typescript";
import dynamic from 'next/dynamic';
import { FaKeybase } from "react-icons/fa";


// const ReactJsonViewer = dynamic(
//   () => import('react-json-viewer-cool'),
//   { ssr: false }
// );

const DynamicReactJson = dynamic(
  () => import('react-json-view'),
  { ssr: false }
);


interface Props {
  tx: Transaction;
  txs: any;
  block_evm: BlockEVM;
  tx_evm: TransactionEVM;
  isContract: IsContract;
}

export default function Tx({ tx, txs, block_evm, tx_evm, isContract }: Props) {
  const router = useRouter();
  const [totalValue, setTotalValue] = useState(0);
  const [isDecode, setIsDecode] = useState('Default');
  const CType = ['Default', 'Decode'];
  const handleChange_verify = async (e: any) => {
    setIsDecode(e.target.value)
  }
  _LOG(isDecode)

  // add key to object of reward to message if type is MsgWithdrawDelegatorReward
  if (txs.tx && txs.tx.body.messages[0]['@type'] === "/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward") {
    txs.tx.body.messages[0].rewards = txs.tx_response.logs[0].events[0].attributes[1].value
  } else if (txs.messages && txs.messages[0]['@type'] === "/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward") {
    txs.messages[0].rewards = txs.tx_response.logs[0].events[0].attributes[1].value
  }
  const isMultimessage = txs.tx && txs.tx.body.messages.length > 1 ? true : false;

  // add key to object of reward to message if type is MsgWithdrawDelegatorReward in case of multimessage
  if (isMultimessage === true) {
    for (let i = 0; i < txs.tx.body.messages.length; i++) {
      if (txs.tx.body.messages[i]['@type'] === "/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward") {
        txs.tx.body.messages[i].rewards = txs.tx_response.logs[i].events[0].attributes[1].value
      }
    }
  }

  const allMultimessage = txs.tx && txs.tx.body.messages

  // get object keys from txs.tx.body.messages[0]
  const KeyMsg = txs.tx ? Object.keys(txs.tx.body.messages[0]) : Object.keys(txs.messages[0]);
  const message = txs.tx ? txs.tx.body.messages[0] : txs.messages[0];

  // const txSuccess = txs.tx_response.code == 0 ? true : false;
  let txSuccess = false
  if (txs.tx_response) {
    txSuccess = txs.tx_response.code == 0 ? true : false;
  } else {
    txSuccess = txs.code == 0 ? true : false;
  }

  let _Logs: any;
  let _Events: any;
  if (txSuccess === true) {
    _Logs = txs.tx_response && txs.tx_response.logs
    _Events = txs.tx_response && txs.tx_response.events
  } else {
    _Logs = txs.tx_response && txs.tx_response.raw_log.split("\n").pop();
    _Events = txs.tx_response && txs.tx_response.events
  }

  let totalValueTmp = 0;

  const my_json_object = {
    "name": "John",
    "age": 30,
    "city": "New York"
  };

  // const parsedJson = JSON.parse(jsonText);
  // const formattedJson = JSON.stringify(parsedJson, null, 2);
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

  if (!block_evm && !isMultimessage) {
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
                      <Tab>Logs({Array.isArray(_Logs) && _Logs[0].events !== undefined ? _Logs[0].events.length : "1"})</Tab>
                      <Tab>Events({Array.isArray(_Events) && _Events.length})</Tab>
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
                                <Flex direction="row">
                                  <Text marginRight="6px">{txs.tx_response ? txs.tx_response.txhash : txs.txhash}</Text>
                                  <CopyIcon onClick={() => navigator.clipboard.writeText(txs.tx_response ? txs.tx_response.txhash : txs.txhash)} />
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
                                    {txSuccess === true ?
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
                                    <Clickable href={`/block/${tx.height ? tx.height : txs.block_height}`}>
                                      {txs.tx_response ? txs.tx_response.height : txs.block_height}
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
                                  {moment(txs.tx_response ? txs.tx_response.timestamp : txs.time_stamp).format("HH:mm:ss YYYY-MM-DD")}{" "}
                                  ({moment(txs.tx_response ? txs.tx_response.timestamp : txs.time_stamp).fromNow()})
                                </Flex>
                              </Td>
                            </Tr>

                            {KeyMsg.map((key: any, index) => {
                              // {console.log(key)}
                              if (typeof message[key] === "string" && message[key].startsWith("6x")) {
                                if (key === "from_address") {
                                  return (
                                    <Tr key={index}>
                                      <Td borderBottom="none">
                                        <Flex direction="column">
                                          <Text>{typeof key === "string" ? formatBank(key) : key}</Text>
                                        </Flex>
                                      </Td>
                                      <Td borderBottom="none">
                                        <Flex direction="row">
                                          <Clickable
                                            href={`/address/${message[key]}`}
                                          >
                                            {message[key]}
                                          </Clickable>
                                          <CopyIcon marginLeft="5px" onClick={() => navigator.clipboard.writeText(message[key])} />
                                        </Flex>
                                      </Td>
                                    </Tr>
                                  );
                                }

                                return (
                                  <Tr key={index}>
                                    <Td>
                                      <Flex direction="column">
                                        <Text>{typeof key === "string" ? formatBank(key) + ':' : key}</Text>
                                      </Flex>
                                    </Td>
                                    <Td>
                                      <Flex direction="row">
                                        {key != "ref_id" &&
                                          <Text style={{ marginRight: '5px' }}>
                                            <Clickable
                                              href={`/address/${message[key]}`}
                                            >
                                              {message[key]}
                                            </Clickable>
                                            <CopyIcon marginLeft="5px" onClick={() => navigator.clipboard.writeText(message[key])} />
                                          </Text>
                                        }
                                        {key === "ref_id" &&
                                          <Text style={{ marginRight: '5px' }}>
                                            {message[key]}
                                          </Text>
                                        }
                                      </Flex>
                                    </Td>
                                  </Tr>
                                );
                              } else if (key == "amount") {
                                return (
                                  <Tr key={index}>
                                    <Td borderBottom="none">
                                      <Flex direction="column">
                                        <Text>{`Value:`}</Text>
                                      </Flex>
                                    </Td>
                                    <Td borderBottom="none">
                                      <Flex direction="row">
                                        <Image src="/six.png" alt="coin" height={20} width={20} style={{ marginRight: '5px' }} />
                                        {
                                          message[key][0]?.amount?.[0] !== undefined ? (
                                            <Text style={{ marginRight: '5px' }}>
                                              {convertAmountToSix(message[key][0])} {message[key][0].denom === "usix" ? "SIX" : message[key][0].denom}
                                            </Text>
                                            
                                          ) : (
                                            <Text style={{ marginRight: '5px' }}>
                                              {convertAmountToSix(message[key])} {message[key].denom === "usix" ? "SIX" : message[key].denom}
                                            </Text>
                                          )
                                        }
                                        {/* <Text style={{ marginRight: '5px' }}>{ message[key][0]?.amount[0] !== undefined? convertAmountToSix(message[key][0]): convertAmountToSix(message[key])} SIX</Text> */}
                                        <Text style={{ color: '#6c757d' }} >{(message[key].denom || message[key][0].denom == "usix") && price && price.usd ? `($${formatNumber(5 * price.usd)})` : `(#NA)`}</Text>
                                      </Flex>
                                    </Td>
                                  </Tr>
                                )
                              }
                              if (key === "receiver") {
                                return (
                                  <Tr key={index}>
                                    <Td borderBottom="none">
                                      <Flex direction="column">
                                        <Text>{typeof key === "string" ? formatBank(key) + ':' : key}</Text>
                                      </Flex>
                                    </Td>
                                    <Td borderBottom="none">
                                      <Flex direction="row">
                                        <LinkComponent marginRight="5px" href={`${ENV.BLOCK_SCOUT_API_URL}/address/${message[key]}`}>
                                          <Text
                                            as={"span"}
                                            decoration={"none"}
                                            color="primary.500"
                                          >
                                            {message[key]}
                                          </Text>
                                        </LinkComponent>
                                        <CopyIcon onClick={() => navigator.clipboard.writeText(message[key])} />
                                      </Flex>
                                    </Td>
                                  </Tr>
                                );
                              }

                              // if (key === "nftSchemaBase64") {
                              //   return (
                              //     <Tr key={index}>
                              //       <Td borderBottom="none">
                              //         <Flex direction="column">
                              //           <Text>{typeof key === "string" ? formatBank(key) + ':' : key}</Text>
                              //         </Flex>
                              //       </Td>
                              //       <Td borderBottom="none">
                              //         <Flex direction="row">
                              //           <Textarea readOnly>
                              //             {message[key]}
                              //           </Textarea>
                              //         </Flex>
                              //       </Td>
                              //     </Tr>
                              //   );
                              // }

                              if (key === "data") {
                                return (
                                  <Tr key={index}>
                                    <Td borderBottom="none">
                                      <Flex direction="column">
                                        <Text>{typeof key === "string" ? formatBank(key) + ':' : key}</Text>
                                      </Flex>
                                    </Td>
                                    <Td borderBottom="none">
                                      <Flex direction="row">
                                        {/* <CustomCard> */}
                                        <TableContainer>
                                          <Tabs isLazy>
                                            <TabList>
                                              {Object.keys(message[key]).map((keys: any, index) => {
                                                return (
                                                  <Tab key={index}>{keys}</Tab>
                                                );
                                              })}
                                            </TabList>
                                            <TabPanels>
                                              {Object.values(message[key]).map((data: any, i) => {
                                                return (
                                                  <TabPanel key={i}>
                                                    <Textarea readOnly value={data} />
                                                  </TabPanel>
                                                );
                                              })}
                                            </TabPanels>
                                          </Tabs>
                                        </TableContainer>
                                        {/* </CustomCard> */}
                                      </Flex>
                                    </Td>
                                  </Tr>
                                );
                              }
                              if (key === "hash") {
                                return (
                                  <Tr key={index}>
                                    <Td borderBottom="none">
                                      <Flex direction="column">
                                        <Text>{typeof key === "string" ? formatBank(key) + ':' : key}</Text>
                                      </Flex>
                                    </Td>
                                    <Td borderBottom="none">
                                      <Flex direction="row">
                                        <LinkComponent marginRight="5px" href={`${ENV.BLOCK_SCOUT_API_URL}/address/${message[key]}`}>
                                          <Text
                                            as={"span"}
                                            decoration={"none"}
                                            color="primary.500"
                                          >
                                            {message[key]}
                                          </Text>
                                        </LinkComponent>
                                        <CopyIcon onClick={() => navigator.clipboard.writeText(message[key])} />
                                      </Flex>
                                    </Td>
                                  </Tr>
                                );
                              }

                              if (key === "base64NFTData" || key === "nftSchemaBase64" ||
                                key === "base64NewAttriuteDefenition" || key === "base64NewAction" ||
                                key === "base64_nft_attribute_value" || key === "base64ActionSignature" ||
                                key === "base64VerifyRequestorSignature" || key === "base64OriginContractInfo"
                              ) {
                                return (
                                  <Tr key={index}>
                                    <Td borderBottom="none" display={"flex"}>
                                      <Flex>
                                        <Text>{typeof key === "string" ? formatBank(key) + ':' : key}</Text>
                                      </Flex>
                                    </Td>
                                    <Td borderBottom="none">
                                      <Flex direction="column">
                                        {isDecode === 'Default' &&
                                          (<Textarea readOnly value={message[key]} height={"200px"} backgroundColor={"#f4f4f4"} />)
                                        }
                                        {isDecode === 'Decode' &&
                                          <Box minHeight={"200px"} height={"300px"} width={"auto"} overflowY="auto" overflowX="hidden" backgroundColor={"#f4f4f4"} borderRadius={"10px"} >
                                            <Flex p={3}>
                                              <DynamicReactJson src={JSON.parse(Buffer.from(message[key], 'base64').toString('utf-8'))} collapsed={1} displayDataTypes={false} />
                                            </Flex>
                                          </Box>
                                        }
                                        <Box width={"20%"} marginTop={"10px"}>
                                          <Select onChange={(e) => handleChange_verify(e)} backgroundColor={"#f4f4f4"}>
                                            {CType.map((option, index) => (
                                              <option key={index} value={option}>
                                                {option}
                                              </option>
                                            ))}
                                          </Select>
                                        </Box>
                                      </Flex>
                                    </Td>
                                  </Tr>
                                );
                              }

                              if (key === "base64EncodedSetSignerAction") {
                                return (
                                  <Tr key={index}>
                                    <Td borderBottom="none">
                                      <Flex direction="column">
                                        <Text>{typeof key === "string" ? formatBank(key) + ':' : key}</Text>
                                      </Flex>
                                    </Td>
                                    <Td borderBottom="none">
                                      {/* <Flex direction="row">
                                        <Textarea readOnly>
                                          {message[key]}
                                        </Textarea>
                                      </Flex> */}
                                      <Flex direction="column">
                                        {isDecode === "Default" &&
                                          (<Textarea readOnly value={message[key]} height={"200px"} backgroundColor={"#f4f4f4"} />)
                                        }
                                        {isDecode === "Decode" &&
                                          <Box minHeight={"200px"} height={"300px"} width={"auto"} overflowY="auto" overflowX="hidden" backgroundColor={"#f4f4f4"} borderRadius={"10px"} >
                                            <Flex p={3}>
                                              <DynamicReactJson src={JSON.parse(Buffer.from(message[key], 'base64').toString('utf-8'))} collapsed={1} displayDataTypes={false} />
                                            </Flex>
                                          </Box>
                                        }
                                        <Box width={"20%"} marginTop={"10px"}>
                                          <Select onChange={(e) => handleChange_verify(e)} backgroundColor={"#f4f4f4"}>
                                            {CType.map((option, index) => (
                                              <option key={index} value={option}>
                                                {option}
                                              </option>
                                            ))}
                                          </Select>
                                        </Box>
                                      </Flex>
                                    </Td>
                                  </Tr>
                                );
                              }

                              if (key === "tokenId") {
                                return (
                                  <Tr key={index}>
                                    <Td borderBottom="none">
                                      <Flex direction="column">
                                        <Text>{typeof key === "string" ? formatEng(key) + ':' : key}</Text>
                                      </Flex>
                                    </Td>
                                    <Td borderBottom="none">
                                      <Flex direction="row">
                                        <Text style={{ marginRight: '5px' }}>
                                          {typeof message[key] === "string" ? message[key] : message[key].filter((item: any) => item !== "" && item !== "[]").toString()}
                                        </Text>
                                      </Flex>
                                    </Td>
                                  </Tr>
                                );
                              }

                              if (key === "nftSchemaCode" || key === "nft_schema_code") {
                                return (
                                  <Tr key={index}>
                                    <Td borderBottom="none">
                                      <Flex direction="column">
                                        <Text>{typeof key === "string" ? formatEng(key) + ':' : key}</Text>
                                      </Flex>
                                    </Td>
                                    <Td borderBottom="none">
                                      <Flex direction="row">
                                        <LinkComponent marginRight="5px" _hover={{ textDecoration: "none" }} href={`/schema/${message[key]}`}>
                                          <Text
                                            as={"span"}
                                            decoration={"none"}
                                            color="primary.500"
                                          >
                                            {message[key]}
                                          </Text>
                                        </LinkComponent>
                                      </Flex>
                                    </Td>
                                  </Tr>
                                );
                              }

                              if (key === "parameters") {
                                return (
                                  <Tr key={index}>
                                    <Td display={"flex"} borderBottom="none">
                                      <Flex direction="column">
                                        <Text>{typeof key === "string" ? formatEng(key) + ':' : key}</Text>
                                      </Flex>
                                    </Td>
                                    <Td borderBottom="none">
                                      <Flex direction="column">
                                        {isDecode === "Default" &&
                                          <Text style={{ marginRight: '5px' }}>
                                            {typeof message[key] === "string" ? message[key] : JSON.stringify(message[key])}
                                          </Text>
                                        }
                                        {isDecode === "Decode" &&
                                          <Box minHeight={"200px"} height={"300px"} width={"auto"} overflowY="auto" overflowX="hidden" backgroundColor={"#f4f4f4"} borderRadius={"10px"} >
                                            <Flex p={3}>
                                              <DynamicReactJson src={message[key]} collapsed={1} displayDataTypes={false} />
                                            </Flex>
                                          </Box>
                                        }
                                        <Box width={"20%"} marginTop={"10px"}>
                                          <Select onChange={(e) => handleChange_verify(e)} backgroundColor={"#f4f4f4"}>
                                            {CType.map((option, index) => (
                                              <option key={index} value={option}>
                                                {option}
                                              </option>
                                            ))}
                                          </Select>
                                        </Box>
                                      </Flex>
                                    </Td>
                                  </Tr>
                                );
                              }
                              if (key === "rewards") {
                                const sixAmount = convertStringAmountToCoin(message[key]);
                                return (
                                  <Tr key={index}>
                                    <Td borderBottom="none">
                                      <Flex direction="column">
                                        <Text>{typeof key === "string" ? formatEng(key) + ':' : key}</Text>
                                      </Flex>
                                    </Td>
                                    <Td borderBottom="none">
                                      <Flex direction="row">
                                        <Text style={{ marginRight: '5px' }}>
                                          {sixAmount.amount} {sixAmount.denom}
                                        </Text>
                                      </Flex>
                                    </Td>
                                  </Tr>
                                );
                              }

                              return (
                                <Tr key={index}>
                                  <Td borderBottom="none">
                                    <Flex direction="column">
                                      <Text>{typeof key === "string" ? formatEng(key) + ':' : key}</Text>
                                    </Flex>
                                  </Td>
                                  <Td borderBottom="none">
                                    <Flex direction="row">
                                      <Text style={{ marginRight: '5px' }}>
                                        {typeof message[key] === "string" ? message[key] : JSON.stringify(message[key])}
                                      </Text>
                                    </Flex>
                                  </Td>
                                </Tr>
                              );
                            })}

                            <Tr>
                              <Td borderBottom="none">
                                <Flex direction="column">
                                  <Text>{`Gas:`}</Text>
                                </Flex>
                              </Td>
                              <Td borderBottom="none">
                                <Flex direction="row" alignItems={"center"}>
                                  <Text style={{ marginRight: '5px' }}>{tx.tx_result.gas_used}</Text>
                                  <Center height='23px' style={{ marginRight: '5px' }}>
                                    |
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
                                  <Text style={{ marginRight: '5px' }}>{convertUsixToSix(parseInt(txs.tx_response ? txs.tx_response.gas_wanted : txs.decode_tx.gas_wanted) * 125 / 100)} SIX {price && price.usd ? `($${formatNumber(convertUsixToSix(parseInt(txs.tx_response ? txs.tx_response.gas_wanted : txs.decode_tx.gas_wanted) * 125 / 100) * price.usd)})` : `($999)`}</Text>
                                </Flex>
                              </Td>
                            </Tr>
                          </Tbody>
                        </Table>
                      </TabPanel>

                      {/* ##################### Logs  ##################### */}
                      {txSuccess === true &&
                        <TabPanel>
                          <Table>
                            <Tbody>
                              {Array.isArray(_Logs) && _Logs[0].events !== undefined && _Logs[0].events.map((event: any, index: any) => (

                                <Tr key={index}>
                                  <Td>
                                    <Badge>{event.type}</Badge>
                                  </Td>
                                  <Td>
                                    {event.attributes.map((attr: any, index: any) => {
                                      if (attr.key === "amount") {
                                        const sixAmount = convertStringAmountToCoin(attr.value);
                                        return (
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
                                                <Text>{sixAmount.amount} {sixAmount.denom}{` (${attr.value}) `} </Text>
                                              </Text>
                                            )}

                                          </Flex>
                                        )
                                      }
                                      return (
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
                                              {attr.value.startsWith('6x') ? (
                                                <Text>
                                                  <Clickable href={`/address/${attr.value}`} underline>
                                                    {attr.value}
                                                  </Clickable>
                                                </Text>
                                              ) : attr.value.endsWith('usix') ? (
                                                <Text style={{ display: 'flex' }}>
                                                  {convertUsixToSix(parseInt(attr.value.split('usix')[0]))}
                                                  <Text style={{ marginLeft: '5px' }}> SIX</Text>
                                                </Text>
                                              ) : attr.value.endsWith('asix') ? (
                                                <Text style={{ display: 'flex' }}>
                                                  {convertAsixToSix(parseInt(attr.value.split('usix')[0]))}
                                                  <Text style={{ marginLeft: '5px' }}> WrapSIX</Text>
                                                </Text>
                                              )
                                                : (
                                                  <Text>{attr.value}</Text>
                                                )}
                                            </Text>
                                          )}

                                        </Flex>
                                      )
                                    })}
                                  </Td>
                                </Tr>
                              ))}
                            </Tbody>
                          </Table>
                        </TabPanel>
                      }
                      {/* ///// log fail //// */}
                      {txSuccess === false &&
                        <TabPanel>
                          <Table>
                            <Tbody>
                              <Tr>
                                <Td borderBottom="none">
                                  <Badge colorScheme={"red"}>Fail</Badge>
                                </Td>
                                <Td borderBottom="none">
                                  <Text> {_Logs} </Text>
                                </Td>
                              </Tr>
                            </Tbody>
                          </Table>
                        </TabPanel>
                      }

                      {/* ##################### Events  ##################### */}
                      <TabPanel>
                        <Table>
                          <Tbody>
                            {Array.isArray(_Events) && _Events.map((event: any, index: any) => (
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
      </Flex >
    );
  } else if (!block_evm && isMultimessage) {
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
                Transaction Details (Multi Messages)({allMultimessage.length})
              </Text>
              <Divider />
            </Flex>
          </Container>
        </Box>

        {allMultimessage.map((message: any, index: any) => {
          console.log(message["amount"]);

          return (
            <Box p={6} key={index}>
              <Container maxW="container.xl">
                <Flex direction={"column"} gap={6}>
                  <CustomCard>
                    <TableContainer>
                      <Tabs isLazy>
                        <TabList>
                          <Tab>Overview</Tab>
                          <Tab>Logs({Array.isArray(_Logs) && _Logs[0].events !== undefined ? _Logs[0].events.length : "1"})</Tab>
                          <Tab>Events({Array.isArray(_Events) && _Events.length})</Tab>
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
                                    <Flex direction="row">
                                      <Text marginRight="6px">{txs.tx_response.txhash}</Text>
                                      <CopyIcon onClick={() => navigator.clipboard.writeText(txs.tx_response.txhash)} />
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
                                        {txSuccess === true ?
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
                                        <Clickable href={`/block/${tx.height}`}>
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

                                {KeyMsg.map((key: any, index) => {
                                  // {console.log(key)}
                                  if (typeof message[key] === "string" && message[key].startsWith("6x")) {
                                    if (key === "from_address") {
                                      return (
                                        <Tr key={index}>
                                          <Td borderBottom="none">
                                            <Flex direction="column">
                                              <Text>{typeof key === "string" ? formatBank(key) : key}</Text>
                                            </Flex>
                                          </Td>
                                          <Td borderBottom="none">
                                            <Flex direction="row">
                                              <Clickable
                                                href={`/address/${message[key]}`}
                                              >
                                                {message[key]}
                                              </Clickable>
                                              <CopyIcon marginLeft="5px" onClick={() => navigator.clipboard.writeText(message[key])} />
                                            </Flex>
                                          </Td>
                                        </Tr>
                                      );
                                    }

                                    return (
                                      <Tr key={index}>
                                        <Td>
                                          <Flex direction="column">
                                            <Text>{typeof key === "string" ? formatBank(key) + ':' : key}</Text>
                                          </Flex>
                                        </Td>
                                        <Td>
                                          <Flex direction="row">
                                            {key != "ref_id" &&
                                              <Text style={{ marginRight: '5px' }}>
                                                <Clickable
                                                  href={`/address/${message[key]}`}
                                                >
                                                  {message[key]}
                                                </Clickable>
                                                <CopyIcon marginLeft="5px" onClick={() => navigator.clipboard.writeText(message[key])} />
                                              </Text>
                                            }
                                            {key === "ref_id" &&
                                              <Text style={{ marginRight: '5px' }}>
                                                {message[key]}
                                              </Text>
                                            }
                                          </Flex>
                                        </Td>
                                      </Tr>
                                    );
                                  } else if (key == "amount") {
                                    return (
                                      <Tr key={index}>
                                        <Td borderBottom="none">
                                          <Flex direction="column">
                                            <Text>{`Value:`}</Text>
                                          </Flex>
                                        </Td>
                                        <Td borderBottom="none">
                                          <Flex direction="row">
                                            <Image src="/six.png" alt="coin" height={20} width={20} style={{ marginRight: '5px' }} />
                                            <Text style={{ marginRight: '5px' }} >{convertAmountToSix(message[key][0])} SIX </Text>
                                            <Text style={{ color: '#6c757d' }} >{price && price.usd ? `($${formatNumber(5 * price.usd)})` : `($999)`}</Text>
                                          </Flex>
                                        </Td>
                                      </Tr>
                                    )
                                  }
                                  if (key === "receiver") {
                                    return (
                                      <Tr key={index}>
                                        <Td borderBottom="none">
                                          <Flex direction="column">
                                            <Text>{typeof key === "string" ? formatBank(key) + ':' : key}</Text>
                                          </Flex>
                                        </Td>
                                        <Td borderBottom="none">
                                          <Flex direction="row">
                                            <LinkComponent marginRight="5px" href={`${ENV.BLOCK_SCOUT_API_URL}/address/${message[key]}`}>
                                              <Text
                                                as={"span"}
                                                decoration={"none"}
                                                color="primary.500"
                                              >
                                                {message[key]}
                                              </Text>
                                            </LinkComponent>
                                            <CopyIcon onClick={() => navigator.clipboard.writeText(message[key])} />
                                          </Flex>
                                        </Td>
                                      </Tr>
                                    );
                                  }

                                  // if (key === "nftSchemaBase64") {
                                  //   return (
                                  //     <Tr key={index}>
                                  //       <Td borderBottom="none">
                                  //         <Flex direction="column">
                                  //           <Text>{typeof key === "string" ? formatBank(key) + ':' : key}</Text>
                                  //         </Flex>
                                  //       </Td>
                                  //       <Td borderBottom="none">
                                  //         <Flex direction="row">
                                  //           <Textarea readOnly>
                                  //             {message[key]}
                                  //           </Textarea>
                                  //         </Flex>
                                  //       </Td>
                                  //     </Tr>
                                  //   );
                                  // }

                                  if (key === "data") {
                                    return (
                                      <Tr key={index}>
                                        <Td borderBottom="none">
                                          <Flex direction="column">
                                            <Text>{typeof key === "string" ? formatBank(key) + ':' : key}</Text>
                                          </Flex>
                                        </Td>
                                        <Td borderBottom="none">
                                          <Flex direction="row">
                                            {/* <CustomCard> */}
                                            <TableContainer>
                                              <Tabs isLazy>
                                                <TabList>
                                                  {Object.keys(message[key]).map((keys: any, index) => {
                                                    return (
                                                      <Tab key={index}>{keys}</Tab>
                                                    );
                                                  })}
                                                </TabList>
                                                <TabPanels>
                                                  {Object.values(message[key]).map((data: any, i) => {
                                                    return (
                                                      <TabPanel key={i}>
                                                        <Textarea readOnly value={data} />
                                                      </TabPanel>
                                                    );
                                                  })}
                                                </TabPanels>
                                              </Tabs>
                                            </TableContainer>
                                            {/* </CustomCard> */}
                                          </Flex>
                                        </Td>
                                      </Tr>
                                    );
                                  }
                                  if (key === "hash") {
                                    return (
                                      <Tr key={index}>
                                        <Td borderBottom="none">
                                          <Flex direction="column">
                                            <Text>{typeof key === "string" ? formatBank(key) + ':' : key}</Text>
                                          </Flex>
                                        </Td>
                                        <Td borderBottom="none">
                                          <Flex direction="row">
                                            <LinkComponent marginRight="5px" href={`${ENV.BLOCK_SCOUT_API_URL}/address/${message[key]}`}>
                                              <Text
                                                as={"span"}
                                                decoration={"none"}
                                                color="primary.500"
                                              >
                                                {message[key]}
                                              </Text>
                                            </LinkComponent>
                                            <CopyIcon onClick={() => navigator.clipboard.writeText(message[key])} />
                                          </Flex>
                                        </Td>
                                      </Tr>
                                    );
                                  }

                                  if (key === "base64NFTData" || key === "nftSchemaBase64" ||
                                    key === "base64NewAttriuteDefenition" || key === "base64NewAction" ||
                                    key === "base64_nft_attribute_value" || key === "base64ActionSignature" ||
                                    key === "base64VerifyRequestorSignature" || key === "base64OriginContractInfo"
                                  ) {
                                    return (
                                      <Tr key={index}>
                                        <Td borderBottom="none" display={"flex"}>
                                          <Flex>
                                            <Text>{typeof key === "string" ? formatBank(key) + ':' : key}</Text>
                                          </Flex>
                                        </Td>
                                        <Td borderBottom="none">
                                          <Flex direction="column">
                                            {isDecode === 'Default' &&
                                              (<Textarea readOnly value={message[key]} height={"200px"} backgroundColor={"#f4f4f4"} />)
                                            }
                                            {isDecode === 'Decode' &&
                                              <Box minHeight={"200px"} height={"300px"} width={"auto"} overflowY="auto" overflowX="hidden" backgroundColor={"#f4f4f4"} borderRadius={"10px"} >
                                                <Flex p={3}>
                                                  <DynamicReactJson src={JSON.parse(Buffer.from(message[key], 'base64').toString('utf-8'))} collapsed={1} displayDataTypes={false} />
                                                </Flex>
                                              </Box>
                                            }
                                            <Box width={"20%"} marginTop={"10px"}>
                                              <Select onChange={(e) => handleChange_verify(e)} backgroundColor={"#f4f4f4"}>
                                                {CType.map((option, index) => (
                                                  <option key={index} value={option}>
                                                    {option}
                                                  </option>
                                                ))}
                                              </Select>
                                            </Box>
                                          </Flex>
                                        </Td>
                                      </Tr>
                                    );
                                  }

                                  if (key === "base64EncodedSetSignerAction") {
                                    return (
                                      <Tr key={index}>
                                        <Td borderBottom="none">
                                          <Flex direction="column">
                                            <Text>{typeof key === "string" ? formatBank(key) + ':' : key}</Text>
                                          </Flex>
                                        </Td>
                                        <Td borderBottom="none">
                                          {/* <Flex direction="row">
                                        <Textarea readOnly>
                                          {message[key]}
                                        </Textarea>
                                      </Flex> */}
                                          <Flex direction="column">
                                            {isDecode === "Default" &&
                                              (<Textarea readOnly value={message[key]} height={"200px"} backgroundColor={"#f4f4f4"} />)
                                            }
                                            {isDecode === "Decode" &&
                                              <Box minHeight={"200px"} height={"300px"} width={"auto"} overflowY="auto" overflowX="hidden" backgroundColor={"#f4f4f4"} borderRadius={"10px"} >
                                                <Flex p={3}>
                                                  <DynamicReactJson src={JSON.parse(Buffer.from(message[key], 'base64').toString('utf-8'))} collapsed={1} displayDataTypes={false} />
                                                </Flex>
                                              </Box>
                                            }
                                            <Box width={"20%"} marginTop={"10px"}>
                                              <Select onChange={(e) => handleChange_verify(e)} backgroundColor={"#f4f4f4"}>
                                                {CType.map((option, index) => (
                                                  <option key={index} value={option}>
                                                    {option}
                                                  </option>
                                                ))}
                                              </Select>
                                            </Box>
                                          </Flex>
                                        </Td>
                                      </Tr>
                                    );
                                  }

                                  if (key === "tokenId") {
                                    return (
                                      <Tr key={index}>
                                        <Td borderBottom="none">
                                          <Flex direction="column">
                                            <Text>{typeof key === "string" ? formatEng(key) + ':' : key}</Text>
                                          </Flex>
                                        </Td>
                                        <Td borderBottom="none">
                                          <Flex direction="row">
                                            <Text style={{ marginRight: '5px' }}>
                                              {typeof message[key] === "string" ? message[key] : message[key].filter((item: any) => item !== "" && item !== "[]").toString()}
                                            </Text>
                                          </Flex>
                                        </Td>
                                      </Tr>
                                    );
                                  }

                                  if (key === "nftSchemaCode" || key === "nft_schema_code") {
                                    return (
                                      <Tr key={index}>
                                        <Td borderBottom="none">
                                          <Flex direction="column">
                                            <Text>{typeof key === "string" ? formatEng(key) + ':' : key}</Text>
                                          </Flex>
                                        </Td>
                                        <Td borderBottom="none">
                                          <Flex direction="row">
                                            <LinkComponent marginRight="5px" _hover={{ textDecoration: "none" }} href={`/schema/${message[key]}`}>
                                              <Text
                                                as={"span"}
                                                decoration={"none"}
                                                color="primary.500"
                                              >
                                                {message[key]}
                                              </Text>
                                            </LinkComponent>
                                          </Flex>
                                        </Td>
                                      </Tr>
                                    );
                                  }

                                  if (key === "parameters") {
                                    return (
                                      <Tr key={index}>
                                        <Td display={"flex"} borderBottom="none">
                                          <Flex direction="column">
                                            <Text>{typeof key === "string" ? formatEng(key) + ':' : key}</Text>
                                          </Flex>
                                        </Td>
                                        <Td borderBottom="none">
                                          <Flex direction="column">
                                            {isDecode === "Default" &&
                                              <Text style={{ marginRight: '5px' }}>
                                                {typeof message[key] === "string" ? message[key] : JSON.stringify(message[key])}
                                              </Text>
                                            }
                                            {isDecode === "Decode" &&
                                              <Box minHeight={"200px"} height={"300px"} width={"auto"} overflowY="auto" overflowX="hidden" backgroundColor={"#f4f4f4"} borderRadius={"10px"} >
                                                <Flex p={3}>
                                                  <DynamicReactJson src={message[key]} collapsed={1} displayDataTypes={false} />
                                                </Flex>
                                              </Box>
                                            }
                                            <Box width={"20%"} marginTop={"10px"}>
                                              <Select onChange={(e) => handleChange_verify(e)} backgroundColor={"#f4f4f4"}>
                                                {CType.map((option, index) => (
                                                  <option key={index} value={option}>
                                                    {option}
                                                  </option>
                                                ))}
                                              </Select>
                                            </Box>
                                          </Flex>
                                        </Td>
                                      </Tr>
                                    );
                                  }

                                  return (
                                    <Tr key={index}>
                                      <Td borderBottom="none">
                                        <Flex direction="column">
                                          <Text>{typeof key === "string" ? formatEng(key) + ':' : key}</Text>
                                        </Flex>
                                      </Td>
                                      <Td borderBottom="none">
                                        <Flex direction="row">
                                          <Text style={{ marginRight: '5px' }}>
                                            {typeof message[key] === "string" ? message[key] : JSON.stringify(message[key])}
                                          </Text>
                                        </Flex>
                                      </Td>
                                    </Tr>
                                  );
                                })}

                                <Tr>
                                  <Td borderBottom="none">
                                    <Flex direction="column">
                                      <Text>{`Gas:`}</Text>
                                    </Flex>
                                  </Td>
                                  <Td borderBottom="none">
                                    <Flex direction="row" alignItems={"center"}>
                                      <Text style={{ marginRight: '5px' }}>{tx.tx_result.gas_used}</Text>
                                      <Center height='23px' style={{ marginRight: '5px' }}>
                                        |
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
                              </Tbody>
                            </Table>
                          </TabPanel>

                          {/* ##################### Logs  ##################### */}
                          {txSuccess === true &&
                            <TabPanel>
                              <Table>
                                <Tbody>
                                  {Array.isArray(_Logs) && _Logs[0].events !== undefined && _Logs[0].events.map((event: any, index: any) => (

                                    <Tr key={index}>
                                      <Td>
                                        <Badge>{event.type}</Badge>
                                      </Td>
                                      <Td>
                                        {event.attributes.map((attr: any, index: any) => {
                                          if (attr.key === "amount") {
                                            const sixAmount = convertStringAmountToCoin(attr.value);
                                            return (
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
                                                    <Text>{sixAmount.amount} {sixAmount.denom}{` (${attr.value}) `} </Text>
                                                  </Text>
                                                )}

                                              </Flex>
                                            )
                                          }
                                          return (
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
                                                  {attr.value.startsWith('6x') ? (
                                                    <Text>
                                                      <Clickable href={`/address/${attr.value}`} underline>
                                                        {attr.value}
                                                      </Clickable>
                                                    </Text>
                                                  ) : attr.value.endsWith('usix') ? (
                                                    <Text style={{ display: 'flex' }}>
                                                      {convertUsixToSix(parseInt(attr.value.split('usix')[0]))}
                                                      <Text style={{ marginLeft: '5px' }}> SIX</Text>
                                                    </Text>
                                                  ) : attr.value.endsWith('asix') ? (
                                                    <Text style={{ display: 'flex' }}>
                                                      {convertAsixToSix(parseInt(attr.value.split('usix')[0]))}
                                                      <Text style={{ marginLeft: '5px' }}> WrapSIX</Text>
                                                    </Text>
                                                  )
                                                    : (
                                                      <Text>{attr.value}</Text>
                                                    )}
                                                </Text>
                                              )}

                                            </Flex>
                                          )
                                        })}
                                      </Td>
                                    </Tr>
                                  ))}
                                </Tbody>
                              </Table>
                            </TabPanel>
                          }
                          {/* ///// log fail //// */}
                          {txSuccess === false &&
                            <TabPanel>
                              <Table>
                                <Tbody>
                                  <Tr>
                                    <Td borderBottom="none">
                                      <Badge colorScheme={"red"}>Fail</Badge>
                                    </Td>
                                    <Td borderBottom="none">
                                      <Text> {_Logs} </Text>
                                    </Td>
                                  </Tr>
                                </Tbody>
                              </Table>
                            </TabPanel>
                          }

                          {/* ##################### Events  ##################### */}
                          <TabPanel>
                            <Table>
                              <Tbody>
                                {Array.isArray(_Events) && _Events.map((event: any, index: any) => (
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
          )
        })}


        <Spacer />
      </Flex >
    )
  } else {
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
    tx = await getTxByHashFromRPC(txhash);
    txs = await getTxsByHashFromAPI(txhash);
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
