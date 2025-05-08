import { Link as ChakraLink, Text } from "@chakra-ui/react";
import { LinkComponent } from "@/components/Chakralink";

export const Clickable = ({
  children,
  href,
  underline,
}: {
  children?: React.ReactNode;
  href?: string;
  underline?: boolean;
}) => {
  return underline ? (
    <LinkComponent href={href ? href : "#"}>
      <Text
        as={"span"}
        decoration={underline ? "underline" : "none"}
        color="primary.500"
      >
        {children}
      </Text>
    </LinkComponent>
  ) : (
    <LinkComponent
      href={href ? href : "#"}
      _hover={{
        textDecoration: "none",
      }}
    >
      <Text
        as={"span"}
        decoration={underline ? "underline" : "none"}
        color="primary.500"
      >
        {children}
      </Text>
    </LinkComponent>
  );
};
