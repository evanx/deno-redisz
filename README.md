# deno-redisz

Deno CLI utility for pretty printing Redis hashes

Recommended usage is to `alias` the `deno run` command with restricted access to Redis only, as follows:

```shell
alias redish='deno -q run --allow-net=127.0.0.1:6379 https://raw.githubusercontent.com/evanx/deno-redisz/v0.0.1/main.ts'
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

- 0.0.1 on 2021-09-04

<hr>
<a href='https://twitter.com/EvanSummers16'>https://twitter.com/EvanSummers16</a>
