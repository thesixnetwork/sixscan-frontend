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

import { Clickable } from "@/components/Clickable";
import { getTxFromHash } from "@/service/txs";
import { Transaction } from "@/types/Txs";
import { useRouter } from "next/router";

export default function Tx({ tx }: { tx: Transaction }) {
  const router = useRouter();
  if (!tx) {
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
  );
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
  const tx = await getTxFromHash(txhash);
  return {
    props: {
      tx,
    },
  };
};
