export function isInAppBrowser() {
  const userAgent =
    navigator.userAgent || navigator.vendor || (window as any)?.opera;

  const inAppKeywords = [
    "FBAN",
    "FBAV",
    "Instagram",
    "Twitter",
    "Snapchat",
    "Discord",
  ];

  const isUserAgentInApp = inAppKeywords.some((keyword) =>
    userAgent.includes(keyword)
  );
  const isStandaloneUndefined =
    typeof (window.navigator as any)?.standalone === "undefined";
  const isViewportMismatch = window.innerHeight < screen.height;

  return isUserAgentInApp || (isStandaloneUndefined && isViewportMismatch);
}
