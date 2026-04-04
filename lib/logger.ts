export enum LogLevel {
  DEBUG = "debug",
  INFO = "info",
  WARN = "warn",
  ERROR = "error",
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  service: string;
  message: string;
  metadata?: Record<string, any>;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
}

export class Logger {
  private service: string;

  constructor(service: string) {
    this.service = service;
  }

  private formatEntry(level: LogLevel, message: string, metadata?: Record<string, any>, error?: Error): string {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      service: this.service,
      message,
      metadata,
      ...(error && {
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack,
        },
      }),
    };
    
    // In production, this would send to a logging service (Datadog, etc.)
    // For now, structured console output
    const logLine = JSON.stringify(entry);
    
    switch (level) {
      case LogLevel.ERROR:
      case LogLevel.WARN:
        console.error(logLine);
        break;
      default:
        console.log(logLine);
    }
    
    return logLine;
  }

  debug(message: string, metadata?: Record<string, any>) {
    return this.formatEntry(LogLevel.DEBUG, message, metadata);
  }

  info(message: string, metadata?: Record<string, any>) {
    return this.formatEntry(LogLevel.INFO, message, metadata);
  }

  warn(message: string, metadata?: Record<string, any>) {
    return this.formatEntry(LogLevel.WARN, message, metadata);
  }

  error(message: string, error?: Error, metadata?: Record<string, any>) {
    return this.formatEntry(LogLevel.ERROR, message, metadata, error);
  }
}

// Service loggers
export const scanLogger = new Logger("scan");
export const aiLogger = new Logger("ai");
export const routineLogger = new Logger("routine");
export const apiLogger = new Logger("api");
export const dbLogger = new Logger("database");