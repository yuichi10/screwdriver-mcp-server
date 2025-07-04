import config from "config";

export const serverConfig = {
  port: config.get<number>("port"),
  stateful: config.get<boolean>("stateful"),
};
