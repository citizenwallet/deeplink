import { getCommunityUrl } from "@/cw";
import DeepLinking from "./DeepLinking";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
          <div>Loading...</div>
        </main>
      }
    >
      <AsyncPage />
    </Suspense>
  );
}

async function AsyncPage() {
  const communities = await getCommunityUrl();

  return <DeepLinking communities={communities} />;
}
