'use strict';

const { Contract, Context } = require('fabric-contract-api');
const StudentExamRegistration = require('./StudentExamRegistration.js');
const Util = require('../ledger-api/Util.js')

class StudentExamRegistrationContract extends Contract {

    constructor() {
        super('org.universitynet.studentexamregistration');
    }

    async instantiate(ctx) {
        console.log('Instantiate the contract');
    }

    async registerStudentForExam(ctx, examName, matriculationNumber) {

        let studentExamRegistration = StudentExamRegistration.createInstance(examName, matriculationNumber);

        let key = this.ctx.stub.createCompositeKey("StudenExamRegistration", studentExamRegistration.getSplitKey());
        let data = studentExamRegistration.toBuffer();

        await this.ctx.stub.putState(key, data);

        return studentExamRegistration;
    }

    async gradeStudentInExam(ctx, examName, matriculationNumber, grade) {

        let key = Util.makeKey([examName, matriculationNumber]);
        let result = await ctx.stub.getState(key);

        let studentExamRegistration = Util.deserialize(data, {StudentExamRegistration});

        if (studentExamRegistration.isGraded()){
            throw new Error('The student with matriculationnumber ' + matriculationNumber + ' was already graded for exam ' + examName);
        }

        studentExamRegistration.setGrade(grade);

        await this.ctx.stub.putState(key, data);

        return studentExamRegistration;
    }

    async queryAllEntries(ctx) {
        const startKey = 'Exam0';
        const endKey = 'Exam999';
        const allResults = [];
        for await (const {key, value} of ctx.stub.getStateByRange(startKey, endKey)) {
            let record = Util.deserialize(value);
            allResults.push({ Key: key, Record: record });
        }
        console.info(allResults);
        return JSON.stringify(allResults);
    }
}

module.exports = StudentExamRegistrationContract;
