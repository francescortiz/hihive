#!/usr/bin/env bash

eval "$(/home/francescortiz/.local/bin/mise activate bash --shims)"

cd "$(dirname $0)"

bun run build

