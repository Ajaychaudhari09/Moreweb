// file: app/manifest.ts
import { MetadataRoute } from 'next'

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Morefusion',
    short_name: 'Morefusion',
    description: 'The central hub for the latest in AI, Tech, and Coding.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: '/favicon.ico', // Make sure you have a favicon
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}