"use client";

// /#/?dl=faucet-v1&faucet-v1=alias%3Dwallet.wolugo.be%26address%3D0x6a5c6c77789115315d162B6659e666C52d30717F

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CommunityConfig } from "@citizenwallet/sdk";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { getWindow, isInAppBrowser } from "./utils";
import { useTranslations } from "next-intl";

const getCommunityUrl = async (
  alias: string,
  communities: CommunityConfig[]
): Promise<string> => {
  try {
    const community = communities.find((c: any) => c.slug === alias);

    return community.communityUrl("app.citizenwallet.xyz");
  } catch (error) {
    return "";
  }
};

export default function Home({
  communities,
}: {
  communities: CommunityConfig[];
}) {
  const t = useTranslations("deepLinking");
  const hash = getWindow()?.location?.hash?.substring(2) ?? "";
  const router = useRouter();

  const [showStoreLinks, setShowStoreLinks] = useState(false);
  const [communityWebUrl, setCommunityWebUrl] = useState("");
  const [opening, setOpening] = useState(false);

  const getAndNav = useCallback(
    async (openWebWallet: boolean = false) => {
      const match = hash.match(/alias=([^&]*)/);
      const alias = match ? match[1] : null;

      if (!alias) {
        return;
      }

      setOpening(true);

      const communityUrl = await getCommunityUrl(alias, communities);

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
        iframe.src = `citizenwallet://${alias}${getWindow().location.hash}`;

        document.body.appendChild(iframe);

        // If the deep link fails, this will run after a short delay
        setTimeout(() => {
          setOpening(false);
          document.body.removeChild(iframe);
          fallback();
        }, 2000);
      }, 100);

      setCommunityWebUrl(webWalletUrl);
    },
    [router, hash, communities]
  );

  useEffect(() => {
    console.log(hash);

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

            const communityUrl = await getCommunityUrl(alias, communities);

            try {
              console.log(
                `citizenwallet://${alias}/${getWindow().location.hash}`
              );
              router.replace(
                `citizenwallet://${alias}/${getWindow().location.hash}`
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
  }, [router, hash, getAndNav, communities]);

  const potentiallyInAppBrowser = isInAppBrowser();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {showStoreLinks ? (
        <div className="flex flex-col justify-center">
          <div className="my-10 text-center">
            <h1 className="scroll-m-20 text-3xl font-semibold tracking-tight lg:text-5xl">
              {t("downloadTitle", {
                wallet: t("walletName"),
              })}
            </h1>
          </div>
          <div className="flex row gap-10 justify-center">
            <Store
              label={t("stores.appStore")}
              link="https://apps.apple.com/us/app/citizen-wallet/id6460822891"
              image="/app_store.svg"
              alt="App Store icon"
              size={120}
            />

            <div className="space"></div>

            <Store
              label={t("stores.playStore")}
              link="https://play.google.com/store/apps/details?id=xyz.citizenwallet.wallet"
              image="/play_store.svg"
              alt="Play Store icon"
              size={120}
            />
          </div>
          <div className="my-10 text-center">
            <p>{t("scanAgain")}</p>
          </div>
          <div className="flex row gap-5 items-center">
            <div className="bg-gray-300 h-px w-full" />
            <p className="text-sm text-gray-500 uppercase">{t("or")}</p>
            <div className="bg-gray-300 h-px w-full" />
          </div>

          <div className="my-5" />

          <div className="my-2 text-center">
            {potentiallyInAppBrowser ? (
              <p>{t("inAppBrowserWarning")}</p>
            ) : (
              <p>{t("alreadyHaveApp")}</p>
            )}
          </div>

          <Button
            className="mb-10"
            onClick={() => getAndNav()}
            disabled={opening}
          >
            {opening ? (
              <Loader2 className="w-4 h-4 animate-spin ml-2" />
            ) : (
              t("openInApp")
            )}
          </Button>

          {communityWebUrl && (
            <>
              <div className="flex row gap-5 items-center">
                <div className="bg-gray-300 h-px w-full" />
                <p className="text-sm text-gray-500 uppercase">{t("or")}</p>
                <div className="bg-gray-300 h-px w-full" />
              </div>

              <div className="my-5" />

              <div className="my-2 text-center">
                {potentiallyInAppBrowser ? (
                  <p>{t("inAppBrowserWarning")}</p>
                ) : (
                  <p>{t("noDownloadNeeded")}</p>
                )}
              </div>

              <Button asChild>
                <Link href={communityWebUrl}>{t("openInBrowser")}</Link>
              </Button>
            </>
          )}
        </div>
      ) : (
        <div>{t("loading")}</div>
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
