import { cleanEnv, port, str } from "envalid";
const env = cleanEnv(process.env, {
  PORT: port(),
  MONGO_URI: str(),
  SECRET: str(),
  NODE_ENV:str()

});
export default env;
