import { CommunityConfig } from "@citizenwallet/sdk";

export const disabledWeb = ["seldesalm"];

export const shouldShowWebLink = (alias: string) => {
  return !disabledWeb.includes(alias);
};

export const getCommunityUrl = async (): Promise<CommunityConfig[]> => {
  try {
    const response = await fetch(
      "https://config.internal.citizenwallet.xyz/v4/communities.json"
    );

    const communities: CommunityConfig[] = await response.json();

    return communities;
  } catch (error) {
    return [];
  }
};
