export function stringToArray(str: string, size: number) {
  const arr: string[] = str.split(",");
  const result: string[][] = [];
  for (let i = 0; i < Math.ceil(arr.length / size); i++) {
    const start = i * size;
    const end = start + size;
    result.push(arr.slice(start, end));
  }
  return result;
}

// Read all environment variable configuration files to process.env
export function wrapperEnv(envConf: Recordable): ViteEnv {
  const ret: any = {};
  for (const envName of Object.keys(envConf)) {
    let realName = envConf[envName].replace(/\\n/g, "\n");
    realName = realName === "true" ? true : realName === "false" ? false : realName;
    if (envName === "VITE_PORT") {
      realName = Number(realName);
    }
    if (envName === "VITE_PROXY") {
      try {
        realName = JSON.parse(realName);
      } catch (error) {
        if (Object.prototype.toString.call(realName) === "[object String]") {
          realName = stringToArray(realName, 2);
        }
      }
    }
    ret[envName] = realName;
    process.env[envName] = realName;
  }
  return ret;
}
