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
import { validateAddress } from "@/utils/validate";
import { useEffect, useState } from "react";
import { getValidator } from "@/service/staking";
import { Validator } from "@/types/Staking";
import { Balance } from "@/types/Bank";
// ------------------------- Helper Libs -------------------------
import moment from "moment";
import { getAccount } from "@/service/auth";
import { Account } from "@/types/Auth";
import { getBalance, getBalances } from "@/service/bank";
import { formatNumber, convertUsixToSix, formatMethod } from "@/utils/format";
import { getLatestAction } from "@/service/nftmngr/txs";

import { getPriceFromCoingecko } from "@/service/coingecko";
import { CoinGeckoPrice } from "@/types/Coingecko";
import { getTxsFromAddress } from "@/service/txs";
import { AccountTxs } from "@/types/Txs";

interface Props {
    actions: any;
    pageNumber: string;
}

export default function Address({
    actions,
    pageNumber
}: Props) {
    const [isCopied, setIsCopied] = useState(false);
    const [totalValue, setTotalValue] = useState(0);
    let totalValueTmp = 0;

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
                    <Container maxW="container.lg">
                        <Flex direction="column" gap={3} p={3}>
                            <Flex direction="row" align="center" gap={4}>
                                <Text fontSize="xl" fontWeight="bold" color={"dark"}>
                                    Latest Actions:
                                </Text>
                                <Text fontWeight="bold" color={"error"}>
                                    {!actions && "Invalid Actions"}
                                </Text>
                            </Flex>
                            {/* <Flex direction="row" align="center" gap={4}>
                                <Badge>Latest Actions</Badge>
                            </Flex> */}
                            <Divider />
                            {/* {!address && (
                                <Text color="error">Please provide a valid address</Text>
                            )} */}
                        </Flex>
                    </Container>
                </Box>
                <Box p={6}>
                    <Container maxW="container.lg">
                        <Grid templateColumns="repeat(12, 1fr)" gap={6}>
                            {actions && (
                                <GridItem colSpan={12}>
                                    <CustomCard>
                                        <Tabs isLazy>
                                            <TabList>
                                                <Tab>Txns</Tab>
                                                <Spacer />
                                                {actions && (
                                                    <Flex direction="row" gap={2} align="center" px="2">
                                                        <Button
                                                            variant={"solid"}
                                                            size="xs"
                                                            href={`/action?page=1`}
                                                            as={LinkComponent}
                                                            isDisabled={
                                                                parseInt(pageNumber) === 1
                                                            }
                                                        >
                                                            First
                                                        </Button>
                                                        <Button
                                                            size="xs"
                                                            href={`/action?page=1`}
                                                            as={LinkComponent}
                                                            isDisabled={
                                                                parseInt(pageNumber) === 1
                                                            }
                                                        >
                                                            <FaArrowLeft fontSize={12} />
                                                        </Button>
                                                        <Text fontSize="xs">
                                                            {`Page ${pageNumber} of ${actions.totalPage}`}
                                                        </Text>
                                                        <Button
                                                            size="xs"
                                                            href={`/action?page=${parseInt(pageNumber) + 1
                                                                }`}
                                                            as={LinkComponent}
                                                            isDisabled={
                                                                parseInt(pageNumber) ===
                                                                actions.totalPage
                                                            }
                                                        >
                                                            <FaArrowRight fontSize={12} />
                                                        </Button>
                                                        <Button
                                                            size="xs"
                                                            href={`/action?page=${actions.totalPage}`}
                                                            as={LinkComponent}
                                                            isDisabled={
                                                                parseInt(actions.pageNumber) ===
                                                                actions.totalPage
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
                                                            {`A total of ${actions ? actions.totalCount : "0"
                                                                } txns found.`}
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
                                                                        <Text>Action</Text>
                                                                    </Td>
                                                                    <Td>
                                                                        <Text>TokenID</Text>
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
                                                                    <Td>
                                                                        <Text>Schema</Text>
                                                                    </Td>
                                                                </Tr>
                                                            </Thead>
                                                            <Tbody>
                                                                {actions &&
                                                                    actions.txs.map((tx: any, index: number) => (
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
                                                                                    <Clickable
                                                                                        href={`/tx/${tx.txhash}`}
                                                                                    >
                                                                                        <Text style={{
                                                                                            color: "#5C34A2",
                                                                                            textDecoration: "none",
                                                                                            fontFamily: "Nunito, Helvetica Neue, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol",
                                                                                            fontSize: "13px"
                                                                                        }}>
                                                                                            {formatHex(tx.txhash)}
                                                                                        </Text>
                                                                                    </Clickable>
                                                                                </Flex>
                                                                            </Td>
                                                                            <Td>
                                                                            {formatMethod(tx.type, tx.decode_tx.toAddress, tx.decode_tx.fromAddress, tx.decode_tx.action)}
                                                                            </Td>
                                                                            <Td>
                                                                                {
                                                                                tx.decode_tx.nftSchemaCode || tx.decode_tx.nft_schema_code ?  
                                                                                <Clickable href={`/schema/${tx.decode_tx.nftSchemaCode? tx.decode_tx.nftSchemaCode :tx.decode_tx.nft_schema_code}/${tx.decode_tx.tokenId}`}>
                                                                                    <Text style={{
                                                                                        color: "#5C34A2",
                                                                                        textDecoration: "none",
                                                                                        fontFamily: "Nunito, Helvetica Neue, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol",
                                                                                        fontSize: "14px"
                                                                                    }}>
                                                                                        {tx.decode_tx.tokenId}
                                                                                    </Text>
                                                                                </Clickable> : "Will be available"
                                                                                }
                                                                            </Td>
                                                                            <Td>
                                                                                <Text>
                                                                                    {moment(tx.time_stamp).fromNow()}
                                                                                </Text>
                                                                            </Td>
                                                                            <Td>
                                                                                <Clickable href="/">
                                                                                    <Text style={{
                                                                                        color: "#5C34A2",
                                                                                        textDecoration: "none",
                                                                                        fontFamily: "Nunito, Helvetica Neue, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol",
                                                                                        fontSize: "14px"
                                                                                    }}>
                                                                                        {tx.block_height}
                                                                                    </Text>
                                                                                </Clickable>
                                                                            </Td>
                                                                            <Td>
                                                                                {tx.decode_tx.creator?
                                                                                <Clickable href={`/address/${tx.decode_tx.creator}`}>
                                                                                    <Text style={{
                                                                                        color: "#5C34A2",
                                                                                        textDecoration: "none",
                                                                                        fontFamily: "Nunito, Helvetica Neue, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol",
                                                                                        fontSize: "14px"
                                                                                    }}>
                                                                                        {formatHex(tx.decode_tx.creator)}
                                                                                    </Text>
                                                                                </Clickable> : "Will be available"}
                                                                            </Td>
                                                                            <Td>
                                                                                <Text>{tx.decode_tx.fee_amount ?`${formatNumber(
                                                                                    convertUsixToSix(
                                                                                        parseInt(tx.decode_tx.fee_amount)
                                                                                    )
                                                                                )} SIX` : ""}</Text>
                                                                            </Td>
                                                                            <Td>
                                                                                {tx.decode_tx.nftSchemaCode || tx.decode_tx.nft_schema_code ? (
                                                                                <Clickable href={`/schema/${tx.decode_tx.nftSchemaCode ? tx.decode_tx.nftSchemaCode:tx.decode_tx.nft_schema_code}`}>
                                                                                    <Text style={{
                                                                                        color: "#5C34A2",
                                                                                        textDecoration: "none",
                                                                                        fontFamily: "Nunito, Helvetica Neue, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol",
                                                                                        fontSize: "14px"
                                                                                    }}>
                                                                                        {formatHex(tx.decode_tx.nftSchemaCode ? tx.decode_tx.nftSchemaCode:tx.decode_tx.nft_schema_code)}
                                                                                    </Text>
                                                                                </Clickable>) : "Will be available"}
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
    query: { page = "1" },
}: {
    query: { page: string; },
}) => {
    const [actions] = await Promise.all([
        getLatestAction(page ? page : "1", "20"),
    ]);
    const pageNumber = page
    return {
        props: {
            actions,
            pageNumber
        },
    };
};
