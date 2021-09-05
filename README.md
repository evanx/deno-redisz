# deno-redisz

Deno CLI utility for pretty printing Redis sort sets.

Recommended usage is to `alias` the `deno run` command with restricted access to Redis only, as follows:

```shell
alias redisz='
  deno -q run --allow-net=127.0.0.1:6379 https://raw.githubusercontent.com/evanx/deno-redisz/v0.0.1/main.ts
'
```

### Usage

Then this `redisz` alias can be used relatively securely as follows:

```
redisz <command> <sorted set key, prefix or pattern> <start> <stop>
```

- supported commands: `zrevrange zrange zrevrangebyscore rangebyscore`
- commands are case-insensitive
- the default command is `zrevrange`
- the default `start` and `stop` are `0` and `9`
- If no key is specified, then the util will scan, filter and print keys i.e. via `SCAN`
- If the key includes the '\*' wildcard character, then it is considered a pattern for `SCAN`
- If no key matches exactly, then the util will treat it as a prefix and add a wildcard

Deno will download the versioned dependencies into its cache, and run the utility with the restricted permissions specified in the `alias` command.

### Demo

See the `redisz` CLI utility demo'ed in the "Terminal" in the following Visual Code screenshot:

![image](https://user-images.githubusercontent.com/899558/132129797-a0928d8b-76a7-4d17-bf44-df3fbd17e215.png)

### Revision History

- 2021-09-05 v0.0.1 defaults to ZREVRANGE also supports ZRANGE, ZRANGEBYSCORE, ZREVRANGEBYSCORE

<hr>
<a href='https://twitter.com/evanxredis'>https://twitter.com/evanxredis</a>
