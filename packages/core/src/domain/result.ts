export type AppErrorCode =
  | "INVALID_INPUT"
  | "LIVE_TRADING_NOT_ALLOWED"
  | "PROVIDER_UNAVAILABLE"
  | "INVALID_PROVIDER_RESPONSE"
  | "LOW_CONFIDENCE_ANALYSIS"
  | "UNSUPPORTED_INSTRUMENT"
  | "STALE_MARKET_DATA"
  | "INVALID_MARKET_DATA"
  | "INVALID_PAPER_ORDER"
  | "RISK_REJECTED"
  | "INSUFFICIENT_SIMULATED_BUYING_POWER"
  | "NOT_FOUND";

export type AppError = {
  code: AppErrorCode;
  message: string;
  cause?: unknown;
};

export type Result<T> = { ok: true; value: T } | { ok: false; error: AppError };

export const ok = <T>(value: T): Result<T> => ({ ok: true, value });

export const err = (code: AppErrorCode, message: string, cause?: unknown): Result<never> => ({
  ok: false,
  error: cause === undefined ? { code, message } : { code, message, cause },
});

export const unwrap = <T>(result: Result<T>): T => {
  if (!result.ok) {
    throw new Error(`${result.error.code}: ${result.error.message}`);
  }
  return result.value;
};
