'use strict';

const { Contract, Context } = require('fabric-contract-api');
const StudentExamRegistration = require('./StudentExamRegistration.js');
const Student = require('./Student.js');
const Exam = require('./Exam.js');
const Util = require('../ledger-api/Util.js')

class StudentExamRegistrationContract extends Contract {

    constructor() {
        super('org.universitynet.studentexamregistration');
    }

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');

        const students = [
            {
                matriculationNumber: "0123456",
                name: "Stefan",
                email: "stefan@uni.org"
            },
            {
                matriculationNumber: "0123457",
                name: "Max",
                email: "max@uni.org"
            }
        ];

        const exams = [
            {
                name: "Calculus",
                startTime: "2020-07-25T12:00:00Z",
                endTime: "2020-07-25T14:00:00Z",
                ECTS: "5"
            },
            {
                name: "Linear-Algebra",
                startTime: "2020-07-28T08:00:00Z",
                endTime: "2020-07-28T11:00:00Z",
                ECTS: "8"
            },
            {
                name: "Analysis",
                startTime: "2020-08-04T14:00:00Z",
                endTime: "2020-08-04T15:00:00Z",
                ECTS: "6"
            }
        ];

        const examRegistrations = [
            {
                examName: "Calculus",
                examDate: "2020-07-25",
                matriculationNumber: "0123456"
            },
            {
                examName: "Linear-Algebra",
                examDate: "2020-07-28",
                matriculationNumber: "0123456"
            },
            {
                examName: "Linear-Algebra",
                examDate: "2020-07-28",
                matriculationNumber: "0123457"
            }
        ];

        const examGradings = [
            {
                examName: "Calculus",
                examDate: "2020-07-25",
                matriculationNumber: "0123456",
                grade: "A"
            }
        ];


        for (let i = 0; i < students.length; i++) {
            await this.registerStudent(ctx, students[i].matriculationNumber, students[i].name, students[i].email);
            console.info('Added <--> ', students[i]);
        }
        for (let i = 0; i < exams.length; i++) {
            await this.addExam(ctx, exams[i].name, exams[i].startTime, exams[i].endTime, exams[i].ECTS);
            console.info('Added <--> ', exams[i]);
        }
        for (let i = 0; i < examRegistrations.length; i++) {
            let studentExamRegistration = StudentExamRegistration.createInstance(examRegistrations[i].matriculationNumber, examRegistrations[i].examName, examRegistrations[i].examDate);

            let key = ctx.stub.createCompositeKey("StudentExamRegistration", studentExamRegistration.getSplitKey());
            let data = studentExamRegistration.toBuffer();

            await ctx.stub.putState(key, data);

            console.info('Added <--> ', examRegistrations[i]);
        }


