/** @type {import('next').NextConfig} */
const path = require('path')
const { withAxiom } = require('next-axiom')

const nextConfig = withAxiom({
    sassOptions: {
        includePaths: [path.join(__dirname, 'styles')],
    },
    experimental: {
        serverComponentsExternalPackages: ['pino'],
    },
})

module.exports = nextConfig
