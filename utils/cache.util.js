import { useRedis } from "./redis-client.util.js";

const DEFAULT_TTL = 300; // 5 minutes

export function useCache(namespace = "default") {
  const redis = useRedis().getClient();

  async function getCache(key) {
    try {
      const cached = await redis.get(key);
      return cached ? JSON.parse(cached) : null;
    } catch (err) {
      console.warn(
        `[Cache][Get] Error: ${err instanceof Error ? err.message : err}`,
      );
      return null;
    }
  }

  async function setCache(key, value, ttl = DEFAULT_TTL) {
    try {
      await redis.set(key, JSON.stringify(value), "EX", ttl);
      if (namespace) {
        await redis.sadd(`cache:ns:${namespace}`, key);
      }
    } catch (err) {
      console.warn(
        `[Cache][Set] Error: ${err instanceof Error ? err.message : err}`,
      );
    }
  }

  async function delCache(key) {
    try {
      await redis.del(key);
    } catch (err) {
      console.warn(
        `[Cache][Del] Error: ${err instanceof Error ? err.message : err}`,
      );
    }
  }

  async function delNamespace() {
    try {
      const keys = await redis.smembers(`cache:ns:${namespace}`);
      if (keys.length) {
        await redis.del(...keys);
      }
      await redis.del(`cache:ns:${namespace}`);
    } catch (err) {
      console.warn(
        `[Cache][DelNS] Error: ${err instanceof Error ? err.message : err}`,
      );
    }
  }

  return {
    getCache,
    setCache,
    delCache,
    delNamespace,
  };
}
