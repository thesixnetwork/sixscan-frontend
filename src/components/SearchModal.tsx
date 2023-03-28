import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
  Spacer,
  InputGroup,
  InputLeftElement,
  Box,
  Input,
  Text,
  Flex,
} from "@chakra-ui/react";
import { FaArrowRight, FaFingerprint, FaSearch } from "react-icons/fa";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  validateAddress,
  validateBlock,
  validateTxHash,
} from "@/utils/validate";

type SearchResult = {
  type: "address" | "tx" | "block" | "schema";
  value: string;
};

const SearchModal = ({
  onOpen,
  isOpen,
  onClose,
}: {
  onOpen: () => void;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  // const { isOpen, onOpen, onClose } = useDisclosure();

  const initialRef = useRef(null);
  const finalRef = useRef(null);

  const handleSearch = async () => {
    // Perform search based on searchInput and update searchResults
    const _searchResults: SearchResult[] = [];
    const isAddress = validateAddress(searchInput);
    const isTx = validateTxHash(searchInput);
    const isBlock = await validateBlock(searchInput);

    if (isAddress) {
      _searchResults.push({
        type: "address",
        value: searchInput,
      });
    }

    if (isTx) {
      _searchResults.push({
        type: "tx",
        value: searchInput,
      });
    }

    if (isBlock) {
      _searchResults.push({
        type: "block",
        value: searchInput,
      });
    }
    if (!isAddress && !isTx && !isBlock) {
      _searchResults.push({
        type: "schema",
        value: searchInput,
      });
    }
    setSearchResults(_searchResults);
  };

  useEffect(() => {
    if (searchInput) {
      // wait for 1s before performing search
      const timeout = setTimeout(() => {
        handleSearch();
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [searchInput]);

  return (
    <Modal
      initialFocusRef={initialRef}
      finalFocusRef={finalRef}
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalOverlay />
      <ModalContent maxW={{ base: "sm", md: "lg", lg: "2xl" }}>
        <ModalHeader borderBottom={"1px solid"} borderColor={"blackAlpha.100"}>
          <InputGroup size="lg">
            <InputLeftElement>
              <Box color={"dark"}>
                <FaSearch />
              </Box>
            </InputLeftElement>
            <Input
              variant="ghost"
              placeholder={"Search by Address / Txn Hash / Block / Token / SNS"}
              value={searchInput}
              onClick={onOpen}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </InputGroup>
        </ModalHeader>
        {searchInput && (
          <ModalBody>
            {searchResults.map((result) => (
              <Flex direction="column" key={result.value} gap={1}>
                <motion.div>
                  <Text fontSize="xs" fontWeight="bold" color="dark">
                    {result.type.toUpperCase()}
                  </Text>
                  <Flex
                    bgColor={"lightest"}
                    borderRadius={6}
                    p={4}
                    as="a"
                    href={`/${result.type}/${result.value}`}
                    _hover={{ bgColor: "light" }}
                    gap={2}
                    alignItems="center"
                  >
                    <Box color="dark">
                      <FaFingerprint />
                    </Box>
                    <Text
                      fontSize="md"
                      color="dark"
                      _hover={{ color: "darkest" }}
                    >
                      {result.value}
                    </Text>
                    <Spacer />
                    <Box color="dark">
                      <motion.div
                        initial={{
                          x: -10,
                          opacity: 0,
                        }}
                        animate={{
                          x: 0,
                          opacity: 1,
                        }}
                        transition={{
                          duration: 0.5,
                        }}
                      >
                        <FaArrowRight />
                      </motion.div>
                    </Box>
                  </Flex>
                </motion.div>
              </Flex>
            ))}
          </ModalBody>
        )}
      </ModalContent>
    </Modal>
  );
};

export default SearchModal;
