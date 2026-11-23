"use strict";

export class ApiError extends Error {
  constructor(arg1, arg2, arg3 = {}) {
    let kind, message, options;

    // Проверяем, передан ли вторым аргументом объект (как в тестах)
    if (typeof arg2 === "object" && arg2 !== null) {
      message = arg1;
      options = arg2;
      kind = options.kind;
    } else {
      kind = arg1;
      message = arg2;
      options = arg3;
    }

    super(message || "Ошибка API");
    this.name = "ApiError";
    this.kind = kind;
    this.status = options?.status;
    this.code = options?.code;
    this.details = options?.details;
    this.url = options?.url;
    this.cause = options?.cause;
  }
}

export function buildUrl(baseUrl, path, query = {}) {
  const base = new URL(baseUrl);
  const cleanBase = base.origin + base.pathname.replace(/\/$/, "");
  const cleanPath = path.replace(/^\//, "");
  const url = new URL(`${cleanBase}/${cleanPath}`);

  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  }
  return url.toString();
}

export function createApiClient({ baseUrl, fetchFn = globalThis.fetch, timeoutMs = 5000 } = {}) {
  if (typeof baseUrl !== "string" || baseUrl.trim() === "") {
    throw new TypeError("baseUrl обязателен");
  }
  let parsedBaseUrl;
  try {
    parsedBaseUrl = new URL(baseUrl);
  } catch (e) {
    throw new TypeError("baseUrl должен быть абсолютным URL");
  }
  if (parsedBaseUrl.protocol !== "http:" && parsedBaseUrl.protocol !== "https:") {
    throw new TypeError("baseUrl должен использовать http или https");
  }
  if (parsedBaseUrl.search || parsedBaseUrl.hash) {
    throw new TypeError("baseUrl не должен содержать query или hash");
  }
  if (typeof fetchFn !== "function") {
    throw new TypeError("fetchFn должен быть функцией");
  }
  if (typeof timeoutMs !== "number" || !Number.isInteger(timeoutMs) || timeoutMs <= 0) {
    throw new TypeError("timeoutMs должен быть целым положительным числом");
  }

  return {
    async requestJson(path, options = {}) {
      const { method = "GET", query, body, signal, timeoutMs: requestTimeoutMs = timeoutMs } = options;
      const upperMethod = String(method).toUpperCase();
      
      if (!["GET", "POST", "PATCH", "DELETE"].includes(upperMethod)) {
        throw new TypeError("Метод не поддерживается");
      }
      if (upperMethod === "GET" && body !== undefined) {
        throw new TypeError("GET не может иметь body");
      }

      const url = buildUrl(baseUrl, path, query);
      
      const headers = { "Accept": "application/json" };
      let reqBody;
      if (body !== undefined) {
        headers["Content-Type"] = "application/json";
        reqBody = JSON.stringify(body);
      }

      const timeoutSignal = AbortSignal.timeout(requestTimeoutMs);
      const finalSignal = signal ? AbortSignal.any([signal, timeoutSignal]) : timeoutSignal;

      let response;
      try {
        response = await fetchFn(url, {
          method: upperMethod,
          headers,
          body: reqBody,
          signal: finalSignal
        });
      } catch (error) {
        if (error.name === "TimeoutError") throw new ApiError("timeout", "Время вышло", { url, cause: error });
        if (error.name === "AbortError") throw new ApiError("aborted", "Отменено", { url, cause: error });
        throw new ApiError("network", "Ошибка сети", { url, cause: error });
      }

      if (!response.ok) {
        let errorData = null;
        try {
          if ((response.headers.get("content-type") || "").includes("application/json")) {
            const payload = await response.json();
            if (payload && payload.error) errorData = payload.error;
          }
        } catch (e) { /* ignore */ }

        throw new ApiError("http", errorData?.message || `HTTP ${response.status}`, {
          status: response.status,
          code: errorData?.code,
          details: errorData?.details,
          url
        });
      }

      if (response.status === 204) return null;

      if (!(response.headers.get("content-type") || "").includes("application/json")) {
        throw new ApiError("invalid-response", "Ожидался JSON", { url });
      }

      try {
        return await response.json();
      } catch (error) {
        throw new ApiError("invalid-response", "Ошибка парсинга", { url, cause: error });
      }
    }
  };
}