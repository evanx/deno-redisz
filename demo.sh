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

redisz
redisz test
redisz test:redisz
redisz test:redisz:z
