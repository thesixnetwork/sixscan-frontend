import useSWR from "swr";
import { useRouter } from "next/router";
import Navbar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { CircularProgress, Box, Flex } from "@chakra-ui/react";

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
  const { data, error } = useSWR("/api/latestblock", fetcher);
  if (error) return <div>Failed to load</div>;
  if (!data)
    return (
      <Flex
        height="100vh"
        width="100vw"
        justifyContent="center"
        alignItems="center"
      >
        <CircularProgress isIndeterminate color="primary.500" />
      </Flex>
    );

  const isHome = router.pathname === "/" ? true : false;

  return (
    <>
      {isHome ? (
        <Navbar status={data} variant={"search"} modalstate={modalstate} />
      ) : (
        <Navbar status={data} modalstate={modalstate} />
      )}
      <main>{children}</main>
      <Footer />
    </>
  );
}
