"use client";

// /#/?dl=faucet-v1&faucet-v1=alias%3Dwallet.wolugo.be%26address%3D0x6a5c6c77789115315d162B6659e666C52d30717F

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ConfigService, generateCommunityUrl } from "@citizenwallet/sdk";
import Image from "next/image";

export default function Home() {
  const router = useRouter();

  const [showStoreLinks, setShowStoreLinks] = useState(false);

  useEffect(() => {
    const hash = window.location.hash.substring(2);
    if (hash) {
      // Do something with the hash
      const params = new URLSearchParams(hash.substring(2));
      const match = hash.match(/dl=([^&]*)/);
      const deeplink = match ? match[1] : null;
      if (deeplink) {
        switch (deeplink) {
          case "faucet-v1":
            const faucet = params.get("faucet-v1");
            const faucetParams = decodeURIComponent(faucet);
            const faucetParamsTokens = new URLSearchParams(faucetParams);
            const alias = faucetParamsTokens.get("alias");
            if (alias) {
              console.log(`citizenwallet://${alias}/${window.location.hash}`);
              try {
                router.replace(
                  `citizenwallet://${alias}/${window.location.hash}`
                );
              } catch (_) {}
            }
            break;

          default:
            break;
        }
      } else {
        // try to open app or go to web wallet
        const getAndNav = async () => {
          const configService = new ConfigService();

          const match = hash.match(/alias=([^&]*)/);
          const alias = match ? match[1] : null;

          const config = await configService.getBySlug(alias);

          if (config) {
            const communityUrl = generateCommunityUrl(config.community);

            try {
              console.log(`citizenwallet://${alias}${window.location.hash}`);
              router.replace(`citizenwallet://${alias}${window.location.hash}`);
            } catch (e) {
              console.log(`${communityUrl}/#/${hash}`);
              console.error(e);
              router.replace(`${communityUrl}/#/${hash}`);
            }
          }
        };

        getAndNav();
      }
    }

    setTimeout(() => {
      setShowStoreLinks(true);
    }, 1000);
  }, [router]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {showStoreLinks ? (
        <div className="flex flex-col justify-center">
          <div className="my-10 text-center">
            <h2>Download the Citizen Wallet app to continue</h2>
          </div>
          <div className="flex row gap-10 space-between">
            <a
              className="store-icon"
              href="https://apps.apple.com/us/app/citizen-wallet/id6460822891"
            >
              <Image
                src="/app_store.svg"
                alt="App Store icon"
                height={120}
                width={120}
              />
            </a>
            <div className="space"></div>
            <a
              className="store-icon"
              href="https://play.google.com/store/apps/details?id=xyz.citizenwallet.wallet"
            >
              <Image
                src="/play_store.svg"
                alt="Play Store icon"
                height={120}
                width={120}
              />
            </a>
          </div>
          <div className="my-10 text-center">
            <p>Then scan the QR code again.</p>
          </div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </main>
  );
}
