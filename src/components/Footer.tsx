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
              px={1}
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
                  width={"28px"}
                  height={"28px"}
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
        <Divider size="xl" marginTop="15px" borderColor={'black'} />
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
    label: "Twitter",
    icon: "/socials/twitter.png",
    href: "https://twitter.com/theSIXnetwork",
  },
  {
    label: "Facebook",
    icon: "/socials/facebook.png",
    href: "https://web.facebook.com/thesixnetwork",
  },
  {
    label: "Discord",
    icon: "/socials/discord.png",
    href: "https://discord.com/invite/5gJQCXzcWf",
  },
  {
    label: "Telegram",
    icon: "/socials/telegram.png",
    href: "https://t.me/SIXnetwork",
  },
  {
    label: "Medium",
    icon: "/socials/medium.png",
    href: "https://sixnetwork.medium.com/",
  },
  {
    label: "Line/Kakao",
    icon: "/socials/talk.png",
    href: "https://open.kakao.com/o/gQNRT5K",
  },
];

export default Footer;
