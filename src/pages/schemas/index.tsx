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
import { formatHex } from "@/utils/format";
import { validateContract } from "@/utils/validate";
import { useEffect, useState } from "react";
import { getValidator } from "@/service/staking";
import { Validator } from "@/types/Staking";
import { Balance } from "@/types/Bank";
// ------------------------- Helper Libs -------------------------
import moment from "moment";
import { getAccount } from "@/service/auth";
import { Account } from "@/types/Auth";
import { getBalance, getBalances } from "@/service/bank";
import { formatNumber, convertUsixToSix } from "@/utils/format";
import { getAllTransactionByAddress } from "@/service/nftmngr";

import { getPriceFromCoingecko } from "@/service/coingecko";
import { CoinGeckoPrice } from "@/types/Coingecko";
import { getTxsFromAddress } from "@/service/txs";
import { AccountTxs } from "@/types/Txs";
import { formatMethod } from "@/utils/format";
import { getSchemaByCodeAddr, getAllSchema } from "@/service/nftmngr";


interface Props {
    address: string;
    validator: Validator | null;
    account: Account | null;
    accountTxs: any;
    pageNumber: string;
    schema: any;
}

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (pageNumber: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    const handlePageChange = (pageNumber: number) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            onPageChange(pageNumber);
        }
    };

    const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

    return (
        <Flex direction="row" gap={2} align="center" px="2">
            <Button
                variant={"solid"}
                size="xs"
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
            >
                First
            </Button>
            <Button
                size="xs"
                onClick={() => handlePageChange(currentPage - 1)}
            >
                <FaArrowLeft fontSize={12} />
            </Button>
            <Text fontSize="xs">
                {`Page ${currentPage} of ${totalPages}`}
            </Text>
            <Button
                size="xs"
                onClick={() => handlePageChange(currentPage + 1)}
            >
                <FaArrowRight fontSize={12} />
            </Button>
            <Button
                size="xs"
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
            >
                Last
            </Button>
        </Flex>
    );
};


export default function Address({
    address,
    validator,
    account,
    accountTxs,
    pageNumber,
    schema,
}: Props) {
    const [isCopied, setIsCopied] = useState(false);
    const [totalValue, setTotalValue] = useState(0);
    let totalValueTmp = 0;
    const handleCopyClick = () => {
        if (Array.isArray(address) && address.length > 0) {
            navigator.clipboard.writeText(address[0]?.originContractAddress);
        }
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

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const paginatedSchema = Array.isArray(schema) ? schema.slice(indexOfFirstItem, indexOfLastItem) : [];
    const totalPages = Math.ceil(schema.length / itemsPerPage);
    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

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
                            {!schema && (
                                <Text color="error">NOT FOUND</Text>
                            )}
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
                                                {/* {Array.isArray(address) && !address[0].schemaCodes && (
                                                    <Flex direction="row" gap={2} align="center" px="2">
                                                        <Button
                                                            variant={"solid"}
                                                            size="xs"
                                                            href={`/datachain/${address}?page=1`}
                                                            as={LinkComponent}
                                                            isDisabled={
                                                                parseInt(pageNumber) === 1
                                                            }
                                                        >
                                                            First
                                                        </Button>
                                                        <Button
                                                            size="xs"
                                                            href={`/datachain/${address}?page=1`}
                                                            as={LinkComponent}
                                                            isDisabled={
                                                                parseInt(pageNumber) === 1
                                                            }
                                                        >
                                                            <FaArrowLeft fontSize={12} />
                                                        </Button>
                                                        <Text fontSize="xs">
                                                            {`Page ${pageNumber} of ${accountTxs.totalPage}`}
                                                        </Text>
                                                        <Button
                                                            size="xs"
                                                            href={`/datachain/${address}?page=${parseInt(pageNumber) + 1
                                                                }`}
                                                            as={LinkComponent}
                                                            isDisabled={
                                                                parseInt(pageNumber) ===
                                                                accountTxs.totalPage
                                                            }
                                                        >
                                                            <FaArrowRight fontSize={12} />
                                                        </Button>
                                                        <Button
                                                            size="xs"
                                                            href={`/datachain/${address}?page=${accountTxs.totalPage}`}
                                                            as={LinkComponent}
                                                            isDisabled={
                                                                parseInt(accountTxs.pageNumber) ===
                                                                accountTxs.totalPage
                                                            }
                                                        >
                                                            Last
                                                        </Button>
                                                    </Flex>
                                                )} */}
                                                <Pagination
                                                    currentPage={currentPage}
                                                    totalPages={totalPages}
                                                    onPageChange={handlePageChange}
                                                />
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
                                                            {`A total of ${Array.isArray(schema) && schema ? schema.length : "0"
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
                                                                {paginatedSchema.map((schema: any, index: number) => (
                                                                    <Tr key={index}>
                                                                        <Td>
                                                                            <Text>{index + 1}</Text>
                                                                        </Td>
                                                                        <Td>
                                                                            <Clickable href={`/schema/${schema.name}`}>
                                                                                <Text style={{
                                                                                    color: "#5C34A2",
                                                                                    textDecoration: "none",
                                                                                    fontFamily: "Nunito, Helvetica Neue, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol",
                                                                                    fontSize: "12px"
                                                                                }}>
                                                                                    {schema.name}
                                                                                </Text>
                                                                            </Clickable>
                                                                        </Td>
                                                                    </Tr>
                                                                ))}
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

export const getServerSideProps = async () => {
    const [schema] = await Promise.all([
        getAllSchema()
    ]);
    if (!schema) {
        return {
            props: {
                schema: null,
            },
        };
    }

    return {
        props: {
            schema
        },
    };
};
