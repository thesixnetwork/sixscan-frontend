import { Link, Text } from "@chakra-ui/react";

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
    <Link href={href}>
      <Text
        as={"span"}
        decoration={underline ? "underline" : "none"}
        color="primary.500"
      >
        {children}
      </Text>
    </Link>
  ) : (
    <Link href={href} _hover={{
      textDecoration: "none",
    }}>
      <Text
        as={"span"}
        decoration={underline ? "underline" : "none"}
        color="primary.500"
      >
        {children}
      </Text>
    </Link>
  );
};
