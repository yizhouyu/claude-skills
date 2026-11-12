#!/bin/bash
# bash run.sh fetch|apply — concatenates the shared session helper with the chosen step and runs it in ego-browser.
D="$(cd "$(dirname "$0")" && pwd)"
case "$1" in fetch|apply) ;; *) echo "usage: run.sh fetch|apply"; exit 1;; esac
cat "$D/_session.mjs" "$D/$1.mjs" | ego-browser nodejs
