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

import { LinkComponent } from "@/components/Chakralink";

import { Clickable } from "@/components/Clickable";
import { validateContract } from "@/libs/utils/validate";
import { useEffect, useState } from "react";

// ------------------------- Helper Libs -------------------------

import {
  getSchemaByContractAddress,
  getSchemaByAddress,
} from "@/service/nftmngr/schema";

interface Props {
  address: address;
  pageNumber: string;
}
interface address {
  data: {
    _id: string;
    schema_code: string;
    origin_contract_address: string;
  }[];
  totalRecords: number;
}

export default function Address({ address, pageNumber }: Props) {
  const [isCopied, setIsCopied] = useState(false);
  const [totalValue, setTotalValue] = useState(0);
  let totalValueTmp = 0;
  const isAddress = address.data[0]?.origin_contract_address;

  const handleCopyClick = () => {
    navigator.clipboard.writeText(address.data[0]?.origin_contract_address);
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
  const totalPages = Math.ceil(address.totalRecords / 15);

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
                  Contract Address:
                </Text>
                <Text fontWeight="bold" color={address ? "medium" : "error"}>
                  {address.data
                    ? address.data[0]?.origin_contract_address
                    : "Invalid Address"}
                </Text>
                {address && address.data && (
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
                        <Tab>Schema</Tab>
                        <Spacer />
                        {Array.isArray(address.data) && (
                          <Flex direction="row" gap={2} align="center" px="2">
                            <Button
                              variant={"solid"}
                              size="xs"
                              href={`/contract/${isAddress}?page=1`}
                              as={LinkComponent}
                              isDisabled={parseInt(pageNumber) === 1}
                            >
                              First
                            </Button>
                            <Button
                              size="xs"
                              href={`/contract/${isAddress}?page=${
                                parseInt(pageNumber) - 1
                              }`}
                              as={LinkComponent}
                              isDisabled={parseInt(pageNumber) === 1}
                            >
                              <FaArrowLeft fontSize={12} />
                            </Button>
                            <Text fontSize="xs">
                              {`Page ${pageNumber} of ${totalPages}`}
                            </Text>
                            <Button
                              size="xs"
                              href={`/contract/${isAddress}?page=${
                                parseInt(pageNumber) + 1
                              }`}
                              as={LinkComponent}
                              isDisabled={parseInt(pageNumber) === totalPages}
                            >
                              <FaArrowRight fontSize={12} />
                            </Button>
                            <Button
                              size="xs"
                              href={`/contract/${isAddress}?page=${totalPages}`}
                              as={LinkComponent}
                              isDisabled={totalPages === parseInt(pageNumber)}
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
                              {`A total of ${
                                address.totalRecords
                                  ? address.totalRecords
                                  : "0"
                              } schema found.`}
                            </Text>
                          </Flex>
                          <TableContainer>
                            <Table>
                              <Thead>
                                <Tr>
                                  <Td>
                                    <Text>No.</Text>
                                  </Td>
                                  <Td>
                                    <Text>Schema Code</Text>
                                  </Td>
                                </Tr>
                              </Thead>
                              <Tbody>
                                {Array.isArray(address.data) &&
                                  address.data.map(
                                    (schema: any, index: number) => (
                                      <Tr key={index}>
                                        <Td>
                                          <Text>{index + 1}</Text>
                                        </Td>
                                        <Td>
                                          <Clickable
                                            href={`/schema/${schema.schema_code}`}
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
                                              {schema.schema_code}
                                            </Text>
                                          </Clickable>
                                        </Td>
                                      </Tr>
                                    )
                                  )}
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

export const getServerSideProps = async ({
  params: { contract },
  query: { page = "1" },
}: {
  params: { contract: string };
  query: { page: string };
}) => {
  const isAddressValid = await validateContract(contract);
  if (!isAddressValid) {
    return {
      props: {
        account: null,
      },
    };
  }
  const [address] = await Promise.all([
    getSchemaByContractAddress(contract, page ? page : "1", "15"),
  ]);
  const pageNumber = page;
  return {
    props: {
      address,
      pageNumber,
    },
  };
};
