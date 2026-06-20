import pako from "pako";

import { BACKEND_URL, BUCKET_URL, DISABLE_GCS } from "../constants";
import { log, round } from "../utils";

export const version = "v4";

type QueryOptions = {
  revalidate?: number;
  tags?: string[];
};

export function decompress(buffer: any) {
  const strData = pako.inflate(buffer, { to: "string" });
  const data = JSON.parse(strData);
  return data;
}

function cacheOptions(expiry: number, options?: QueryOptions) {
  return {
    next: {
      revalidate: options?.revalidate ?? expiry,
      tags: options?.tags,
    },
  };
}

async function query(
  _storageKey: string,
  apiPath: string,
  checkBucket: boolean,
  minLength: number,
  expiry: number,
  options?: QueryOptions
): Promise<any> {
  const start = performance.now();
  let data: any = null;

  try {
    if (!checkBucket || DISABLE_GCS) {
      throw new Error("Skip bucket check");
    }

    const fileName = apiPath.replace("?", ".").replace("&", ".");
    const res = await fetch(`${BUCKET_URL}${fileName}`, {
      ...cacheOptions(expiry, options),
      headers: {
        "Content-Type": "application/octet-stream",
      },
    });
    log(`${fileName} (bucket) took ${round(performance.now() - start, 0)}ms`);

    if (!res.ok) {
      throw new Error(`Failed to fetch from bucket: ${res.status}`);
    }

    data = decompress(await res.arrayBuffer());
  } catch (e) {
    console.log(e.message);
    const res = await fetch(`${BACKEND_URL}${apiPath}`, cacheOptions(expiry, options));
    log(`${apiPath} (backend) took ${round(performance.now() - start, 0)}ms`);
    if (res.ok) {
      data = await res.json();
    }
  }

  if (data && (minLength === 0 || data?.length > minLength)) {
    return data;
  }

  return undefined as any;
}

export default query;
