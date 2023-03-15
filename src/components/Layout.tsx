import useSWR from "swr";
import { useRouter } from "next/router";
import Navbar from "@/components/NavBar";
import Footer from "@/components/Footer";

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const fetcher = (url: string, options?: RequestInit) => {
    return fetch(url, options).then((res) => res.json());
  };
  const { data, error } = useSWR("/api/latestblock", fetcher);
  if (error) return <div>Failed to load</div>;
  if (!data) return <div>Loading...</div>;

  const isHome = router.pathname === "/" ? true : false;

  return (
    <>
      {isHome ? (
        <Navbar status={data} variant={"search"} />
      ) : (
        <Navbar status={data} />
      )}
      <main>{children}</main>
      <Footer />
    </>
  );
}
