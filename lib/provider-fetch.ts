type RetryOptions = {
  maxAttempts: number;
  retryDelayMs: number;
  timeoutMs: number;
};

export function isRetryableProviderStatus(status: number) {
  return status === 408 || status === 425 || status === 429 || status >= 500;
}

function isTimeoutError(error: unknown) {
  return (
    error instanceof Error &&
    (error.name === "TimeoutError" || error.name === "AbortError")
  );
}

function wait(milliseconds: number) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function createTimeoutError() {
  const error = new Error("Provider request timed out.");
  error.name = "TimeoutError";
  return error;
}

export async function fetchWithRetry(
  endpoint: string,
  request: Omit<RequestInit, "signal">,
  options: RetryOptions,
  fetcher: typeof fetch = fetch
) {
  const startedAt = Date.now();
  let lastError: unknown;

  for (let attempt = 1; attempt <= options.maxAttempts; attempt += 1) {
    const elapsed = Date.now() - startedAt;
    const remainingTimeout = options.timeoutMs - elapsed;

    if (remainingTimeout <= 0) {
      throw createTimeoutError();
    }

    try {
      const response = await fetcher(endpoint, {
        ...request,
        signal: AbortSignal.timeout(remainingTimeout),
      });

      const canRetry =
        attempt < options.maxAttempts &&
        isRetryableProviderStatus(response.status) &&
        Date.now() - startedAt + options.retryDelayMs < options.timeoutMs;

      if (!canRetry) {
        return response;
      }

      await response.body?.cancel();
    } catch (error) {
      lastError = error;

      const canRetry =
        attempt < options.maxAttempts &&
        !isTimeoutError(error) &&
        Date.now() - startedAt + options.retryDelayMs < options.timeoutMs;

      if (!canRetry) {
        throw error;
      }
    }

    await wait(options.retryDelayMs);
  }

  throw lastError instanceof Error
    ? lastError
    : new Error("Provider request failed.");
}
