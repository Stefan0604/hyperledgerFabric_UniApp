#!/bin/bash

export PATH=${PWD}/../bin:${PWD}:$PATH
export FABRIC_CFG_PATH=${PWD}/configtx
export VERBOSE=false

MODE=$1
ACTION=$2

function invoke() {
  scripts/invoke.sh $ACTION 

  if [ $? -ne 0 ]; then
    echo "ERROR !!! Deploying chaincode failed"
    exit 1
  fi

  exit 0
}
function query() {
  scripts/query.sh $ACTION

  if [ $? -ne 0 ]; then
    echo "ERROR !!! Querying failed"
    exit 1
  fi

  exit 0
}

if [ "${MODE}" == "query" ]; then
  query
elif [ "${MODE}" == "invoke" ]; then
  invoke
else
  echo "USAGE: 'query' or 'invoke' followed by chaincode eg. ./runChaincode.sh query '{"Args":["queryAllStudents"]}' "
  exit 1
fi
