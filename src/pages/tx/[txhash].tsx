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
  Spacer,
  Button,
} from "@chakra-ui/react";
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
import { getTxFromHash, getTxEVMFromHash } from "@/service/txs";
import { getBlockEVM } from "@/service/block";
import { Transaction } from "@/types/Txs";
import { useRouter } from "next/router";

import { formatNumber, convertAsixToSix } from "@/utils/format";
import { getPriceFromCoingecko } from "@/service/coingecko";
import { CoinGeckoPrice } from "@/types/Coingecko";


export default function Tx({ tx, txs }: { tx: Transaction, txs: Transaction }) {
  const router = useRouter();
  
  ////// Get Price SIX ///////
  const [price, setPrice] = useState<CoinGeckoPrice | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => setIsOpen(!isOpen);

  useEffect(() => {
    // async function fetchPrice() {
    const fetchPrice = async () => {
      setPrice(await getPriceFromCoingecko("six-network"));
    };

    fetchPrice();
  }, []);
  console.log(txs)
  ///////////////////////////////

  if (!tx && !txs) {
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

  if (!txs) {
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
                <Table>
                  <Tbody>
                    <Tr>
                      <Td>
                        <Flex direction="column">
                          <Text>{`Transaction Hash:`}</Text>
                        </Flex>
                      </Td>
                      <Td>
                        <Flex direction="column">
                          <Text>{tx.hash}</Text>
                        </Flex>
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>
                        <Flex direction="column">
                          <Text>{`Status:`}</Text>
                        </Flex>
                      </Td>
                      <Td>
                        <Flex direction="column">
                          <Text>
                            <Badge colorScheme={"green"}>
                              {tx.tx_result.code === 0 ? "Success" : "Failed"}
                            </Badge>
                          </Text>
                        </Flex>
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>
                        <Flex direction="column">
                          <Text>{`Block:`}</Text>
                        </Flex>
                      </Td>
                      <Td>
                        <Flex direction="column">
                          <Text>
                            <Clickable underline href={`/block/${tx.height}`}>
                              {tx.height}
                            </Clickable>
                          </Text>
                        </Flex>
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>
                        <Flex direction="column">
                          <Text>{`Gas Used:`}</Text>
                        </Flex>
                      </Td>
                      <Td>
                        <Flex direction="column">
                          <Text>{tx.tx_result.gas_used}</Text>
                        </Flex>
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>
                        <Flex direction="column">
                          <Text>{`Gas Wanted:`}</Text>
                        </Flex>
                      </Td>
                      <Td>
                        <Flex direction="column">
                          <Text>{tx.tx_result.gas_wanted}</Text>
                        </Flex>
                      </Td>
                    </Tr>
                  </Tbody>
                </Table>
              </TableContainer>
            </CustomCard>
            <CustomCard title={"Events"}>
              <TableContainer>
                <Table>
                  <Tbody>
                    {tx.tx_result.events.map((event, index) => (
                      <Tr key={index}>
                        <Td>
                          <Badge>{event.type}</Badge>
                        </Td>
                        <Td>
                          {event.attributes.map((attr, index) => (
                            <Flex
                              direction="row"
                              gap={2}
                              alignItems="center"
                              key={index}
                            >
                              {attr.key && (
                                <Text>
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
              </TableContainer>
            </CustomCard>
          </Flex>
        </Container>
      </Box>
      <Spacer />
    </Flex>
  );} else {

    //////////////////// Txs EVM  /////////////////////////
    return(
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
                        <Flex direction="column">
                          <Text>{txs.transactions[0].hash}</Text>
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
                              {txs.transactions[0].transactionIndex === null ? "Failed" : "Success"}
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
                            <Clickable underline href={`/block/${parseInt(txs.number, 16)}`}>
                              {parseInt(txs.number, 16)}
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
                                  parseInt(txs.timestamp, 16) * 1000
                                ).fromNow()} (${moment(
                                  parseInt(txs.timestamp, 16) * 1000
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
                          <Text>{txs.transactions[0].from}</Text>
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
                        <Flex direction="column">
                          <Text>{txs.transactions[0].to}</Text>
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
                          <Image src="/six.png" alt="coin" height={20} width={20} style={{marginRight: '5px'}} />
                          <Text style={{marginRight: '5px'}} >{convertAsixToSix(parseInt(txs.transactions[0].value, 16))} SIX </Text>
                          <Text style={{color: '#6c757d'}} >(${formatNumber(convertAsixToSix(parseInt(txs.transactions[0].value, 16)) * price?.usd)})</Text>
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
                          <Text style={{marginRight: '5px'}} >{convertAsixToSix(parseInt(txs.transactions[0].value, 16))} SIX </Text>
                        </Flex>
                      </Td>
                    </Tr>
                    <Tr>
                      <Td borderBottom="none">
                        <Flex direction="column">
                          <Text>{`Gas Used:`}</Text>
                        </Flex>
                      </Td>
                      <Td borderBottom="none">
                        <Flex direction="column">
                          <Text>{parseInt(txs.transactions[0].gas, 16)}</Text>
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
                          <Text style={{marginRight: '5px'}} >{convertAsixToSix(parseInt(txs.transactions[0].gasPrice, 16))} SIX</Text>
                          <Text style={{color: '#6c757d'}} >(${formatNumber(convertAsixToSix(parseInt(txs.transactions[0].gasPrice, 16)) * price?.usd)})</Text>
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
                          <Text>{parseInt(txs.gasLimit, 16)} | {parseInt(txs.transactions[0].gas, 16)} ({((parseInt(txs.transactions[0].gas, 16) / parseInt(txs.gasLimit, 16)) * 100).toFixed(2)}%)</Text>
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
                          <Badge>Txn Type: {parseInt(txs.transactions[0].type, 16)}(EIP-2718)</Badge>
                          <Badge>Nonce: {parseInt(txs.transactions[0].nonce, 16)}</Badge>
                          <Badge>Position: {parseInt(txs.transactions[0].transactionIndex, 16)}</Badge>                            
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
                        <Card style={{ resize: "both", overflow: "auto", minHeight: "50px", minWidth: "680px", backgroundColor:"#f8f9fa", borderRadius:"10px"  }}>
                          <CardBody>
                            <Text>{txs.transactions[0].input}</Text>
                          </CardBody>
                        </Card>
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

      <Box p={6}>
        <Container maxW="container.xl">
          <Flex direction={"column"} gap={6}>
            <CustomCard>
              <Accordion allowMultiple maxW="container.xl">
                <AccordionItem>
                  
                <AccordionPanel pb={4}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                    veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                    commodo consequat.
                  </AccordionPanel>

                    <AccordionButton onClick={handleClick}>
                      <Box p={6}>
                        More Details: 
                        {isOpen ? 'Click to see Less' : 'Click to see More'}
                      </Box>
                      <AccordionIcon />
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
  let txss;
  let txs;
  if (txhash.startsWith('0x')) {
    txss = await getTxEVMFromHash(txhash);
  } else {
    tx = await getTxFromHash(txhash);
  }
  if (!tx) {
    tx = null;
  }
  if (txss != undefined ) {
    txs = await getBlockEVM(txss.blockNumber);
  }
  if (!txs) {
    txs = null;
  }
  return {
    props: {
      tx,
      txs,
    },
  };
};
