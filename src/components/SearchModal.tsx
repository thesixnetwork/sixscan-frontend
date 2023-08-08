import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  // useDisclosure,
  Spacer,
  Spinner,
  InputGroup,
  InputLeftElement,
  Box,
  Input,
  Text,
  Flex,
  // VStack,
  Button
} from "@chakra-ui/react";
import {
  FaArrowRight,
  FaFingerprint,
  FaHashtag,
  FaLayerGroup,
  FaScroll,
  FaSearch,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { useEffect, useRef, useState, useCallback } from "react";
import {
  validateAddress,
  validateBlock,
  validateTxHash,
  validateContract,
} from "@/utils/validate";
import { LinkComponent } from "@/components/Chakralink";

// import { getSchemaByAddress, getSchemaByCodeAddr, getSchemaByCodeAddr2 } from "@/service/nftmngr";
import { Clickable } from "./Clickable";
import { _LOG } from "@/utils/log_helper";

type SearchResult = {
  type: "address" | "tx" | "block" | "schema" | "contract";
  value: any;
  icon: React.ReactNode;
};

type ResultContract = {
  originContractAddress: string;
  schemaCodes: any;
};

type ResultSchema = {
  originContractAddress: string;
  schemaCodes: string;
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
  const [isSchema, setIsSchema] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isContract, setIsContract] = useState(false);
  const [resultContract, setResultContract] = useState<ResultContract>();
  const [resultSchema, setResultSchema] = useState<ResultSchema[]>([]);


  const initialRef = useRef(null);
  const finalRef = useRef(null);


  const handleSearch = useCallback(async () => {
    const _searchResults: SearchResult[] = [];
    const isAddress = validateAddress(searchInput);
    const isTx = validateTxHash(searchInput);
    const isBlock = await validateBlock(searchInput);
    const isContractByAddress = await validateContract(searchInput);
    const _Schema = await fetch(`/api/getSchemaCode?input=${searchInput}`);
    const isSchema = await _Schema.json();
    const _ContractSchema = await fetch(`/api/getSchemaCodebyContract?input=${searchInput}`);
    const schemaByContract = await _ContractSchema.json();
    

    if (isAddress) {
      setIsSchema(false);
      setIsContract(false);
      _searchResults.push({
        type: "address",
        value: searchInput,
        icon: <FaFingerprint />,
      });
    } else if (isTx) {
      setIsSchema(false);
      setIsContract(false);
      _searchResults.push({
        type: "tx",
        value: searchInput,
        icon: <FaHashtag />,
      });
    } else if (isBlock) {
      setIsSchema(false);
      setIsContract(false);
      _searchResults.push({
        type: "block",
        value: searchInput,
        icon: <FaLayerGroup />,
      });
    } else if (isContractByAddress) {
      setIsContract(true);
      setIsSchema(false);
      setResultContract(schemaByContract);
    } else {
      setIsSchema(true);
      setIsContract(false);
      setResultSchema(isSchema);
    }

    setIsLoading(false);
    setSearchResults(_searchResults);
  }, [searchInput]);


  useEffect(() => {
    if (searchInput) {
      // Wait for 500ms before performing search
      const timeout = setTimeout(() => {
        handleSearch();
      }, 500);

      setIsLoading(true);
      return () => clearTimeout(timeout);
    }
  }, [searchInput, handleSearch]);
  return (
    <Modal
      initialFocusRef={initialRef}
      finalFocusRef={finalRef}
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalOverlay />
      <ModalContent maxW={{ base: "sm", md: "lg", lg: "2xl" }} >
        <ModalHeader borderBottom={"1px solid"} borderColor={"blackAlpha.100"}>
          <InputGroup size="lg">
            <InputLeftElement>
              <Box color={"dark"}>
                <FaSearch />
              </Box>
            </InputLeftElement>
            <Input
              variant="ghost"
              placeholder={"Search by Address / Txn Hash / Block / Schema"}
              value={searchInput}
              onClick={onOpen}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            {searchInput && isLoading && (
              <ModalBody>
                <Spinner
                  thickness='4px'
                  speed='0.65s'
                  emptyColor='gray.200'
                  color='blue.500'
                  size='md'
                />
              </ModalBody>)
            }
          </InputGroup>
        </ModalHeader>
        {searchInput && !isSchema && (
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
                    as={LinkComponent}
                    href={`/${result.type}/${result.value}`}
                    _hover={{ bgColor: "light" }}
                    gap={2}
                    alignItems="center"
                    onClick={onClose}
                  >
                    <Box color="dark">{result.icon}</Box>
                    <Box overflow="hidden">
                      <Text
                        fontSize="md"
                        color="dark"
                        _hover={{ color: "darkest" }}
                      >
                        {result.value}
                      </Text>
                    </Box>
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
        {searchInput && !isContract && isSchema && resultSchema && (
          <ModalBody style={{ height: '20%', overflowY: 'scroll' }}>
            <Flex direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
              <Text fontSize="xs" fontWeight="bold" color="dark">SCHEMA</Text>
              <Button fontSize="sl" colorScheme='gray' onClick={onClose}>
                <Clickable href="/schemas">
                  <Text fontSize="xs" fontWeight="bold" color="dark">
                    View More
                  </Text>
                </Clickable>
              </Button>
            </Flex>
            {resultSchema.map((x: any, index: number) => (
              <Flex direction="column" key={index} gap={1} pt={1}>
                <motion.div>
                  <Flex
                    bgColor={"lightest"}
                    borderRadius={6}
                    p={4}
                    as={LinkComponent}
                    href={`/schema/${x.schema_code}`}
                    _hover={{ bgColor: "light" }}
                    gap={2}
                    alignItems="center"
                    onClick={onClose}
                  >
                    <Box color="dark"><FaScroll /></Box>
                    <Text
                      fontSize="md"
                      color="dark"
                      _hover={{ color: "darkest" }}
                    >
                      {x.schema_code}
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
        {searchInput && isContract && resultContract && (
          <ModalBody>
            {resultContract.originContractAddress === undefined ? (
              <Flex direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
              <Text fontSize="xs" fontWeight="bold" color="dark">CONTRACT ADDRESS</Text>
              <Button fontSize="sl" colorScheme='gray' onClick={onClose}>
                  <Text fontSize="xs" fontWeight="bold" color="red">
                    NOT FOUND
                  </Text>
              </Button>
            </Flex>
            ):(
              <Flex direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
              <Text fontSize="xs" fontWeight="bold" color="dark">CONTRACT ADDRESS</Text>
              <Button fontSize="sl" colorScheme='gray' onClick={onClose}>
                <Clickable href={`/contract/${Array.isArray(resultContract) && resultContract.originContractAddress}`}>
                  <Text fontSize="xs" fontWeight="bold" color="dark">
                    View More
                  </Text>
                </Clickable>
              </Button>
            </Flex>
            )}
            {Array.isArray(resultContract) && resultContract.map((x: any, index: number) => (
              <Flex direction="column" key={index} gap={1} pt={1}>
                <motion.div>
                  <Flex
                    bgColor={"lightest"}
                    borderRadius={6}
                    p={4}
                    as={LinkComponent}
                    href={`/schema/${x.schema_code}`}
                    _hover={{ bgColor: "light" }}
                    gap={2}
                    alignItems="center"
                    onClick={onClose}
                  >
                    <Box color="dark"><FaScroll /></Box>
                    <Text
                      fontSize="md"
                      color="dark"
                      _hover={{ color: "darkest" }}
                    >
                      {x.schema_code}
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
