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
import { getSchemaByCodeAddr, getSchemaByAddress } from "@/service/nftmngr";


interface Props {
    address: string;
    validator: Validator | null;
    account: Account | null;
    accountTxs: any;
    pageNumber: string;
}

export default function Address({
    address,
    validator,
    account,
    accountTxs,
    pageNumber
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
                                    {Array.isArray(address) && address ? address[0]?.originContractAddress : "Invalid Address"}
                                </Text>
                                {address && (
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
                            <Flex direction="row" align="center" gap={4}>
                                {validator && <Badge>Validators</Badge>}
                                {account && <Badge>{account["@type"].split(".")[3]}</Badge>}
                                {validator && validator.jailed && (
                                    <Badge colorScheme={"red"}>Jailed</Badge>
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
                                                {Array.isArray(address) && !address[0].schemaCodes && (
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
                                                            {`A total of ${Array.isArray(address) && address[0].schemaCodes ? address[0].schemaCodes.length : "0"
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
                                                                {Array.isArray(address) && address[0].schemaCodes &&
                                                                    address[0].schemaCodes.map((schema: any, index: number) => (
                                                                        <Tr key={index}>
                                                                            <Td>
                                                                                <Text>{index + 1}</Text>
                                                                            </Td>
                                                                            <Td>
                                                                                <Clickable href={`/schema/${schema}`}>
                                                                                    <Text style={{
                                                                                        color: "#5C34A2",
                                                                                        textDecoration: "none",
                                                                                        fontFamily: "Nunito, Helvetica Neue, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol",
                                                                                        fontSize: "12px"
                                                                                    }}>
                                                                                        {schema}
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

export const getServerSideProps = async ({
    params: { contract },
    query: { page = "1" },
}: {
    params: { contract: string; };
    query: { page: string; },
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
        getSchemaByAddress(contract)
    ]);
    const pageNumber = page
    return {
        props: {
            address
        },
    };
};
