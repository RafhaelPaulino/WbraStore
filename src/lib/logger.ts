type LogLevel = 'info' | 'warn' | 'error' | 'debug'

interface LogData {
  message: string
  level: LogLevel
  timestamp: string
  context?: Record<string, any>
  error?: Error
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development'

  private formatLog(data: LogData): string {
    const { timestamp, level, message, context, error } = data
    let log = `[${timestamp}] [${level.toUpperCase()}] ${message}`

    if (context) {
      log += ` | Context: ${JSON.stringify(context)}`
    }

    if (error) {
      log += ` | Error: ${error.message}\nStack: ${error.stack}`
    }

    return log
  }

  private log(level: LogLevel, message: string, context?: Record<string, any>, error?: Error) {
    const logData: LogData = {
      message,
      level,
      timestamp: new Date().toISOString(),
      context,
      error,
    }

    const formattedLog = this.formatLog(logData)

    // Em produção, você pode enviar para um serviço de logs (Sentry, LogRocket, etc.)
    if (!this.isDevelopment) {
      // TODO: Enviar para serviço de logs
      // sendToLogService(logData)
    }

    // Console logging
    switch (level) {
      case 'error':
        console.error(formattedLog)
        break
      case 'warn':
        console.warn(formattedLog)
        break
      case 'debug':
        if (this.isDevelopment) {
          console.debug(formattedLog)
        }
        break
      default:
        console.log(formattedLog)
    }
  }

  info(message: string, context?: Record<string, any>) {
    this.log('info', message, context)
  }

  warn(message: string, context?: Record<string, any>) {
    this.log('warn', message, context)
  }

  error(message: string, error?: Error, context?: Record<string, any>) {
    this.log('error', message, context, error)
  }

  debug(message: string, context?: Record<string, any>) {
    this.log('debug', message, context)
  }
}

export const logger = new Logger()
