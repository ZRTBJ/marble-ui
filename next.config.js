module.exports = {
  reactStrictMode: true,
  target: 'serverless',
  images: {
    loader: 'cloudinary',
    path: 'https://res.cloudinary.com/dk8s7xjsl/image/upload/',
  },
  webpack5: true,
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.resolve.alias.https = 'https-browserify'
    config.resolve.alias.http = 'http-browserify'
    config.resolve.alias.stream = 'stream-browserify'
    config.resolve.alias.crypto = false
    config.resolve.fallback = { fs: false, path: false }
    return config
  },
}
