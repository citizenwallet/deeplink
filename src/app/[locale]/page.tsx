import { CommunityConfig } from "@citizenwallet/sdk";
import DeepLinking from "../DeepLinking";

export default async function Home() {
  // Your existing page logic here
  const communities: CommunityConfig[] = []; // Add your communities data here

  return <DeepLinking communities={communities} />;
}
