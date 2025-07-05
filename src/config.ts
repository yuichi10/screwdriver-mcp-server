import config from "config";

export const serverConfig = {
  port: config.get<number>("port"),
  server_mode: config.get<string>("server_mode"),
  stateful: config.get<boolean>("stateful"),
  api_url: config.get<string>("api_url"),
  token: config.get<string>("token"),
};
