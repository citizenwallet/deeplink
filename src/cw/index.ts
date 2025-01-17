import { Config } from "@citizenwallet/sdk";

export const disabledWeb = ["seldesalm"];

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
