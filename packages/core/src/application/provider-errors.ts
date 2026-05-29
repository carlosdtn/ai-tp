import { type AppErrorCode, type Result, err } from "../domain/result";

export const providerFailure = <T>(code: AppErrorCode, message: string): Result<T> =>
  err(code, message);
