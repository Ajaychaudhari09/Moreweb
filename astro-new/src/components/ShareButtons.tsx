export default function ShareButtons({ title }: { title: string }) {
  const url = typeof window !== "undefined" ? window.location.href : "";

  return (
    <div className="mt-10 flex gap-3">
      <a
        className="px-3 py-2 bg-blue-600 text-white rounded"
        target="_blank"
        aria-label="Share on Twitter"
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
          title
        )}&url=${url}`}
      >
        Twitter
      </a>

      <a
        className="px-3 py-2 bg-blue-700 text-white rounded"
        target="_blank"
        aria-label="Share on Facebook"
        href={`https://www.facebook.com/sharer/sharer.php?u=${url}`}
      >
        Facebook
      </a>

      <a
        className="px-3 py-2 bg-green-600 text-white rounded"
        target="_blank"
        aria-label="Share on WhatsApp"
        href={`https://wa.me/?text=${url}`}
      >
        WhatsApp
      </a>
    </div>
  );
}
