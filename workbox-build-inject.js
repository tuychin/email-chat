/* eslint-disable no-undef */
const {injectManifest} = require('workbox-build')

let workboxConfig = {
    globDirectory: 'build/',
    globPatterns: [
        'favicon.ico',
        'index.html',
        '*.css',
        '*.js',
    ],
    swSrc: 'public/service-worker-workbox.js',
    swDest: 'build/service-worker-workbox.js'
}

injectManifest(workboxConfig)
    .then(({count, size}) => {
        console.log(`Generated ${workboxConfig.swDest}, which will precache ${count} files, totaling ${size} bytes.`)
    })