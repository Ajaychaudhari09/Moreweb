"use client";

interface Props {
  title: string;
  url: string; // ✅ must be passed from parent
}

export default function SocialShareButtons({ title, url }: Props) {
  const encodedURL = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  return (
    <div className="flex gap-4 mt-6">
      <a
        href={`https://twitter.com/share?url=${encodedURL}&text=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on Twitter"
        className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
      >
        Twitter
      </a>

      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedURL}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on Facebook"
        className="px-4 py-2 rounded-lg bg-blue-700 text-white hover:bg-blue-800 transition-colors"
      >
        Facebook
      </a>

      <a
        href={`https://wa.me/?text=${encodedTitle}%20${encodedURL}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on WhatsApp"
        className="px-4 py-2 rounded-lg bg-green-700 text-white hover:bg-green-800 transition-colors"
      >
        WhatsApp
      </a>
    </div>
  );
}
