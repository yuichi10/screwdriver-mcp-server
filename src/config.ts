import config from "config";

export const serverConfig = {
  port: config.get<number>("port"),
  server: config.get<string>("server"),
  stateful: config.get<boolean>("stateful"),
};
