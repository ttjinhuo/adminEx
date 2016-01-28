#!/bin/bash
PROJECT=$(pwd)
if [ -f "${PROJECT}/logs/adminEx-server.pid" ] 
then  
    pid=$(cat ${PROJECT}/logs/adminEx-server.pid)
    kill -QUIT ${pid}
    rm ${PROJECT}/logs/adminEx-server.pid
    echo "adminEx-server stopped."
else 
    echo "adminEx-server not running."
fi
