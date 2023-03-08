import {
  Box,
  Container,
  Flex,
  Grid,
  GridItem,
  Link,
  Stack,
  Text,
  Image,
} from "@chakra-ui/react";
import { FaTwitter } from "react-icons/fa";

export const Footer = () => {
  return (
    <Box bgColor="lightest">
      <Container maxW="container.xl" py={4}>
        <Flex
          direction={{ base: "column", md: "row" }}
          justify="space-between"
          align="center"
        >
          <Flex
            direction="row"
            alignItems="center"
            justifyContent="center"
            gap={4}
          >
            <Image src="/sixprotocol-logo.png" alt="logo" height={6} />
            <Text fontSize={"sm"} color={"dark"} fontWeight={"bold"}>
              Powered By SIX Protocol
            </Text>
          </Flex>
          <Flex
            direction="row"
            alignItems="center"
            justifyContent="center"
            gap={4}
          >
            <Text fontSize={"sm"} color={"medium"} fontWeight={"bold"}>
              © 2022 SIX Network PTE. LTD.
            </Text>
          </Flex>

          <Flex direction="row" align="center">
            {MENU_ITEMS.map((item, index) => (
              <Flex
                key={index}
                direction="row"
                alignItems="center"
                justifyContent="center"
                borderRight={
                  index !== MENU_ITEMS.length - 1 ? "1px solid" : "none"
                }
                borderColor={"light"}
                px={4}
              >
                <Link
                  href={item.href}
                  color={"dark"}
                  _hover={{ textDecoration: "none", color: "medium" }}
                >
                  {item.icon ? (
                    <item.icon />
                  ) : (
                    <Text fontSize={"sm"} fontWeight={"bold"}>
                      {item.label}
                    </Text>
                  )}
                </Link>
              </Flex>
            ))}
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
};

const MENU_ITEMS = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Validators",
    href: "/validators",
  },
  {
    label: "Blocks",
    href: "/blocks",
  },
  {
    label: "Blocks",
    icon: FaTwitter,
    href: "https://twitter.com/theSIXnetwork",
  },
];
