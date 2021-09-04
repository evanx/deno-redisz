import { connect } from "https://deno.land/x/redis/mod.ts";
import {
  exitOk,
  exitWithErrorText,
  matchGroup,
  printInfoHeader,
  scanRedisKeys,
  unflattenRedis,
} from "./utils.ts";
import { formatMember } from "./helpers.ts";

const redis = await connect({
  hostname: "127.0.0.1",
  port: 6379,
});

const redisVersion = matchGroup(
  await redis.info(),
  /\bredis_version:(\d\.\d+)/,
);

if (Deno.args.length === 0) {
  const keys = await scanRedisKeys(redis, "*", { type: "zset" });
  if (!keys.length) {
    exitWithErrorText(
      "Usage: <key, prefix or pattern>",
    );
  }
  printInfoHeader(`Found matching keys:`);
  console.log(keys.join("\n"));
  exitOk();
}
const argKey = Deno.args[0];
const type = await redis.type(argKey);
if (type === "zset") {
  await processKey(argKey);
  exitOk();
}
const pattern = argKey.includes("*") ? argKey : `${argKey}*`;
const keys = await scanRedisKeys(redis, pattern, {
  type: "zset",
});
if (keys.length === 0) {
  exitWithErrorText("No matching keys");
}
if (keys.length > 1) {
  printInfoHeader(`Found matching zset keys:`);
  console.log(keys.join("\n"));
  exitOk();
}
const foundKey = keys[0];
printInfoHeader(`Found key: ${foundKey}`);
await processKey(foundKey);
exitOk();

async function processKey(key: string) {
  if (Deno.args.length > 1) {
    // TODO
  }
  await zrevrange(key, 0, 9);
}

async function zrevrange(key: string, start: number, stop: number) {
  const map = unflattenRedis(
    await redis.zrevrange(key, start, stop, { withScore: true }),
  );
  console.log(
    Array.from(map.entries()).map(([member, score]) =>
      formatMember(String(member), String(score))
    )
      .join(
        "\n",
      ),
  );
}
