"use client";

import { Twitter, Facebook, Linkedin } from "lucide-react";
import { usePathname } from "next/navigation";

export default function SocialShareButtons({ title }: { title: string }) {
  const pathname = usePathname();
  const url = `https://morefusion.in${pathname}`;

  const twitterShareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
    url
  )}&text=${encodeURIComponent(title)}`;
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    url
  )}`;
  const linkedinShareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
    url
  )}&title=${encodeURIComponent(title)}`;

  return (
    <div className="flex items-center gap-4 my-4">
      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
        Share this post:
      </p>
      <a
        href={twitterShareUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on Twitter"
      >
        <Twitter className="h-6 w-6 text-gray-500 hover:text-blue-500 transition-colors" />
      </a>
      <a
        href={facebookShareUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on Facebook"
      >
        <Facebook className="h-6 w-6 text-gray-500 hover:text-blue-700 transition-colors" />
      </a>
      <a
        href={linkedinShareUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on LinkedIn"
      >
        <Linkedin className="h-6 w-6 text-gray-500 hover:text-blue-600 transition-colors" />
      </a>
    </div>
  );
}
