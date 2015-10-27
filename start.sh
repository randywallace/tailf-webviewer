#!/bin/bash

. /opt/eds/scripts/conf/env.sh
. /opt/eds/scripts/functions/core.sh

APP_NAME='tailf_server'

set_logging_output

SCRIPT_DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )

PIDFILE="${SCRIPT_DIR}/tailf.pid"
echo $$ > "${PIDFILE}"

BACKEND_PORT=${BACKEND_PORT:-9005}

run_backend() {
  pushd "${SCRIPT_DIR}/" > /dev/null 2>&1
    if ! [ -e "./websocketd" ]; then
      wget -c https://github.com/joewalnes/websocketd/releases/download/v0.2.11/websocketd-0.2.11-linux_amd64.zip -O websocketd.zip
      check_exit $?
      log $(unzip websocketd.zip websocketd)
      log $(rm -v websocketd.zip)
    fi
  popd > /dev/null 2>&1
  ./websocketd --port=${BACKEND_PORT} --staticdir=./www --dir=./server
}

trap 'killall' INT TERM

killall() {
    trap '' INT
    log "**** Shutting down... ****"
    kill -TERM 0
    wait
    log DONE
}

( run_backend ) &

wait || true
