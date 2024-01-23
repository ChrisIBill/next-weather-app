import pino from 'pino'
import { createPinoBrowserSend, createWriteStream } from 'pino-logflare'

// create pino-logflare stream
const prodStream = createWriteStream({
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

const pinoObj = {
    //transport: {
    //    targets: [
    //        {
    //            target: 'pino/file',
    //            options: {
    //                level: 'debug',
    //                destination: 1,
    //            },
    //        },
    //        {
    //            target: 'pino/file',
    //            options: {
    //                destination: './logs/app.log',
    //                level: 'info',
    //                browser: {
    //                    disabled: true,
    //                },
    //                mkdir: true,
    //            },
    //        },
    //    ],
    //},
    browser: {
        disabled: false,
        transmit: {
            level: 'info',
            send: send,
        },
    },
    formatters: {
        level: (label: string) => {
            return { level: label }
        },
    },
    //send to console if not production
    level: 'info',
}
const logger =
    process.env.NODE_ENV === 'production'
        ? pino(pinoObj, prodStream)
        : typeof pino.multistream === 'function'
        ? pino(
              pinoObj,
              pino.multistream([
                  {
                      stream: pino.destination('./logs/app.log'),
                  },
                  {
                      stream: pino.destination(1),
                  },
              ])
          )
        : pino(pinoObj, process.stdout)

export default logger
