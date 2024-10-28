"use client";

// /#/?dl=faucet-v1&faucet-v1=alias%3Dwallet.wolugo.be%26address%3D0x6a5c6c77789115315d162B6659e666C52d30717F

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ConfigService, generateCommunityUrl } from "@citizenwallet/sdk";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  const router = useRouter();

  const [showStoreLinks, setShowStoreLinks] = useState(false);
  const [communityWebUrl, setCommunityWebUrl] = useState("");

  const getCommunityUrl = async (alias: string): Promise<string> => {
    const configService = new ConfigService();
    const config = await configService.getBySlug(alias);
    const communityUrl = generateCommunityUrl(config.community);

    return communityUrl;
  };

  useEffect(() => {
    const hash = window.location.hash.substring(2);

    console.log(hash);

    if (!hash) {
      return;
    }

    const getAndNav = async (openWebWallet: boolean = false) => {
      const match = hash.match(/alias=([^&]*)/);
      const alias = match ? match[1] : null;

      if (!alias) {
        return;
      }

      const communityUrl = await getCommunityUrl(alias);

      const webWalletUrl = `${communityUrl}/#/${hash}`;

      // Try to open the deep link
      setTimeout(() => {
        const fallback = () => {
          if (openWebWallet) {
            router.replace(webWalletUrl);
          }
        };

        const iframe = document.createElement("iframe");
        iframe.style.display = "none";
        iframe.src = `citizenwallet://${alias}${window.location.hash}`;

        document.body.appendChild(iframe);

        // If the deep link fails, this will run after a short delay
        setTimeout(() => {
          document.body.removeChild(iframe);
          fallback();
        }, 2000);
      }, 100);

      setCommunityWebUrl(webWalletUrl);
    };

    // Do something with the hash
    const params = new URLSearchParams(hash.substring(2));
    const match = hash.match(/dl=([^&]*)/);
    const deeplink = match ? match[1] : null;

    if (deeplink) {
      const handleDeeplink = async () => {
        switch (deeplink) {
          case "faucet-v1":
            const faucet = params.get("faucet-v1");
            const faucetParams = decodeURIComponent(faucet);
            const faucetParamsTokens = new URLSearchParams(faucetParams);
            const alias = faucetParamsTokens.get("alias");

            if (!alias) {
              return;
            }

            const communityUrl = await getCommunityUrl(alias);

            try {
              console.log(`citizenwallet://${alias}/${window.location.hash}`);
              router.replace(
                `citizenwallet://${alias}/${window.location.hash}`
              );
            } catch (e) {
              console.log("ERROR");
              console.error(e);
            }
            setCommunityWebUrl(`${communityUrl}/#/${hash}`);
            break;

          default:
            getAndNav();
            break;
        }
      };
      handleDeeplink();
    } else {
      // try to open app or go to web wallet
      if (hash.includes("voucher=")) {
        getAndNav(true);
        return;
      }

      getAndNav();
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
            <h1 className="scroll-m-20 text-3xl font-semibold tracking-tight lg:text-5xl">
              Download the{" "}
              <span className="font-extrabold">Citizen Wallet</span> app to
              continue
            </h1>
          </div>
          <div className="flex row gap-10 justify-center">
            <Store
              label="App Store"
              link="https://apps.apple.com/us/app/citizen-wallet/id6460822891"
              image="/app_store.svg"
              alt="App Store icon"
              size={120}
            />

            <div className="space"></div>

            <Store
              label="Play Store"
              link="https://play.google.com/store/apps/details?id=xyz.citizenwallet.wallet"
              image="/play_store.svg"
              alt="Play Store icon"
              size={120}
            />
          </div>
          <div className="my-10 text-center">
            <p>Then scan the QR code again.</p>
          </div>

          {communityWebUrl && (
            <>
              <div className="flex row gap-5 items-center">
                <div className="bg-gray-300 h-px w-full" />
                <p className="text-sm text-gray-500 uppercase">OR</p>
                <div className="bg-gray-300 h-px w-full" />
              </div>

              <div className="my-5" />

              <Button asChild>
                <Link href={communityWebUrl}>Open on web</Link>
              </Button>
            </>
          )}
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </main>
  );
}

interface StoreProps {
  label: string;
  link: string;
  image: string;
  alt: string;
  size: number;
}

const Store: React.FC<StoreProps> = ({ label, link, image, alt, size }) => {
  return (
    <a className="store-icon flex flex-col items-center" href={link}>
      <Image src={image} alt={alt} height={size} width={size} />
      <div className="h-3" />
      <small className="text-sm font-medium leading-none">{label}</small>
    </a>
  );
};
