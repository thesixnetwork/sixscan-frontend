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
import { Footer } from "@/components/Footer";
import { Clickable } from "@/components/Clickable";

const formatNumber = (num: number) => {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
};

export default function Tx() {
  return (
    <Flex minHeight={"100vh"} direction={"column"}>
      <Head>
        <title>SIXSCAN</title>
        <meta name="description" content="SIXSCAN" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NavBar />
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
                          <Text>
                            {`0xbaf0c6a2e0de12d760af3095fae9dec76d024307976c33a487f225b3c91c4128`}
                          </Text>
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
                            <Badge variant={"solid"} colorScheme={"green"}>
                              {`Success`}
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
                            <Clickable underline href="/">
                              56782
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
                          <Text>
                            40 secs ago (Feb-21-2023 04:55:47 AM +UTC)
                          </Text>
                        </Flex>
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>
                        <Flex direction="column">
                          <Text>{`From:`}</Text>
                        </Flex>
                      </Td>
                      <Td>
                        <Flex direction="column">
                          <Text>
                            <Clickable underline href="/">
                              0xd2090025857b9c7b24387741f120538e928a3a59
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
                        <Flex direction="column">
                          <Text>
                            <Clickable underline href="/">
                              0x4675c7e5baafbffbca748158becba61ef3b0a263
                            </Clickable>
                          </Text>
                        </Flex>
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>
                        <Flex direction="column">
                          <Text>{`Value:`}</Text>
                        </Flex>
                      </Td>
                      <Td>
                        <Flex direction="column">
                          <Text>100 SIX</Text>
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
                        <Flex direction="column">
                          <Text>0.1 SIX</Text>
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
                        <Flex direction="column">
                          <Text>0.1 SIX</Text>
                        </Flex>
                      </Td>
                    </Tr>
                  </Tbody>
                </Table>
              </TableContainer>
            </CustomCard>
            <CustomCard title={"Data Layer"}>
              <TableContainer>
                <Table>
                  <Tbody>
                    <Tr>
                      <Td>
                        <Flex direction="column">
                          <Text>{`Schema:`}</Text>
                        </Flex>
                      </Td>
                      <Td>
                        <Flex direction="row" gap={2} alignItems="center">
                          <Text>
                            <Clickable underline href="/">
                              sixnetwork.whalegate
                            </Clickable>
                          </Text>
                        </Flex>
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>
                        <Flex direction="column">
                          <Text>{`Token ID:`}</Text>
                        </Flex>
                      </Td>
                      <Td>
                        <Flex direction="row" gap={2} alignItems="center">
                          <Text>
                            <Clickable underline href="/">
                              1
                            </Clickable>
                          </Text>
                        </Flex>
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>
                        <Flex direction="column">
                          <Text>{`Updated Data:`}</Text>
                        </Flex>
                      </Td>
                      <Td>
                        <Flex direction="row" gap={2} alignItems="center">
                          <Text fontWeight={"bold"}>check_in:</Text>
                          <Text>true</Text>
                          <FaArrowRight fontSize={12} />
                          <Text>false</Text>
                        </Flex>
                        <Flex direction="row" gap={2} alignItems="center">
                          <Text fontWeight={"bold"}>check_in:</Text>
                          <Text>true</Text>
                          <FaArrowRight fontSize={12} />
                          <Text>false</Text>
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
      <Spacer />
      <Footer />
    </Flex>
  );
}

const getTx = async (txhash: string) => {
  return {
    txhash,
  };
};

const getServerSideProps = async (context: { params: { txhash: any } }) => {
  const { txhash } = context.params;
  const tx = await getTx(txhash);
  return {
    props: {
      tx,
    },
  };
};
