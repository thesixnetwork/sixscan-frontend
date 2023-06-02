import {
  Box,
  Container,
  Divider,
  Flex,
  Grid,
  GridItem,
  Link,
  Stack,
  Text,
  Image,
} from "@chakra-ui/react";
import { FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <Box bgColor="lightest">
      <Container maxW="container.xl" py={4}>
        <Flex direction="row" align="center" marginTop="10px">
          {MENU_ITEMS.map((item, index) => (
            <Flex
              key={index}
              direction="row"
              alignItems="center"
              justifyContent="center"
              // borderRight={
              //   index !== MENU_ITEMS.length - 1 ? "1px solid" : "none"
              // }
              borderColor={"light"}
              px={2}
            >
              <Link
                href={item.href}
                color={"dark"}
                _hover={{ textDecoration: "none", color: "medium" }}
              >
                {item.icon ? (
                  <Image
                  src={item.icon}
                  alt="gen2"
                  width={"20px"}
                  height={"20px"}
                  />
                ) : (
                  <Text fontSize={"sm"} fontWeight={"bold"}>
                    {item.label}
                  </Text>
                )}
              </Link>
            </Flex>
          ))}
        </Flex>
        <Divider marginTop="15px" />
        <Flex
          direction={{ base: "column", md: "row" }}
          justify="space-between"
          align="center"
          marginTop="15px"
        >
          <Flex
            direction="row"
            alignItems="center"
            justifyContent="center"
            gap={4}
          >
            <Text fontSize={"12px"} color={"medium"} fontWeight={"bold"}>
              Privacy Policy | © 2023 SIX Network PTE. LTD.
            </Text>
          </Flex>

          <Flex
            direction="row"
            alignItems="center"
            justifyContent="center"
            gap={4}
          >
            <Image src="/icon-by-six.png" alt="logo" height={8} />
          </Flex>

        </Flex>
      </Container>
    </Box>
  );
};

const MENU_ITEMS = [
  {
    label: "Blocks",
    icon: "/twitter-icon.png",
    href: "https://twitter.com/theSIXnetwork",
  },
  {
    label: "Blocks",
    icon: "/icon-facebook.png",
    href: "https://web.facebook.com/thesixnetwork",
  },
  {
    label: "Blocks",
    icon: "/Icondiscord.png",
    href: "https://discord.com/invite/5gJQCXzcWf",
  },
  {
    label: "Blocks",
    icon: "/Icontelagram.png",
    href: "https://t.me/SIXnetwork",
  },
  {
    label: "Blocks",
    icon: "/Iconmail.png",
    href: "https://sixnetwork.medium.com/",
  },
  {
    label: "Blocks",
    icon: "/Iconline.png",
    href: "https://open.kakao.com/o/gQNRT5K",
  },
];

export default Footer;
