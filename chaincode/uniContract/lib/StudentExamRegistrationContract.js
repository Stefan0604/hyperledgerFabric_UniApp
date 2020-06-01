'use strict';

const { Contract, Context } = require('fabric-contract-api');
const StudentExamRegistration = require('./StudentExamRegistration.js');
const Util = require('../ledger-api/Util.js')

class StudentExamRegistrationContract extends Contract {

    constructor() {
        super('org.universitynet.studentexamregistration');
    }

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        const enrolls = [
            {
                examName: 'Discrete Structures',
                matriculationNumber: '03357848',
            },
            {
                examName: 'Calculus',
                matriculationNumber: '03357849',
            },
            {
                examName: 'Introduction to Informatics',
                matriculationNumber: '03357850',
            }
        ];

        for (let i = 0; i < enrolls.length; i++) {
            await this.registerStudentForExam(ctx, enrolls[i].examName, enrolls[i].matriculationNumber)
            console.info('Added <--> ', enrolls[i]);
        }
        console.info('============= END : Initialize Ledger ===========');
    }

    async registerStudentForExam(ctx, examName, matriculationNumber) {

        let studentExamRegistration = StudentExamRegistration.createInstance(examName, matriculationNumber);

        let key = ctx.stub.createCompositeKey("StudentExamRegistration", studentExamRegistration.getSplitKey());
        let data = studentExamRegistration.toBuffer();
        console.log("Key: " + key);

        await ctx.stub.putState(key, data);

        return studentExamRegistration;
    }

    async gradeStudentInExam(ctx, examName, matriculationNumber, grade) {

        let key = Util.makeKey([examName, matriculationNumber]);
        let result = await ctx.stub.getState(key);

        let studentExamRegistration = Util.deserialize(result);

        if (studentExamRegistration.isGraded()){
            throw new Error('The student with matriculationnumber ' + matriculationNumber + ' was already graded for exam ' + examName);
        }

        studentExamRegistration.setGrade(grade);

        await ctx.stub.putState(key, data);

        return studentExamRegistration;
    }

    async queryAllEntries(ctx) {
        const allResults = [];
        for await (const {key, value} of ctx.stub.getStateByPartialCompositeKey("StudentExamRegistration",[])) {
            let record = Util.deserialize(value, StudentExamRegistration);
            allResults.push({ Key: key, Record: record });
        }
        console.info(allResults);
        return JSON.stringify(allResults);
    }
}

module.exports = StudentExamRegistrationContract;
