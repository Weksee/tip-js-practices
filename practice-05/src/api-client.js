"use strict";

export class ApiError extends Error {
  constructor(kind, message, options = {}) {
    super(message);
    this.name = "ApiError";
    this.kind = kind;
    this.status = options.status;
    this.code = options.code;
    this.details = options.details;
    this.url = options.url;
    this.cause = options.cause;
  }
}

export function buildUrl(baseUrl, path, query = {}) {
  const base = new URL(baseUrl);
  if (base.search || base.hash) throw new Error("baseUrl не должен содержать query или hash");
  
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

export function createApiClient(config = {}) {
  if (!config || typeof config !== "object") {
    throw new TypeError("Конфигурация обязательна");
  }
  const { baseUrl, fetchFn = globalThis.fetch, timeoutMs = 5000 } = config;

  if (typeof baseUrl !== "string" || baseUrl.trim() === "") {
    throw new TypeError("baseUrl обязателен и должен быть строкой");
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
  // Тест 4 требует проверку на целое число (1.5 не пройдет)
  if (typeof timeoutMs !== "number" || !Number.isInteger(timeoutMs) || timeoutMs <= 0) {
    throw new TypeError("timeoutMs должен быть целым положительным числом");
  }

  return {
    async requestJson(path, options = {}) {
      const { query, signal, timeoutMs: reqTimeoutMs } = options;
      const url = buildUrl(baseUrl, path, query);
      const actualTimeout = reqTimeoutMs ?? timeoutMs;

      const timeoutSignal = AbortSignal.timeout(actualTimeout);
      let finalSignal = timeoutSignal;
      if (signal) {
        finalSignal = AbortSignal.any([signal, timeoutSignal]);
      }

      let response;
      try {
        response = await fetchFn(url, {
          method: "GET",
          headers: { Accept: "application/json" },
          signal: finalSignal
        });
      } catch (error) {
        if (error instanceof ApiError) throw error;
        if (error.name === "TimeoutError") {
          throw new ApiError("timeout", "Превышено время ожидания", { url, cause: error });
        }
        if (error.name === "AbortError") {
          throw new ApiError("aborted", "Запрос отменён", { url, cause: error });
        }
        throw new ApiError("network", "Ошибка сети", { url, cause: error });
      }

      if (!(response instanceof Response)) {
        throw new ApiError("invalid-response", "fetchFn вернул не Response", { url });
      }

      if (!response.ok) {
        let errorData = null;
        try {
          const contentType = response.headers.get("content-type") || "";
          if (contentType.includes("application/json")) {
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

      const contentType = response.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        throw new ApiError("invalid-response", "Ожидался JSON", { url });
      }

      try {
        return await response.json();
      } catch (error) {
        throw new ApiError("invalid-response", "Ошибка парсинга JSON", { url, cause: error });
      }
    }
  };
}