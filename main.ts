import { connect } from "https://deno.land/x/redis/mod.ts";
import {
  exitOk,
  parseRedisVersion,
  printInfoHeader,
  scanRedisKeys,
  unflattenRedis,
} from "./utils.ts";
import { exitWithErrorText, formatMember } from "./helpers.ts";

const redis = await connect({
  hostname: "127.0.0.1",
  port: 6379,
});

const redisVersion = parseRedisVersion(await redis.info("server"));

if (Deno.args.length === 0) {
  await scanZKeys("*");
  exitWithErrorText(
    "Usage: <command> <key, prefix or pattern> ...",
  );
} else if (Deno.args.length === 1) {
  await scanZKeys(buildPattern(Deno.args[0]));
  exitWithErrorText(
    "Usage: <command> <key, prefix or pattern> ...",
  );
} else {
  await processArgs(Deno.args[0], Deno.args[1], Deno.args.slice(2));
}

function buildPattern(pattern: string) {
  return pattern.includes("*") ? pattern : `${pattern}*`;
}

async function scanZKeys(pattern: string) {
  const keys = await scanRedisKeys(redis, pattern, {
    type: "zset",
    redisVersion,
  });
  if (keys.length) {
    printInfoHeader(`Found matching keys:`);
    console.log(keys.join("\n"));
  }
}

async function processArgs(command: string, argKey: string, args: string[]) {
  const type = await redis.type(argKey);
  if (type === "zset") {
    await processKey(argKey, command, args);
  }
  const pattern = buildPattern(argKey);
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
  printInfoHeader(`Found key: ${command} ${foundKey}`);
  await processKey(foundKey, command, args);
}

async function processKey(key: string, command: string, args: string[]) {
  printInfoHeader(`${command} ${key}`);
  if (command === "zrevrange") {
    let start = 0;
    let stop = 9;
    if (args.length) {
      if (
        !(args.length === 2 && /^[0-9]+$/.test(args[0]) &&
          /^[0-9]+$/.test(args[1]))
      ) {
        exitWithErrorText(`Invalid args: ${command} ${args.join(" ")}`);
      }
      start = parseInt(args[0]);
      stop = parseInt(args[1]);
    }
    output(await redis.zrevrange(key, start, stop, { withScore: true }));
    exitOk();
  } else if (command === "zrange") {
    let start = 0;
    let stop = 9;
    if (args.length) {
      if (
        !(args.length === 2 && /^[0-9]+$/.test(args[0]) &&
          /^[0-9]+$/.test(args[1]))
      ) {
        exitWithErrorText(`Invalid args: ${command} ${args.join(" ")}`);
      }
      start = parseInt(args[0]);
      stop = parseInt(args[1]);
    }
    output(await redis.zrange(key, start, stop, { withScore: true }));
    exitOk();
  } else if (command === "zrangebyscore") {
    if (
      !(args.length === 2 && /^[0-9]+$/.test(args[0]) &&
        /^[0-9]+$/.test(args[1]))
    ) {
      exitWithErrorText(`Invalid args: ${command} ${args.join(" ")}`);
    }
    const start = parseInt(args[0]);
    const stop = parseInt(args[1]);
    output(await redis.zrangebyscore(key, start, stop, { withScore: true }));
    exitOk();
  } else if (command === "zrevrangebyscore") {
    if (
      !(args.length === 2 && /^[0-9]+$/.test(args[0]) &&
        /^[0-9]+$/.test(args[1]))
    ) {
      exitWithErrorText(`Invalid args: ${command} ${args.join(" ")}`);
    }
    const start = parseInt(args[0]);
    const stop = parseInt(args[1]);
    output(await redis.zrevrangebyscore(key, start, stop, { withScore: true }));
    exitOk();
  } else {
    exitWithErrorText(`Invalid command: ${command} ${JSON.stringify(args)}`);
  }
}

function output(members: string[]) {
  console.log(
    Array.from(unflattenRedis(members).entries()).map(([member, score]) =>
      formatMember(String(member), String(score))
    )
      .join(
        "\n",
      ),
  );
  exitOk();
}
