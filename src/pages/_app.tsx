import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ChakraProvider, useDisclosure } from "@chakra-ui/react";
import theme from "@/styles/theme";
import Layout from "@/components/Layout";
import { useState ,useEffect } from "react";
import Router from "next/router";
import NextNProgress from 'nextjs-progressbar';

export default function App({ Component, pageProps }: AppProps) {
  const modalState = useDisclosure();
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.metaKey && event.key === "k") {
        modalState.onOpen();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [modalState.onOpen, modalState]);
  return (
    <>
    <ChakraProvider theme={theme}>
      <Layout modalstate={modalState}>
      <NextNProgress height={8} color="#209cee" /> 
      <Component modalstate={modalState} {...pageProps} />
      </Layout>
    </ChakraProvider>
    </>
  );
}
