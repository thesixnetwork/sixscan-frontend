import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Text,
  Heading,
  Link,
  Flex,
  Spacer,
} from "@chakra-ui/react";
import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const CustomCard = ({
  title,
  footer,
  href,
  children,
  collapsed,
}: {
  children?: React.ReactNode;
  title?: string;
  footer?: string;
  href?: string;
  collapsed?: boolean;
}) => {
  const [isCollapsed, setIsCollapsed] = useState(collapsed);

  const handleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <Card size="lg">
      {title && (
        <CardHeader>
          <Flex onClick={handleCollapse} cursor="pointer" alignItems="center">
            <Heading size="md">{title}</Heading>
            <Spacer />
            <FaChevronDown
              fontSize={12}
              style={{
                transform: isCollapsed ? "rotate(0deg)" : "rotate(180deg)",
              }}
            />
          </Flex>
        </CardHeader>
      )}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <CardBody p={0}>{children}</CardBody>
          </motion.div>
        )}
      </AnimatePresence>
      {footer && href && (
        <CardFooter>
          <Link href={href}>
            <Text decoration={"underline"}>{footer}</Text>
          </Link>
        </CardFooter>
      )}
    </Card>
  );
};

export default CustomCard;
