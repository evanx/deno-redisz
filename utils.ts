import * as Colors from "https://deno.land/std/fmt/colors.ts";
import { Redis, SimpleStringReply } from "https://deno.land/x/redis/mod.ts";

export function exitOk() {
  Deno.exit(0);
}

export function printInfoHeader(text: string) {
  console.error(Colors.yellow(text));
}

export function printInfoFooter(text: string) {
  console.error(Colors.gray(text));
}

export function unflattenRedis(array: string[]): Map<String, String> {
  const map = new Map();
  for (let index = 0; index < array.length; index += 2) {
    map.set(array[index], array[index + 1]);
  }
  return map;
}

export function parseRedisVersion(text: string) {
  const match = text.match(/\bredis_version:(\d\.\d+)/);
  return match ? match.pop() : "5.0";
}

export async function scanRedisKeys(
  redis: Redis,
  pattern: string,
  {
    cursor = 0,
    limit = 10,
    type = "",
    redisVersion = "5",
  },
) {
  if (type) {
    if (parseInt(redisVersion[0]) >= 6) {
      const [_, keys] = await redis.scan(cursor, {
        pattern,
        count: limit,
        type,
      });
      return keys;
    } else {
      const [_, keys] = await redis.scan(cursor, {
        pattern,
        count: limit * 5,
      });
      const pl = redis.pipeline();
      keys.map((key) => pl.type(key));
      const replies = await pl.flush();
      return replies.map((reply, index) => ({
        key: keys[index],
        type: (reply as SimpleStringReply).value(),
      })).filter((item) => item.type === type).slice(0, limit).map((
        { key },
      ) => key);
    }
  }
  const [_, keys] = await redis.scan(cursor, {
    pattern,
    count: limit,
  });
  return keys;
}
