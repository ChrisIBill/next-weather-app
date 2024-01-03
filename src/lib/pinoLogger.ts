import pino from 'pino'
import { createPinoBrowserSend, createWriteStream } from 'pino-logflare'

// create pino-logflare stream
const stream = createWriteStream({
    apiKey: process.env.NEXT_PUBLIC_LOGFLARE_KEY!,
    sourceToken: 'c6bd59e5-463f-4e88-a27a-ec69832bcb7a',
    fromBrowser: false,
})

// create pino-logflare browser stream
const send = createPinoBrowserSend({
    apiKey: process.env.NEXT_PUBLIC_LOGFLARE_KEY!,
    sourceToken: '2871dcb3-baf6-416f-9050-415ab388a776',
    fromBrowser: true,
})

const logger = pino(
    {
        //transport: {
        //    target: 'pino-pretty',
        //    options: {
        //        colorize: true,
        //    },
        //},
        browser: {
            disabled: false,
            transmit: {
                level: 'info',
                send: send,
            },
        },
        level: 'debug',
        base: {
            env: process.env.NODE_ENV,
        },
    },
    stream
)

export default logger
