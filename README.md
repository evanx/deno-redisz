# deno-redisz

![image](https://user-images.githubusercontent.com/899558/132098797-1ac4f73f-0609-454b-a78c-93783732557a.png)

Deno CLI utility for pretty printing Redis sort sets.

Recommended usage is to `alias` the `deno run` command with restricted access to Redis only, as follows:

```shell
alias redisz='deno -q run --allow-net=127.0.0.1:6379 https://raw.githubusercontent.com/evanx/deno-redisz/v0.0.1/main.ts'
```

Then this `redisz` alias can be used relatively securely as follows:

```shell
redisz <sorted set key, prefix or pattern>
```

- If no key is specified, then the util will scan, filter and print keys i.e. via `SCAN`
- If the key includes the '\*' wildcard character, then it is considered a pattern for `SCAN`
- If no key matches exactly, then the util will treat it as a prefix and add a wildcard

Deno will download the versioned dependencies into its cache, and run the utility with the restricted permissions specified in the `alias` command.

### Revision History

- 0.0.1 on 2021-09-04 defaults to ZREVRANGE

<hr>
<a href='https://twitter.com/evanxredis'>https://twitter.com/evanxredis</a>
