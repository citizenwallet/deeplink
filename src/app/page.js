"use client";

// /#/?dl=faucet-v1&faucet-v1=alias%3Dwallet.wolugo.be%26address%3D0x6a5c6c77789115315d162B6659e666C52d30717F

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const hash = window.location.hash.substring(2);
    if (hash) {
      // Do something with the hash
      const params = new URLSearchParams(hash.substring(2));
      const faucet = params.get("faucet-v1");
      const faucetParams = decodeURIComponent(faucet);
      const faucetParamsTokens = new URLSearchParams(faucetParams);
      const alias = faucetParamsTokens.get("alias");
      if (alias) {
        router.replace(`https://${alias}${window.location.hash}`);
      }
    }
  }, [router]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      Loading...
    </main>
  );
}
