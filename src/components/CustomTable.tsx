import {
  TableContainer,
  Table,
  TableCaption,
  Thead,
  Th,
  Tr,
  Tbody,
  Td,
  Tfoot,
  Flex,
  Text,
  Box,
  Badge,
  Link,
} from "@chakra-ui/react";

import { Clickable } from "./Clickable";

const blocks = [
  {
    blockHeight: 45678,
    time: "6 seconds ago",
    txns: 62,
    fee: 0.4,
    feeRecipient: "6x192A...34kd",
  },
  {
    blockHeight: 45678,
    time: "6 seconds ago",
    txns: 62,
    fee: 0.4,
    feeRecipient: "6x192A...34kd",
  },
  {
    blockHeight: 45678,
    time: "6 seconds ago",
    txns: 62,
    fee: 0.4,
    feeRecipient: "6x192A...34kd",
  },
  {
    blockHeight: 45678,
    time: "6 seconds ago",
    txns: 62,
    fee: 0.4,
    feeRecipient: "6x192A...34kd",
  },
  {
    blockHeight: 45678,
    time: "6 seconds ago",
    txns: 62,
    fee: 0.4,
    feeRecipient: "6x192A...34kd",
  },
];

const CustomTable = ({
  children,
}: {
  children?: React.ReactNode;
  title?: string;
  footer?: string;
}) => {
  return (
    <TableContainer>
      <Table variant="simple">
        <Tbody>
          {blocks.map((block, index) => (
            <Tr key={index}>
              <Td>
                <Flex direction="column">
                  <Text>
                    <Clickable underline href="/">
                      {block.blockHeight}
                    </Clickable>
                  </Text>
                  <Text fontSize="xs" color="medium">
                    {block.time}
                  </Text>
                </Flex>
              </Td>
              <Td>
                <Flex direction="column">
                  <Text>
                    Fee Recipient{" "}
                    <Clickable underline href="/">
                      {block.feeRecipient}
                    </Clickable>
                  </Text>
                  <Text fontSize="xs" color="medium">
                    Txns{" "}
                    <Clickable href="/" underline>
                      {block.txns}
                    </Clickable>
                  </Text>
                </Flex>
              </Td>
              <Td isNumeric>
                <Badge>
                  Reward <Clickable href="/">{block.fee}</Clickable> SIX
                </Badge>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default CustomTable;
