#!/bin/bash
cd test-network/

MODE=$1


if [ "${MODE}" == "query" ]; then
  ./runChaincode.sh query '{"Args":["queryAllStudents"]}'
elif [ "${MODE}" == "registerStudent" ]; then
  ./runChaincode.sh invoke '{"function":"registerStudent","Args":["'"${2}"'","'"${3}"'","'"${4}"'"]}'
else
  echo "USAGE: Argument should be either 'query' or 'registerStudent' followed by id-number, name and email."
  cd ../
  exit 1
fi

cd ../
