# hyperledgerFabric_UniApp

To be able to use this app you need the binaries, config and docker images from hyperledger fabric. Follow [these instructions](https://hyperledger-fabric.readthedocs.io/en/latest/install.html) to download them. After you installed them you have either to create softlinks to these folders or change all references in all relevant files.

To create the necessary softlinks you need, use:

```
ln -s *path_to_bin_folder* bin
ln -s *path_to_config_folder* config
```

To start the demo network with two organisations and deploy the chaincode, just use:

```
./setUpExample.sh
```

After that is done the network should be running and the chaincode should be deployed to the peers. To invoke the chaincode use the demo.sh script. The command line argument should be the name of the function which schould be invoked, followed by the respective parameters.

```
./demo.sh *name_of_the_function* *respective_parameters*
```

The function provided by the smart contract are the following:

* registerStudent(matriculationNumber, name, email)
* deregisterStudent(matriculationNumber)
* getStudent(matriculationNumber)
* addExam(name, startTime, endTime, ECTS)
* registerStudentForExam(examName, examDate, matriculationNumber)
* gradeStudentInExam(examName, examDate, matriculationNumber, grade)
* queryAllExamRegistrations()
* queryAllExams()
* queryAllStudents()
* getStudentSuccess(matriculationNumber)
