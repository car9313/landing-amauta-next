export enum LocaleErrorCode {
  GEO_TIMEOUT = "GEO_TIMEOUT",
  GEO_HTTP_429 = "GEO_HTTP_429",
  GEO_PARSE_FAILED = "GEO_PARSE_FAILED",
  GEO_UNMAPPED_COUNTRY = "GEO_UNMAPPED_COUNTRY",
  GEO_UNREACHABLE = "GEO_UNREACHABLE",
  BUNDLE_FETCH_FAILED = "BUNDLE_FETCH_FAILED",
  BUNDLE_PARSE_FAILED = "BUNDLE_PARSE_FAILED",
  UNSUPPORTED_LOCALE = "UNSUPPORTED_LOCALE",
}

export class LocaleError extends Error {
  readonly code: LocaleErrorCode;
  readonly cause?: unknown;

  constructor(code: LocaleErrorCode, message?: string, cause?: unknown) {
    super(message ?? code);
    this.name = "LocaleError";
    this.code = code;
    this.cause = cause;
  }
}