import { Config, parseAliasFromDomain } from "@citizenwallet/sdk";
import { ReadonlyHeaders } from "next/dist/server/web/spec-extension/adapters/headers";

export const disabledWeb = ["seldesalm", "boliviapay"];

export const shouldShowWebLink = (alias: string) => {
  return !disabledWeb.includes(alias);
};

export const getCommunities = async (): Promise<Config[]> => {
  try {
    const response = await fetch(
      "https://config.internal.citizenwallet.xyz/v4/communities.json"
    );

    const communities: Config[] = await response.json();

    return communities;
  } catch (error) {
    return [];
  }
};

export const getCommunityFromHeaders = async (
  headersList: ReadonlyHeaders
): Promise<Config | undefined> => {
  const domain = headersList.get("host") || "";

  console.log("domain", domain);

  const alias =
    parseAliasFromDomain(domain, process.env.DOMAIN_BASE_PATH || "") ||
    "wallet.pay.brussels";

  console.log("alias", alias);

  const communities = await getCommunities();

  const community = communities.find((c) => c.community.alias === alias);

  return community;
};
