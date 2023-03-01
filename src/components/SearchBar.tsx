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
} from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";
const SearchBar = ({
  placeHolder,
  hasButton,
}: {
  placeHolder?: string;
  hasButton?: boolean;
}) => {
  return (
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
  );
};

export default SearchBar;
