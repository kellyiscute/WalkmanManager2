export function isFullfilledPromise<T>(promise: PromiseSettledResult<T>): promise is PromiseFulfilledResult<T> {
  return promise.status === "fulfilled";
}
