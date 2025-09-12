import ENV from "./ENV";

const ENABLE_LOG: string | undefined =
  ENV.NEXT_PUBLIC_CONSOLE_LOG_ENABLE ||
  process.env.NEXT_PUBLIC_CONSOLE_LOG_ENABLE;

export const _LOG = (a: any, ...b: any[]): void => {
  if (ENABLE_LOG === "true") {
    console.log(a, ...b);
  }
};
