"use client";
import React, { useEffect, useState } from "react";

function readCookie(name: string) {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

function setCookie(name: string, value: string, days = 365) {
  const maxAge = days * 24 * 60 * 60;
  document.cookie = `${name}=${encodeURIComponent(value)};path=/;max-age=${maxAge}`;
}

export default function AdsterraAd(): React.ReactElement | null {
  const ADS_ENABLED = process.env.NEXT_PUBLIC_ENABLE_ADS === "true";
  const [consent, setConsent] = useState<boolean | null>(null);
  const [injected, setInjected] = useState(false);

  // initialize consent state on mount
  useEffect(() => {
    if (!ADS_ENABLED) return;
    const c = readCookie("ads_consent");
    if (c === "true") setConsent(true);
    else if (c === "false") setConsent(false);
    else setConsent(null);
  }, [ADS_ENABLED]);

  // inject ad once consent === true
  useEffect(() => {
    if (!ADS_ENABLED) return;
    if (!consent || injected) return;

    try {
      const containerId = "container-08f243939922b6d9aa749c7eb572ab12";
      const scriptSrc = "//pl28064811.effectivegatecpm.com/08f243939922b6d9aa749c7eb572ab12/invoke.js";

      const root = document.querySelector(".article-content");
      if (!root) return;

      if (document.getElementById(containerId)) {
        setInjected(true);
        return;
      }

      const firstP = root.querySelector("p");

      const adContainer = document.createElement("div");
      adContainer.id = containerId;
      adContainer.className = "adsterra-ad my-6 flex justify-center";

      if (firstP && firstP.parentNode) {
        if (firstP.nextSibling) firstP.parentNode.insertBefore(adContainer, firstP.nextSibling);
        else firstP.parentNode.appendChild(adContainer);
      } else {
        root.appendChild(adContainer);
      }

      const s = document.createElement("script");
      s.async = true;
      s.setAttribute("data-cfasync", "false");
      s.src = scriptSrc.startsWith("//") ? window.location.protocol + scriptSrc : scriptSrc;
      s.type = "text/javascript";
      adContainer.appendChild(s);

      setInjected(true);
    } catch (err) {
      console.error("Adsterra injection failed:", err);
    }
  }, [consent, injected, ADS_ENABLED]);

  const accept = () => {
    setCookie("ads_consent", "true", 365);
    setConsent(true);
  };

  const decline = () => {
    setCookie("ads_consent", "false", 365);
    setConsent(false);
  };

  // If ads disabled by env, render nothing
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
              onClick={accept}
              className="px-3 py-1 rounded bg-blue-600 text-white text-sm button-3d"
            >
              Accept
            </button>
            <button
              onClick={decline}
              className="px-3 py-1 rounded border text-sm bg-white dark:bg-gray-700"
            >
              Decline
            </button>
          </div>
        </div>
      )}
    </>
  );
}
