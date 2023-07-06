import ENV from "./ENV";

const ENABLE_LOG: string | undefined = ENV.CONSOLE_LOG_ENABLE || process.env.CONSOLE_LOG_ENABLE;
const ENABLE_LOG_TIME: string | undefined = ENV.CONSOLE_TIME_ENABLE || process.env.CONSOLE_TIME_ENABLE;
export const _LOG = (a: any, ...b: any[]): void => {
    if (ENABLE_LOG === "true") {
        console.log(a, ...b);
    }
};

export const _TIME_ENDLOG = (a: any): void => {
    if (ENABLE_LOG_TIME === "true") {
        console.timeEnd(a);
    }
};