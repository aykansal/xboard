import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Create a new ratelimiter that allows 1 request per 20 seconds
export const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.tokenBucket(1, "20 s", 1),
  analytics: true,
  prefix: "xboard_ratelimit",
  ephemeralCache: new Map(),
}); 