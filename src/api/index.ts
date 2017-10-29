declare var process: any;
export const API_URL = process.env.API_URL as string;
export const WS_URL = API_URL.slice().replace("http://", "ws://");
