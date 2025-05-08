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

import { useEffect, useState } from "react";

// ------------------------- Helper Libs -------------------------
import { formatSchemaName } from "@/libs/utils/format";
import { getSchemaByCodeAddr2, getAllSchema } from "@/service/nftmngr/schema";
import styles from "@/styles/schema_hover.module.css";
import { useRouter } from "next/router";

interface Props {
  schema: any;
  pageNumber: string;
}

export default function Schema({ pageNumber, schema }: Props) {
  const [isCopied, setIsCopied] = useState(false);
  const [totalValue, setTotalValue] = useState(0);
  let totalValueTmp = 0;
  // const handleCopyClick = () => {
  //     if (Array.isArray(address) && address.length > 0) {
  //         navigator.clipboard.writeText(address[0]?.originContractAddress);
  //     }
  //     setIsCopied(true);
  //     setTimeout(() => {
  //         setIsCopied(false);
  //     }, 1000);
  // };
  const router = useRouter();

  const addValueToTotalValue = (value: number) => {
    totalValueTmp += value;
    return value;
  };

  const calculateIndex = (index: number) => {
    return (parseInt(pageNumber) - 1) * 15 + index + 1;
  };

  useEffect(() => {
    setTotalValue(totalValueTmp);
  }, [totalValue, totalValueTmp]);

  const totalPages = Math.ceil(schema.totalRecords / 15);
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
                  All Schema:
                </Text>
              </Flex>
              <Divider />
              {!schema && <Text color="error">NOT FOUND</Text>}
            </Flex>
          </Container>
        </Box>
        <Box p={6}>
          <Container maxW="container.xl">
            <Grid templateColumns="repeat(12, 1fr)" gap={6}>
              {schema && (
                <GridItem colSpan={12}>
                  <CustomCard>
                    <Tabs isLazy>
                      <TabList>
                        <Tab>Schema</Tab>
                        <Spacer />
                        {Array.isArray(schema.data) && (
                          <Flex direction="row" gap={2} align="center" px="2">
                            <Button
                              variant={"solid"}
                              size="xs"
                              href={`/schemas?page=1`}
                              as={LinkComponent}
                              isDisabled={parseInt(pageNumber) === 1}
                            >
                              First
                            </Button>
                            <Button
                              size="xs"
                              href={`/schemas?page=${parseInt(pageNumber) - 1}`}
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
                              href={`/schemas?page=${parseInt(pageNumber) + 1}`}
                              as={LinkComponent}
                              isDisabled={parseInt(pageNumber) === totalPages}
                            >
                              <FaArrowRight fontSize={12} />
                            </Button>
                            <Button
                              size="xs"
                              href={`/schemas?page=${totalPages}`}
                              as={LinkComponent}
                              isDisabled={totalPages === schema.totalRecords}
                            >
                              Last
                            </Button>
                          </Flex>
                        )}
                        {/* <Pagination
                                                    currentPage={currentPage}
                                                    totalPages={totalPages}
                                                    onPageChange={handlePageChange}
                                                /> */}
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
                                schema.totalRecords ? schema.totalRecords : "0"
                              } schema found.`}
                            </Text>
                          </Flex>
                          <TableContainer>
                            <Table>
                              <Thead>
                                <Tr>
                                  <Td textAlign={"center"}>
                                    <Text>No.</Text>
                                  </Td>
                                  <Td textAlign={"center"}>
                                    <Text>Schema Name</Text>
                                  </Td>
                                  <Td textAlign={"center"}>
                                    <Text>Schema Code</Text>
                                  </Td>
                                </Tr>
                              </Thead>
                              <Tbody>
                                {schema.data.map(
                                  (schema: any, index: number) => (
                                    <Tr
                                      key={index}
                                      className={styles["hover-row"]}
                                      onClick={() =>
                                        router.push(
                                          `/schema/${schema.schema_code}`
                                        )
                                      }
                                    >
                                      <Td textAlign={"center"}>
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
                                            {calculateIndex(index)}
                                          </Text>
                                        </Clickable>
                                      </Td>
                                      <Td textAlign={"center"}>
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
                                            {formatSchemaName(
                                              schema.schema_code
                                            )}
                                          </Text>
                                        </Clickable>
                                      </Td>
                                      <Td textAlign={"center"}>
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
  query: { page = "1" },
}: {
  query: { page: string };
}) => {
  const [schema] = await Promise.all([getAllSchema(page ? page : "1", "15")]);
  const pageNumber = page;

  if (!schema) {
    return {
      props: {
        schema: null,
      },
    };
  }

  return {
    props: {
      schema,
      pageNumber,
    },
  };
};
