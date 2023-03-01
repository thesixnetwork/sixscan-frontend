import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  Collapse,
  Icon,
  Link,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useColorModeValue,
  useDisclosure,
  Image,
} from "@chakra-ui/react";
import {
  HamburgerIcon,
  CloseIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from "@chakra-ui/icons";
import { FaChevronDown, FaChevronUp, FaCircle, FaWallet } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useRef } from "react";
import SearchBar from "./SearchBar";

export default function WithSubnavigation({ variant }: { variant?: string }) {
  const { isOpen, onToggle } = useDisclosure();
  const [activeChain, setActiveChain] = useState(CHAINS[0].label);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleChainChange = (chain: string) => {
    setActiveChain(chain);
    setIsDropdownOpen(false);
  };

  return (
    <Box>
      <Flex
        bg={useColorModeValue("white", "gray.800")}
        color={useColorModeValue("gray.600", "white")}
        minH={"60px"}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={"solid"}
        borderColor={useColorModeValue("gray.200", "gray.900")}
        align={"center"}
        gap={6}
      >
        <Flex
          flex={{ base: 1, md: "auto" }}
          ml={{ base: -2 }}
          display={{ base: "flex", md: "none" }}
        >
          <IconButton
            onClick={onToggle}
            icon={
              isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
            }
            variant={"ghost"}
            aria-label={"Toggle Navigation"}
          />
        </Flex>
        <Flex
          flex={{ base: 1 }}
          justify={{ base: "center", md: "start" }}
          alignItems="center"
        >
          <Link href="/" _hover={{ textDecoration: "none" }}>
            <Flex alignItems="center" direction={"row"} gap={2}>
              <Image src="/sixscan-logo.png" alt="logo" height={6} />
            </Flex>
          </Link>

          <Flex
            display={{ base: "none", md: "flex" }}
            ml={10}
            alignItems="center"
          >
            <DesktopNav />
          </Flex>
        </Flex>
        {variant === "search" ? null : (
          <Box display={{ base: "none", lg: "block" }}>
            <SearchBar />
          </Box>
        )}
        <Stack
          flex={{ base: 1, md: 0 }}
          justify={"flex-end"}
          direction={"row"}
          spacing={6}
        >
          <Box
            ref={dropdownRef}
            position="relative"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            cursor="pointer"
          >
            <Button
              leftIcon={
                <Box color="success">
                  <FaCircle />
                </Box>
              }
              rightIcon={isDropdownOpen ? <FaChevronUp /> : <FaChevronDown />}
              color={"light"}
              variant={"outline"}
            >
              <Text color="medium">{activeChain}</Text>
            </Button>
            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: -20 }}
                  animate={{
                    opacity: 1,
                    height: "auto",
                    y: 0,
                    transition: { type: "spring", stiffness: 300, damping: 20 },
                  }}
                  exit={{
                    opacity: 0,
                    height: 0,
                    y: -20,
                    transition: { type: "spring", stiffness: 300, damping: 20 },
                  }}
                >
                  <Box
                    position="absolute"
                    top="100%"
                    left={0}
                    width="100%"
                    borderRadius="md"
                    border="1px solid"
                    borderColor="light"
                    overflow="hidden"
                    shadow="md"
                    bg="white"
                    mt={1}
                    zIndex={1}
                  >
                    {CHAINS.map((chain) => (
                      <Box
                        key={chain.label}
                        p={2}
                        _hover={{ background: "gray.100" }}
                        onClick={() => handleChainChange(chain.label)}
                        color={"medium"}
                      >
                        {chain.label}
                      </Box>
                    ))}
                  </Box>
                </motion.div>
              )}
            </AnimatePresence>
          </Box>
          <Button display={{ base: "none", lg: "block" }}>
            <FaWallet />
          </Button>
        </Stack>
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <MobileNav />
      </Collapse>
    </Box>
  );
}

