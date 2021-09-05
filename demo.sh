#!/bin/bash
set -eu
redis-cli zadd test:redisz:z 1623000111001 member-1 | grep -q '^[0-1]$'
redis-cli zadd test:redisz:z 1623000111002 member-2 | grep -q '^[0-1]$'
redis-cli zadd test:redisz:z 1623000111003 member-3 | grep -q '^[0-1]$'

redisz() {
  if [ ${#} -eq 0 ] 
  then
    echo '> redisz'
    deno run --allow-net=127.0.0.1:6379 main.ts
  else
    echo '> redisz' "${@}"
    deno run --allow-net=127.0.0.1:6379 main.ts "${@}"
  fi
  echo
}

redisz || echo "OK"
redisz test || echo "OK"
redisz zrange test:redisz
redisz zrevrange test:redisz
redisz zrange test:redisz:z 0 2
redisz zrangebyscore test:redisz:z 1623000111001 1623000111002 
redisz zrevrangebyscore test:redisz:z 1623000111003 1623000111002
