type LogLevel = "info" | "error" | "warn";

interface LogPayload {
  message: string;
  level: LogLevel;
  requestId?: string;
  context?: Record<string, any>;
  error?: any;
}

export function log({ message, level, requestId, context, error }: LogPayload) {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    level,
    message,
    requestId,
    context,
    error: error instanceof Error ? { message: error.message, stack: error.stack } : error,
  };

  if (level === "error") {
    console.error(JSON.stringify(logEntry));
  } else if (level === "warn") {
    console.warn(JSON.stringify(logEntry));
  } else {
    console.log(JSON.stringify(logEntry));
  }
}

export const logger = {
  info: (message: string, context?: Record<string, any>, requestId?: string) =>
    log({ level: "info", message, context, requestId }),
  warn: (message: string, context?: Record<string, any>, requestId?: string) =>
    log({ level: "warn", message, context, requestId }),
  error: (message: string, error?: any, context?: Record<string, any>, requestId?: string) =>
    log({ level: "error", message, error, context, requestId }),
};