        for (let i = 0; i < examGradings.length; i++) {
            let examRegistration = StudentExamRegistration.createInstance(examGradings[i].matriculationNumber, examGradings[i].examName, examGradings[i].examDate);

            examRegistration.setGrade(examGradings[i].grade);

            let key = ctx.stub.createCompositeKey("StudentExamRegistration", examRegistration.getSplitKey());
            let data = examRegistration.toBuffer();

            await ctx.stub.putState(key, data);
            console.info('Added <--> ', examGradings[i]);
        }
        console.info('============= END : Initialize Ledger ===========');
    }

    async registerStudent(ctx, matriculationNumber, name, email){
        let student = Student.createInstance(matriculationNumber, name, email);

        let key = ctx.stub.createCompositeKey("Student", student.getSplitKey());
        let data = student.toBuffer();

        await ctx.stub.putState(key, data);

        return student;
    }

    async deregisterStudent(ctx, matriculationNumber){
        let student = this.getStudent(ctx, matriculationNumber);

        student.deregister();

        ctx.stub.putState(firstElement.value.key, student.toBuffer());

        return student;
    }

    async getStudent(ctx, matriculationNumber){
        let student = null;
        const attributes = [matriculationNumber];

        let iterator = await ctx.stub.getStateByPartialCompositeKey("Student", attributes);
        let firstElement = await iterator.next();

        if (firstElement && firstElement.value){
            student = Student.fromBuffer(firstElement.value.value);
        }
        else {
            throw Error("Student does not exist");
        }

        return student;
    }

    async addExam(ctx, name, startTime, endTime, ECTS){
        let exam = Exam.createInstance(name, new Date(startTime), new Date(endTime), ECTS);

        let key = ctx.stub.createCompositeKey("Exam", exam.getSplitKey());
        let data = exam.toBuffer();

        await ctx.stub.putState(key, data);

        return exam;
    }

    async registerStudentForExam(ctx, examName, examDate, matriculationNumber) {

        const studentAttributes = [matriculationNumber];

        let studentIterator = await ctx.stub.getStateByPartialCompositeKey("Student", studentAttributes);
        let studentFirstElement = await studentIterator.next();


        if (!studentFirstElement || !studentFirstElement.value){
            throw Error("Student does not exist");
        }

        const examAttributes = [examName, Util.createDateKey(new Date(examDate))];

        let examIterator = await ctx.stub.getStateByPartialCompositeKey("Exam", examAttributes);
        let examFirstElement = await examIterator.next();

        if (!examFirstElement || !examFirstElement.value){
            throw Error("Exam does not exist");
        }

        let studentExamRegistration = StudentExamRegistration.createInstance(matriculationNumber, examName, new Date(examDate));

        let key = ctx.stub.createCompositeKey("StudentExamRegistration", studentExamRegistration.getSplitKey());
        let data = studentExamRegistration.toBuffer();

        await ctx.stub.putState(key, data);

        return studentExamRegistration;
    }

    async gradeStudentInExam(ctx, examName, examDate, matriculationNumber, grade) {

        const studentAttributes = [matriculationNumber];
        const examAttributes = [examName, Util.createDateKey(new Date(examDate))];
        const examRegistrationAttributes = [matriculationNumber, examName, Util.createDateKey(new Date(examDate))];

        let studentIterator = await ctx.stub.getStateByPartialCompositeKey("Student", studentAttributes);
        let studentFirstElement = await studentIterator.next();

        let examIterator = await ctx.stub.getStateByPartialCompositeKey("Exam", examAttributes);
        let examFirstElement = await examIterator.next();

        let examRegistrationIterator = await ctx.stub.getStateByPartialCompositeKey("StudentExamRegistration", examRegistrationAttributes);
        let examRegistrationFirstElement = await examRegistrationIterator.next();

        if (!studentFirstElement || !studentFirstElement.value){
            throw Error("Student does not exist");
        }

        if (!examFirstElement || !examFirstElement.value){
            throw Error("Exam does not exist");
        }

        if (!examRegistrationFirstElement || !examRegistrationFirstElement.value){
            throw Error("ExamRegistration does not exist");
        }


        let examRegistration = StudentExamRegistration.fromBuffer(examRegistrationFirstElement.value.value);

        if (examRegistration.isGraded()){
            throw new Error('The student with matriculationnumber ' + matriculationNumber + ' was already graded for exam ' + examName + ' on the ' + examDate);
        }

        examRegistration.setGrade(grade);
        let data = examRegistration.toBuffer();

        await ctx.stub.putState(examRegistrationFirstElement.value.key, data);

        return examRegistration;
    }

    async queryAllExamRegistrations(ctx) {
        const allResults = [];
        for await (const {key, value} of ctx.stub.getStateByPartialCompositeKey("StudentExamRegistration",[])) {
            let record = StudentExamRegistration.fromBuffer(value);
            allResults.push({ Key: key, Record: record });
        }
        console.info(allResults);
        return JSON.stringify(allResults);
    }

    async queryAllExams(ctx) {
        const allResults = [];
        for await (const {key, value} of ctx.stub.getStateByPartialCompositeKey("Exam",[])) {
            let record = Exam.fromBuffer(value);
            allResults.push({ Key: key, Record: record });
        }
        console.info(allResults);
        return JSON.stringify(allResults);
    }

    async queryAllStudents(ctx) {
        const allResults = [];
        for await (const {key, value} of ctx.stub.getStateByPartialCompositeKey("Student",[])) {
            let record = Student.fromBuffer(value);
            allResults.push({ Key: key, Record: record });
        }
        console.info(allResults);
        return JSON.stringify(allResults);
    }

    async getStudentSuccess(ctx, matriculationNumber){
        const allResults = [];
        for await (const {key, value} of ctx.stub.getStateByPartialCompositeKey("StudentExamRegistration",[matriculationNumber])) {
            let record = StudentExamRegistration.fromBuffer(value);
            if (record.isGraded()){
                allResults.push({ Key: key, Record: record });
            }
        }
        console.info(allResults);
        return JSON.stringify(allResults);
    }
}

module.exports = StudentExamRegistrationContract;
