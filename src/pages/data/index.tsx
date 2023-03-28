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
  TableContainer,
  Table,
  Tr,
  Td,
  Badge,
  Tbody,
  Thead,
  Image,
  Spacer,
} from "@chakra-ui/react";
// ------------------------- NextJS -------------------------
import Head from "next/head";
// import Image from "next/image";
// ------------------------- Styles -------------------------
import styles from "@/styles/Home.module.css";
import { FaDollarSign } from "react-icons/fa";
// ------------- Components ----------------
import NavBar from "@/components/NavBar";
import SearchBar from "@/components/SearchBar";
import CustomCard from "@/components/CustomCard";
import CustomTable from "@/components/CustomTable";

import { Clickable } from "@/components/Clickable";
import { formatHex, formatNumber } from "@/utils/format";

const data = [
  {
    title: "PRICE",
    value: 6,
    badge: "1.5%",
    icon: FaDollarSign,
  },
  {
    title: "STAKED",
    value: 22000000,
    badge: "65%",
    icon: FaDollarSign,
  },
  {
    title: "MARKET CAP",
    value: 23456789,
    badge: "1.5%",
    icon: FaDollarSign,
  },
  {
    title: "INFLATION",
    value: "8%",
    badge: "1.5%",
    icon: FaDollarSign,
  },
];

