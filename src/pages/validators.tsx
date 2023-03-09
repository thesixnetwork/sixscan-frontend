// ------------------------- Chakra UI -------------------------
import {
  Box,
  Flex,
  Text,
  Container,
  Divider,
  Table,
  TableContainer,
  Tbody,
  Tr,
  Td,
  Badge,
  Spacer,
  Image,
  Circle,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
// ------------------------- NextJS -------------------------
import Head from "next/head";
// ------------------------- Styles -------------------------
import { FaCheckCircle, FaUnlink } from "react-icons/fa";
// ------------- Components ----------------
import NavBar from "@/components/NavBar";
import CustomCard from "@/components/CustomCard";
import { Footer } from "@/components/Footer";
import { Clickable } from "@/components/Clickable";
import { getValidators } from "@/service/staking";
import { Validator } from "@/types/Staking";
import { formatNumber } from "@/utils/format";

const getImageFromDetails = (details: string) => {
  const substrings = details.split("|"); // Split the string into substrings

  let imValue = "";
  for (const substring of substrings) {
    if (substring.startsWith("im=")) {
      imValue = substring.slice(3); // Extract the value of im
      break;
    }
  }
  return imValue;
};

const getNameFromDetails = (details: string) => {
  const substrings = details.split("|"); // Split the string into substrings

  let sdValue = "";
  for (const substring of substrings) {
    if (substring.startsWith("sd=")) {
      sdValue = substring.slice(3); // Extract the value of im
      break;
    }
  }
  return sdValue;
};

const sortValidatorsByPower = (validators: Validator[]) => {
  return validators.sort((a, b) => {
    if (
      a.status !== "BOND_STATUS_BONDED" &&
      b.status === "BOND_STATUS_BONDED"
    ) {
      return 1;
    } else if (
      a.status === "BOND_STATUS_BONDED" &&
      b.status !== "BOND_STATUS_BONDED"
    ) {
      return -1;
    } else {
      return parseInt(b.tokens) - parseInt(a.tokens);
    }
  });
};

export default function Validators({
  validators,
}: {
  validators: Validator[];
}) {
  // sort validators by voting power and if status is not bonded, put it at the end
  sortValidatorsByPower(validators);
  return (
    <Flex minHeight={"100vh"} direction={"column"}>
      {/* testing eslint */}
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
              Validators
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
                        <Text fontWeight={"bold"}>Address</Text>
                      </Td>
                      <Td>
                        <Text fontWeight={"bold"}>Voting Power</Text>
                      </Td>
                      <Td>
                        <Text fontWeight={"bold"}>First Block</Text>
                      </Td>
                      <Td>
                        <Text fontWeight={"bold"}>Last Block</Text>
                      </Td>
                      <Td>
                        <Text fontWeight={"bold"}>Validated Blocks</Text>
                      </Td>
                      <Td>
                        <Text fontWeight={"bold"}>Active</Text>
                      </Td>
                    </Tr>
                    {validators.map(
                      (validator) =>
                        // show if moniker includes SIX NETWORK
                        validator.description.moniker
                          .toLowerCase()
                          .includes("six network") &&
                        !validator.jailed && (
                          <Tr key={validator.operator_address}>
                            <Td>
                              <Flex gap={2} alignItems="center">
                                {getImageFromDetails(
                                  validator.description.details
                                ) !== "" ? (
                                  <Image
                                    border="1px solid"
                                    borderColor={"light"}
                                    borderRadius="full"
                                    src={`https://imgur.com/${getImageFromDetails(
                                      validator.description.details
                                    )}.png`}
                                    alt={validator.description.moniker}
                                    height={10}
                                  />
                                ) : (
                                  <Circle
                                    border="1px solid"
                                    size={10}
                                    borderColor={"light"}
                                  />
                                )}
                                <Flex direction="column">
                                  <Text>
                                    <Clickable
                                      underline
                                      href={`/address/${validator.operator_address}`}
                                    >
                                      {validator.description.moniker}
                                    </Clickable>
                                  </Text>
                                  <Text fontSize="sm" color="medium">
                                    {getNameFromDetails(
                                      validator.description.details
                                    ) !== ""
                                      ? getNameFromDetails(
                                          validator.description.details
                                        )
                                      : ""}
                                  </Text>
                                </Flex>
                              </Flex>
                            </Td>
                            <Td>
                              <Flex direction="column">
                                <Text>
                                  {formatNumber(
                                    parseInt(validator.tokens) / 10 ** 6
                                  ) + " SIX"}
                                </Text>
                              </Flex>
                            </Td>
                            <Td>
                              <Text>
                                <Clickable href="/">0</Clickable>
                              </Text>
                            </Td>
                            <Td>
                              <Text>
                                <Clickable href="/">0</Clickable>
                              </Text>
                            </Td>
                            <Td>
                              <Text>0</Text>
                            </Td>
                            <Td>
                              {!validator.jailed ? (
                                validator.status === "BOND_STATUS_BONDED" ? (
                                  <Badge
                                    colorScheme={"green"}
                                    variant={"subtle"}
                                  >
                                    <Flex
                                      direction="row"
                                      gap={1}
                                      alignItems="center"
                                    >
                                      <FaCheckCircle />
                                      <Text>Yes</Text>
                                    </Flex>
                                  </Badge>
                                ) : (
                                  <Badge colorScheme={"red"} variant={"subtle"}>
                                    <Flex
                                      direction="row"
                                      gap={1}
                                      alignItems="center"
                                    >
                                      <FaUnlink />
                                      <Text>No</Text>
                                    </Flex>
                                  </Badge>
                                )
                              ) : (
                                <Badge colorScheme={"red"} variant={"subtle"}>
                                  <Flex
                                    direction="row"
                                    gap={1}
                                    alignItems="center"
                                  >
                                    <FaUnlink />
                                    <Text>Jailed</Text>
                                  </Flex>
                                </Badge>
                              )}
                            </Td>
                          </Tr>
                        )
                    )}
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
              <Tabs>
                <TabList>
                  <Tab>Active</Tab>
                  <Tab>Inactive</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel>
                    <TableContainer>
                      <Table>
                        <Tbody>
                          <Tr>
                            <Td>
                              <Text fontWeight={"bold"}>Rank</Text>
                            </Td>
                            <Td>
                              <Text fontWeight={"bold"}>Address</Text>
                            </Td>
                            <Td>
                              <Text fontWeight={"bold"}>Voting Power</Text>
                            </Td>
                            <Td>
                              <Text fontWeight={"bold"}>First Block</Text>
                            </Td>
                            <Td>
                              <Text fontWeight={"bold"}>Last Block</Text>
                            </Td>
                            <Td>
                              <Text fontWeight={"bold"}>Validated Blocks</Text>
                            </Td>
                            <Td>
                              <Text fontWeight={"bold"}>Active</Text>
                            </Td>
                          </Tr>
                          {validators.map(
                            (validator, index) =>
                              !validator.jailed && (
                                <Tr key={validator.operator_address}>
                                  <Td>
                                    <Flex direction="column">
                                      <Text>
                                        {index + 1 === 1
                                          ? `🥇 ${index + 1}`
                                          : index + 1 === 2
                                          ? `🥈 ${index + 1}`
                                          : index + 1 === 3
                                          ? `🥉 ${index + 1}`
                                          : index + 1}
                                      </Text>
                                    </Flex>
                                  </Td>
                                  <Td>
                                    <Flex gap={2} alignItems="center">
                                      {getImageFromDetails(
                                        validator.description.details
                                      ) !== "" ? (
                                        <Image
                                          border="1px solid"
                                          borderColor={"light"}
                                          borderRadius="full"
                                          alt={validator.description.moniker}
                                          src={`https://imgur.com/${getImageFromDetails(
                                            validator.description.details
                                          )}.png`}
                                          height={10}
                                        />
                                      ) : (
                                        <Circle
                                          border="1px solid"
                                          size={10}
                                          borderColor={"light"}
                                        />
                                      )}
                                      <Flex direction="column">
                                        <Text>
                                          <Clickable
                                            underline
                                            href={`/address/${validator.operator_address}`}
                                          >
                                            {validator.description.moniker}
                                          </Clickable>
                                        </Text>
                                        <Text fontSize="sm" color="medium">
                                          {getNameFromDetails(
                                            validator.description.details
                                          ) !== ""
                                            ? getNameFromDetails(
                                                validator.description.details
                                              )
                                            : ""}
                                        </Text>
                                      </Flex>
                                    </Flex>
                                  </Td>
                                  <Td>
                                    <Flex direction="column">
                                      <Text>
                                        {formatNumber(
                                          parseInt(validator.tokens) / 10 ** 6
                                        ) + " SIX"}
                                      </Text>
                                    </Flex>
                                  </Td>
                                  <Td>
                                    <Text>
                                      <Clickable href="/">0</Clickable>
                                    </Text>
                                  </Td>
                                  <Td>
                                    <Text>
                                      <Clickable href="/">0</Clickable>
                                    </Text>
                                  </Td>
                                  <Td>
                                    <Text>0</Text>
                                  </Td>
                                  <Td>
                                    {!validator.jailed ? (
                                      validator.status ===
                                      "BOND_STATUS_BONDED" ? (
                                        <Badge
                                          colorScheme={"green"}
                                          variant={"subtle"}
                                        >
                                          <Flex
                                            direction="row"
                                            gap={1}
                                            alignItems="center"
                                          >
                                            <FaCheckCircle />
                                            <Text>Yes</Text>
                                          </Flex>
                                        </Badge>
                                      ) : (
                                        <Badge
                                          colorScheme={"red"}
                                          variant={"subtle"}
                                        >
                                          <Flex
                                            direction="row"
                                            gap={1}
                                            alignItems="center"
                                          >
                                            <FaUnlink />
                                            <Text>No</Text>
                                          </Flex>
                                        </Badge>
                                      )
                                    ) : (
                                      <Badge
                                        colorScheme={"red"}
                                        variant={"subtle"}
                                      >
                                        <Flex
                                          direction="row"
                                          gap={1}
                                          alignItems="center"
                                        >
                                          <FaUnlink />
                                          <Text>Jailed</Text>
                                        </Flex>
                                      </Badge>
                                    )}
                                  </Td>
                                </Tr>
                              )
                          )}
                        </Tbody>
                      </Table>
                    </TableContainer>
                  </TabPanel>
                  <TabPanel>
                    <TableContainer>
                      <Table>
                        <Tbody>
                          <Tr>
                            <Td>
                              <Text fontWeight={"bold"}>Rank</Text>
                            </Td>
                            <Td>
                              <Text fontWeight={"bold"}>Address</Text>
                            </Td>
                            <Td>
                              <Text fontWeight={"bold"}>Voting Power</Text>
                            </Td>
                            <Td>
                              <Text fontWeight={"bold"}>First Block</Text>
                            </Td>
                            <Td>
                              <Text fontWeight={"bold"}>Last Block</Text>
                            </Td>
                            <Td>
                              <Text fontWeight={"bold"}>Validated Blocks</Text>
                            </Td>
                            <Td>
                              <Text fontWeight={"bold"}>Active</Text>
                            </Td>
                          </Tr>
                          {validators.map(
                            (validator, index) =>
                              validator.jailed && (
                                <Tr key={validator.operator_address}>
                                  <Td>
                                    <Flex direction="column">
                                      <Text>
                                        {index + 1 === 1
                                          ? `🥇 ${index + 1}`
                                          : index + 1 === 2
                                          ? `🥈 ${index + 1}`
                                          : index + 1 === 3
                                          ? `🥉 ${index + 1}`
                                          : index + 1}
                                      </Text>
                                    </Flex>
                                  </Td>
                                  <Td>
                                    <Flex gap={2} alignItems="center">
                                      {getImageFromDetails(
                                        validator.description.details
                                      ) !== "" ? (
                                        <Image
                                          border="1px solid"
                                          borderColor={"light"}
                                          borderRadius="full"
                                          alt={validator.description.moniker}
                                          src={`https://imgur.com/${getImageFromDetails(
                                            validator.description.details
                                          )}.png`}
                                          height={10}
                                        />
                                      ) : (
                                        <Circle
                                          border="1px solid"
                                          size={10}
                                          borderColor={"light"}
                                        />
                                      )}
                                      <Flex direction="column">
                                        <Text>
                                          <Clickable
                                            underline
                                            href={`/address/${validator.operator_address}`}
                                          >
                                            {validator.description.moniker}
                                          </Clickable>
                                        </Text>
                                        <Text fontSize="sm" color="medium">
                                          {getNameFromDetails(
                                            validator.description.details
                                          ) !== ""
                                            ? getNameFromDetails(
                                                validator.description.details
                                              )
                                            : ""}
                                        </Text>
                                      </Flex>
                                    </Flex>
                                  </Td>
                                  <Td>
                                    <Flex direction="column">
                                      <Text>
                                        {formatNumber(
                                          parseInt(validator.tokens) / 10 ** 6
                                        ) + " SIX"}
                                      </Text>
                                    </Flex>
                                  </Td>
                                  <Td>
                                    <Text>
                                      <Clickable href="/">0</Clickable>
                                    </Text>
                                  </Td>
                                  <Td>
                                    <Text>
                                      <Clickable href="/">0</Clickable>
                                    </Text>
                                  </Td>
                                  <Td>
                                    <Text>0</Text>
                                  </Td>
                                  <Td>
                                    {!validator.jailed ? (
                                      validator.status ===
                                      "BOND_STATUS_BONDED" ? (
                                        <Badge
                                          colorScheme={"green"}
                                          variant={"subtle"}
                                        >
                                          <Flex
                                            direction="row"
                                            gap={1}
                                            alignItems="center"
                                          >
                                            <FaCheckCircle />
                                            <Text>Yes</Text>
                                          </Flex>
                                        </Badge>
                                      ) : (
                                        <Badge
                                          colorScheme={"red"}
                                          variant={"subtle"}
                                        >
                                          <Flex
                                            direction="row"
                                            gap={1}
                                            alignItems="center"
                                          >
                                            <FaUnlink />
                                            <Text>No</Text>
                                          </Flex>
                                        </Badge>
                                      )
                                    ) : (
                                      <Badge
                                        colorScheme={"red"}
                                        variant={"subtle"}
                                      >
                                        <Flex
                                          direction="row"
                                          gap={1}
                                          alignItems="center"
                                        >
                                          <FaUnlink />
                                          <Text>Jailed</Text>
                                        </Flex>
                                      </Badge>
                                    )}
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
          </Flex>
        </Container>
      </Box>
      <Spacer />
      <Footer />
    </Flex>
  );
}

export const getServerSideProps = async () => {
  const validators = await getValidators();
  return {
    props: {
      validators,
    },
  };
};
