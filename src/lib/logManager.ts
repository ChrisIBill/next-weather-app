import { EventEmitter } from 'events'
import { Logger } from './logger'

export class LogManager extends EventEmitter {
    private options: LogOptions = {
        minLevels: {
            '': 'info',
        },
    }

    // Prevent the console logger from being added twice
    private consoleLoggerRegistered: boolean = false

    public configure(options: LogOptions): LogManager {
        this.options = Object.assign({}, this.options, options)
        return this
    }

    public getLogger(module: string): Logger {
        let minLevel = 'none'
        let match = ''

        for (const key in this.options.minLevels) {
            if (module.startsWith(key) && key.length >= match.length) {
                minLevel = this.options.minLevels[key]
                match = key
            }
        }

        return new Logger(this, module, minLevel)
    }

    public onLogEntry(listener: (logEntry: LogEntry) => void): LogManager {
        this.on('log', listener)
        return this
    }

    // public registerConsoleLogger()
}

export interface LogEntry {
    level: string
    module: string
    location?: string
    message: string
}

export interface LogOptions {
    minLevels: { [module: string]: string }
}

export const logging = new LogManager()
