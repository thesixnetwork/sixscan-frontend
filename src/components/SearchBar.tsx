import { useEffect, useState } from "react";
import {
  Input,
  InputGroup,
  Button,
  InputRightElement,
  InputLeftElement,
  Box,
  Kbd,
  Text,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
  Spacer,
} from "@chakra-ui/react";
import { FaArrowRight, FaFingerprint, FaSearch } from "react-icons/fa";

import SearchModal from "./SearchModal";

type SearchResult = {
  type: "address" | "tx" | "block" | "schema";
  value: string;
};

const SearchBar = ({
  placeHolder,
  hasButton,
  modalstate,
}: {
  placeHolder?: string;
  hasButton?: boolean;
  modalstate: { isOpen: boolean; onOpen: () => void; onClose: () => void };
}) => {
  return (
    <Box>
      <SearchModal
        onOpen={modalstate.onOpen}
        isOpen={modalstate.isOpen}
        onClose={modalstate.onClose}
      />
      <InputGroup size="md">
        {hasButton ? null : (
          <InputLeftElement mx={1}>
            <Box color={"dark"}>
              <FaSearch />
            </Box>
          </InputLeftElement>
        )}
        <Input
          placeholder={placeHolder}
          bgColor={hasButton ? "white" : "lightest"}
          borderRadius={12}
          onClick={modalstate.onOpen}
        />
        <InputRightElement mx={hasButton ? 1 : 4}>
          {hasButton ? (
            <Button size="sm">
              <FaSearch />
            </Button>
          ) : (
            <Flex
              direction="row"
              alignItems="center"
              justifyContent="center"
              gap={1}
            >
              <Kbd>⌘</Kbd>
              <Kbd>K</Kbd>
            </Flex>
          )}
        </InputRightElement>
      </InputGroup>
    </Box>
  );
};

export default SearchBar;