export default function Data(modalstate: {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  return (
    <Flex minHeight={"100vh"} direction={"column"} bgColor="lightest">
      {/* testing eslint */}
      <Head>
        <title>SIXSCAN</title>
        <meta name="description" content="SIXSCAN" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box
        bgGradient={"linear(to-r, #3FC2FA, #3759F0)"}
        paddingTop={10}
        paddingBottom={20}
      >
        <Container maxW="container.lg">
          <Flex direction="column" gap={3} p={3}>
            <Text fontSize="xl" fontWeight="bold" color={"lightest"}>
              Data Layer Explorer
            </Text>
            <SearchBar
              hasButton
              placeHolder="Search by Address / Txn Hash / Block"
              modalstate={modalstate}
            />
          </Flex>
        </Container>
      </Box>
      <Box marginTop={-10}>
        <Container maxW="container.lg">
          <Flex direction="column" gap={3} p={3}>
            <Grid templateColumns="repeat(12, 1fr)" gap={6}>
              <GridItem colSpan={{ base: 12, md: 6 }}>
                <CustomCard title={"Trending"}>
                  <TableContainer>
                    <Table>
                      <Thead>
                        <Tr>
                          <Td>
                            <Text fontSize="sm" color={"medium"}>
                              Collection
                            </Text>
                          </Td>
                          <Td>
                            <Text fontSize="sm" color={"medium"}>
                              Action
                            </Text>
                          </Td>
                          <Td>
                            <Text fontSize="sm" color={"medium"}>
                              Action Count
                            </Text>
                          </Td>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {TRENDING.map((item, index) => (
                          <Tr key={index}>
                            <Td>
                              <Flex direction="row" alignItems="center" gap={3}>
                                <Text fontWeight={"bold"}>{index + 1}</Text>
                                <Image
                                  src="/mfer.png"
                                  alt="mfer"
                                  width={"40px"}
                                  height={"40px"}
                                />
                                <Text fontWeight={"bold"}>
                                  {item.collection}
                                </Text>
                              </Flex>
                            </Td>
                            <Td>
                              <Flex direction="row" alignItems="center" gap={3}>
                                <Text>{item.action}</Text>
                              </Flex>
                            </Td>
                            <Td>
                              <Flex direction="row" alignItems="center" gap={3}>
                                <Text>{item.actionCount}</Text>
                              </Flex>
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </TableContainer>
                </CustomCard>
              </GridItem>
              <GridItem colSpan={{ base: 12, md: 6 }}>
                <Grid templateColumns="repeat(2, 1fr)" gap={6}>
                  <GridItem colSpan={2}>
                    <Card size="lg">
                      <CardBody>
                        <Flex direction="column" py={2}>
                          <Text
                            fontSize="xl"
                            color={"darkest"}
                            fontWeight="bold"
                          >
                            CONTACT HAMDEE
                          </Text>
                          <Text
                            fontSize="xl"
                            color={"darkest"}
                            fontWeight="bold"
                          >
                            FOR FREE COINS
                          </Text>
                        </Flex>
                        <Text fontSize="xs" color={"medium"}>
                          POWERED BY SIX PROTOCOL
                        </Text>
                      </CardBody>
                    </Card>
                  </GridItem>
                  <GridItem colSpan={2}>
                    <Card size="lg">
                      <CardBody p={0}>
                        <Grid templateColumns="repeat(2, 1fr)">
                          {data.map((item, index) => (
                            <GridItem
                              key={index}
                              colSpan={{ base: 2, lg: 1 }}
                              borderBottom={"1px solid"}
                              borderRight={
                                index - (1 % 2) !== 0 ? "1px solid" : "none"
                              }
                              borderColor={"light"}
                            >
                              <Flex
                                direction={"row"}
                                p={4}
                                alignItems={"center"}
                                gap={3}
                              >
                                <Icon
                                  as={item.icon}
                                  w={6}
                                  h={6}
                                  color={"dark"}
                                />
                                <Flex direction={"column"}>
                                  <Text fontSize="sm" color={"medium"}>
                                    {item.title}
                                  </Text>
                                  <Flex
                                    direction={"row"}
                                    alignItems={"center"}
                                    gap={2}
                                  >
                                    <Text
                                      fontSize="xl"
                                      fontWeight="bold"
                                      color={"darkest"}
                                    >
                                      {typeof item.value === "number"
                                        ? formatNumber(item.value)
                                        : item.value}
                                    </Text>
                                    <Text fontSize="sm" color={"success"}>
                                      {`(${item.badge})`}
                                    </Text>
                                  </Flex>
                                </Flex>
                              </Flex>
                            </GridItem>
                          ))}
                        </Grid>
                      </CardBody>
                    </Card>
                  </GridItem>
                </Grid>
              </GridItem>
              <GridItem colSpan={12}>
                <CustomCard
                  title={"Latest Actions"}
                  footer={"VIEW ACTIONS"}
                  href={"/actions"}
                >
                  <TableContainer>
                    <Table>
                      <Thead>
                        <Tr>
                          <Td>Txhash</Td>
                          <Td>Action</Td>
                          <Td>Age</Td>
                          <Td>Block</Td>
                          <Td>By</Td>
                          <Td>Schema</Td>
                        </Tr>
                      </Thead>
                      <Tbody>
                        <Tr>
                          <Td>
                            <Flex direction="column">
                              <Text>
                                <Clickable underline href="/">
                                  {formatHex(
                                    "0x35f7c2f5456aa996571a78c28d5895110a5dd23822df300a04e1d8297754e05e"
                                  )}
                                </Clickable>
                              </Text>
                              <Text color="medium" fontSize="sm">
                                6 seconds ago
                              </Text>
                            </Flex>
                          </Td>
                          <Td>
                            <Flex direction="column">
                              <Text>
                                <Badge>
                                  <Clickable underline href="/">
                                    check_in
                                  </Clickable>
                                </Badge>
                              </Text>
                            </Flex>
                          </Td>
                          <Td>
                            <Flex direction="column">
                              <Text>40 secs ago</Text>
                            </Flex>
                          </Td>
                          <Td>
                            <Flex direction="column">
                              <Text>
                                <Clickable underline href="/">
                                  345678
                                </Clickable>
                              </Text>
                            </Flex>
                          </Td>
                          <Td>
                            <Flex direction="column">
                              <Text>
                                <Clickable underline href="/">
                                  {formatHex(
                                    "6x12090025857b9c7b24387741f120538e928a3a59"
                                  )}
                                </Clickable>
                              </Text>
                            </Flex>
                          </Td>
                          <Td>
                            <Flex direction="column">
                              <Text>
                                <Clickable underline href="/">
                                  sixnetwork.whalegate
                                </Clickable>
                              </Text>
                            </Flex>
                          </Td>
                        </Tr>
                      </Tbody>
                    </Table>
                  </TableContainer>
                </CustomCard>
              </GridItem>
            </Grid>
          </Flex>
        </Container>
      </Box>
      <Spacer />
    </Flex>
  );
}

const TRENDING = [
  {
    collection: "Mfers",
    action: "check_in",
    actionCount: 100,
  },
  {
    collection: "Mfers",
    action: "check_in",
    actionCount: 100,
  },
  {
    collection: "Mfers",
    action: "check_in",
    actionCount: 100,
  },
  {
    collection: "Mfers",
    action: "check_in",
    actionCount: 100,
  },
  {
    collection: "Mfers",
    action: "check_in",
    actionCount: 100,
  },
];
