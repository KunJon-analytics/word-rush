import { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Earn Pi Tokens by Finding Words - Word Rush',
    short_name: 'Word Rush',
    description: 'Join Word Rush and earn Pi tokens by being the first person to find a word. A new word is revealed every hour, or until someone finds it. Hurry up and play now!',
    start_url: '/',
    display: 'standalone',
    background_color: '#fff',
    theme_color: '#fff',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}