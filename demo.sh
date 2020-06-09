#!/bin/bash
# If you want to pretty print the queries, use this alias and then pipe to it.
# alias pp="sed '1,4d;\$d;' | sed '\$d;' | python -m json.tool"
cd test-network/

MODE=$1


if [ "${MODE}" == "registerStudent" ]; then
  ./runChaincode.sh invoke '{"function":"registerStudent","Args":["'"${2}"'","'"${3}"'","'"${4}"'"]}'
elif [ "${MODE}" == "deregisterStudent" ]; then
  ./runChaincode.sh invoke '{"function":"deregisterStudent","Args":["'"${2}"'"]}'
elif [ "${MODE}" == "getStudent" ]; then
  ./runChaincode.sh invoke '{"function":"getStudent","Args":["'"${2}"'"]}'
elif [ "${MODE}" == "addExam" ]; then
  ./runChaincode.sh invoke '{"function":"addExam","Args":["'"${2}"'","'"${3}"'","'"${4}"'","'"${5}"'"]}'
elif [ "${MODE}" == "registerStudentForExam" ]; then
  ./runChaincode.sh invoke '{"function":"registerStudentForExam","Args":["'"${2}"'","'"${3}"'","'"${4}"'"]}'
elif [ "${MODE}" == "gradeStudentInExam" ]; then
  ./runChaincode.sh invoke '{"function":"gradeStudentInExam","Args":["'"${2}"'","'"${3}"'","'"${4}"'","'"${5}"'"]}'
elif [ "${MODE}" == "queryAllExamRegistrations" ]; then
  ./runChaincode.sh query '{"Args":["queryAllExamRegistrations"]}'
elif [ "${MODE}" == "queryAllExams" ]; then
  ./runChaincode.sh query '{"Args":["queryAllExams"]}'
elif [ "${MODE}" == "queryAllStudents" ]; then
  ./runChaincode.sh query '{"Args":["queryAllStudents"]}'
elif [ "${MODE}" == "getStudentSuccess" ]; then
  ./runChaincode.sh invoke '{"function":"getStudentSuccess","Args":["'"${2}"'"]}'
else
  echo "USAGE: Argument should be either 'queryAllStudents' or 'registerStudent' followed by id-number, name and email."
  cd ../
  exit 1
fi

cd ../