const DesktopNav = () => {
  const linkColor = useColorModeValue("gray.600", "gray.200");
  const linkHoverColor = useColorModeValue("gray.800", "white");
  const popoverContentBgColor = useColorModeValue("white", "gray.800");

  return (
    <Stack direction={"row"} spacing={4}>
      {NAV_ITEMS.map((navItem) => (
        <Box key={navItem.label}>
          <Popover trigger={"hover"} placement={"bottom-start"}>
            <PopoverTrigger>
              <Link
                p={2}
                href={navItem.href ?? "#"}
                fontSize={"sm"}
                fontWeight={500}
                color={linkColor}
                _hover={{
                  textDecoration: "none",
                  color: linkHoverColor,
                }}
              >
                {navItem.label}
              </Link>
            </PopoverTrigger>

            {navItem.children && (
              <PopoverContent
                border={0}
                boxShadow={"xl"}
                bg={popoverContentBgColor}
                p={4}
                rounded={"xl"}
                minW={"sm"}
              >
                <Stack>
                  {navItem.children.map((child) => (
                    <DesktopSubNav key={child.label} {...child} />
                  ))}
                </Stack>
              </PopoverContent>
            )}
          </Popover>
        </Box>
      ))}
    </Stack>
  );
};

const DesktopSubNav = ({ label, href, subLabel }: NavItem) => {
  return (
    <Link
      href={href}
      role={"group"}
      display={"block"}
      p={2}
      rounded={"md"}
      _hover={{ bg: "lightest" }}
    >
      <Stack direction={"row"} align={"center"}>
        <Box>
          <Text
            transition={"all .3s ease"}
            _groupHover={{ color: "primary.500" }}
            fontWeight={500}
          >
            {label}
          </Text>
          <Text fontSize={"sm"}>{subLabel}</Text>
        </Box>
        <Flex
          transition={"all .3s ease"}
          transform={"translateX(-10px)"}
          opacity={0}
          _groupHover={{ opacity: "100%", transform: "translateX(0)" }}
          justify={"flex-end"}
          align={"center"}
          flex={1}
        >
          <Icon color={"primary.500"} w={5} h={5} as={ChevronRightIcon} />
        </Flex>
      </Stack>
    </Link>
  );
};

const MobileNav = () => {
  return (
    <Stack
      bg={useColorModeValue("white", "gray.800")}
      p={4}
      display={{ md: "none" }}
    >
      <Box display={{ base: "block", lg: "none" }}>
        <SearchBar
          placeHolder={"Search by Address / Txn Hash / Block / Token / SNS"}
          hasButton
        />
      </Box>
      {NAV_ITEMS.map((navItem) => (
        <MobileNavItem key={navItem.label} {...navItem} />
      ))}
      <Flex>
        <Button width="100%">Connect Wallet</Button>
      </Flex>
    </Stack>
  );
};

const MobileNavItem = ({ label, children, href }: NavItem) => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Stack spacing={4} onClick={children && onToggle}>
      <Flex
        py={2}
        as={Link}
        href={href ?? "#"}
        justify={"space-between"}
        align={"center"}
        _hover={{
          textDecoration: "none",
        }}
      >
        <Text
          fontWeight={600}
          color={useColorModeValue("gray.600", "gray.200")}
        >
          {label}
        </Text>
        {children && (
          <Icon
            as={ChevronDownIcon}
            transition={"all .25s ease-in-out"}
            transform={isOpen ? "rotate(180deg)" : ""}
            w={6}
            h={6}
          />
        )}
      </Flex>

      <Collapse in={isOpen} animateOpacity style={{ marginTop: "0!important" }}>
        <Stack
          mt={2}
          pl={4}
          borderLeft={1}
          borderStyle={"solid"}
          borderColor={useColorModeValue("gray.200", "gray.700")}
          align={"start"}
        >
          {children &&
            children.map((child) => (
              <Link key={child.label} py={2} href={child.href}>
                {child.label}
              </Link>
            ))}
        </Stack>
      </Collapse>
    </Stack>
  );
};

interface NavItem {
  label: string;
  subLabel?: string;
  children?: Array<NavItem>;
  href?: string;
}

const NAV_ITEMS: Array<NavItem> = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Data Layer",
    href: "/data",
  },
  {
    label: "Blockchain",
    children: [
      {
        label: "Blocks",
        subLabel: "Latest Blocks from the network",
        href: "/blocks",
      },
      {
        label: "Validators",
        subLabel: "Leaderboard of validators",
        href: "/validators",
      },
    ],
  },
];

const CHAINS = [
  {
    label: "Mainnet",
    href: "/",
  },
  {
    label: "Testnet",
    href: "/",
  },
];
