import useSWR from "swr";
import { useRouter } from "next/router";
import Navbar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { CircularProgress, Box, Flex } from "@chakra-ui/react";
import { useEffect, useState } from "react";

export default function Layout({
  children,
  modalstate,
}: {
  children: React.ReactNode;
  modalstate: { isOpen: boolean; onOpen: () => void; onClose: () => void };
}) {
  const router = useRouter();
  const fetcher = (url: string, options?: RequestInit) => {
    return fetch(url, options).then((res) => res.json());
  };
  const [status, setStatus] = useState(null);
  const { data, error } = useSWR("/api/latestblock", fetcher);

  useEffect(() => {
    setStatus(data);
  }, [data]);

  const isHome =
    router.pathname === "/" || router.pathname === "/data" ? true : false;
  return (
    <>
      {isHome ? (
        <Navbar status={status} variant={"search"} modalstate={modalstate} />
      ) : (
        <Navbar status={status} modalstate={modalstate} />
      )}
      <main>{children}</main>
      <Footer />
    </>
  );
}
