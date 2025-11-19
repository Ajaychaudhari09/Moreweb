// src/components/AdsterraAd.tsx
"use client";

import React, { useEffect, useState } from "react";
import Script from "next/script";

interface AdsterraAdProps {
  rootSelector?: string;
  placement?: "inline" | "sidebar" | "footer";
}

const containerId = "container-08f243939922b6d9aa749c7eb572ab12";
const scriptSrc =
  "//pl28064811.effectivegatecpm.com/08f243939922b6d9aa749c7eb572ab12/invoke.js";

function readCookie(name: string) {
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : null;
}

function setCookie(name: string, value: string, days = 365) {
  const maxAge = days * 24 * 60 * 60;
  document.cookie = `${name}=${encodeURIComponent(
    value
  )};path=/;max-age=${maxAge};SameSite=Lax`;
}

export default function AdsterraAd({
  rootSelector = ".article-content",
  placement = "inline",
}: AdsterraAdProps): React.ReactElement | null {
  const ADS_ENABLED = process.env.NEXT_PUBLIC_ENABLE_ADS === "true";
  const [consent, setConsent] = useState<boolean | null>(null);
  const [injected, setInjected] = useState(false);

  // 1️⃣ Check GDPR consent
  useEffect(() => {
    if (!ADS_ENABLED) return;
    const c = readCookie("ads_consent");
    setConsent(c === "true" ? true : c === "false" ? false : null);
  }, [ADS_ENABLED]);

  // 2️⃣ Inject ad container (never block rendering)
  useEffect(() => {
    if (!ADS_ENABLED || !consent || injected) return;

    try {
      const root = document.querySelector(rootSelector);
      if (!root) return;

      // Avoid duplicate injection
      if (document.getElementById(containerId)) {
        setInjected(true);
        return;
      }

      const adSlot = document.createElement("div");
      adSlot.id = containerId;
      adSlot.className =
        "adsterra-ad my-6 w-full flex justify-center min-h-[90px]";

      // Insert after first <p> if available
      const firstP = root.querySelector("p");
      if (placement === "inline" && firstP?.parentNode) {
        firstP.parentNode.insertBefore(adSlot, firstP.nextSibling);
      } else {
        root.appendChild(adSlot);
      }

      setInjected(true);
    } catch (err) {
      console.error("Adsterra injection failed:", err);
    }
  }, [consent, injected, ADS_ENABLED, rootSelector, placement]);

  // 3️⃣ GDPR Banner
  if (!ADS_ENABLED) return null;

  return (
    <>
      {consent === null && (
        <div className="ad-consent-banner my-6 p-4 bg-gray-50 dark:bg-gray-800 border rounded-md flex flex-col sm:flex-row items-center gap-3">
          <div className="flex-1 text-sm text-gray-700 dark:text-gray-200">
            This site uses ads to support content. Do you consent to display personalized ads?
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setCookie("ads_consent", "true");
                setConsent(true);
              }}
              className="px-3 py-1 rounded bg-blue-600 text-white text-sm button-3d"
            >
              Accept
            </button>
            <button
              onClick={() => {
                setCookie("ads_consent", "false");
                setConsent(false);
              }}
              className="px-3 py-1 rounded border text-sm bg-white dark:bg-gray-700"
            >
              Decline
            </button>
          </div>
        </div>
      )}

      {/* 🚀 Load Adsterra JS only AFTER consent & page idle */}
      {consent === true && (
        <Script
          id="adsterra-script"
          src={scriptSrc}
          strategy="lazyOnload"
          data-cfasync="false"
          onError={() => console.error("Adsterra script failed to load")}
        />
      )}
    </>
  );
}
