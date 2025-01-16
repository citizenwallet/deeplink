export const getWindow = (): any => {
  return typeof window !== "undefined" ? window : {};
};

export const getNavigator = (): any => {
  return typeof navigator !== "undefined" ? navigator : {};
};

export const getScreen = (): any => {
  return typeof screen !== "undefined" ? screen : {};
};

export function isInAppBrowser() {
  const userAgent =
    (getNavigator()?.userAgent ||
      getNavigator()?.vendor ||
      getWindow()?.opera) ??
    "";

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
    typeof (getWindow()?.navigator as any)?.standalone === "undefined";
  const isViewportMismatch = getWindow()?.innerHeight < getScreen().height;

  return isUserAgentInApp || (isStandaloneUndefined && isViewportMismatch);
}
