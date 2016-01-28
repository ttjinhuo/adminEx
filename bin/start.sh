#!/bin/bash

PROJECT=$(pwd)
timestamp=$(date '+%s')
if [ -f "${PROJECT}/logs/adminEx-server.pid" ]; then  
    echo "adminEx-server is already running."
else
    echo "starting adminEx-server ... "
    nohup node server.js > ${PROJECT}/logs/adminEx-server-${timestamp}.log 2>&1 & echo $! > ${PROJECT}/logs/adminEx-server.pid
fi
