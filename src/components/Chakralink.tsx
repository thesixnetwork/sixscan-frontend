import NextLink from "next/link";
import { Link as ChakraLink } from "@chakra-ui/react";

interface ChakraNextLinkProps {
    href: string;
    children: React.ReactNode;
    [props: string]: any;
}


export const LinkComponent = typeof window !== 'undefined' ? _NextLink : ChakraNextLink;

export function ChakraNextLink({ href, children, ...props }: ChakraNextLinkProps) {
  return (
    <ChakraLink href={href} {...props}>
    {children}
    </ChakraLink>
  );
}

function _NextLink({ href, children, ...props }: ChakraNextLinkProps) {
  return (
    <NextLink href={href} passHref {...props}>
    {children}
    </NextLink>
  );
}
