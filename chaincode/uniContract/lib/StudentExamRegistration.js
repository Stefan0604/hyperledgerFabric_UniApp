'use strict';

const Util = require('../ledger-api/Util.js');

const examState = {
    REGISTERED: 1,
    GRADED: 2
};

class StudentExamRegistration {

    constructor(obj) {
        this.key = Util.makeKey([
            obj.matriculationNumber,
            obj.examName,
            (obj.examDate instanceof Date) ? Util.createDateKey(obj.examDate) : Util.createDateKey(new Date(obj.examDate))]);
        this.currentState = examState.REGISTERED;
        Object.assign(this, obj);
        this.examDate =  (obj.examDate instanceof Date) ? obj.examDate : new Date(obj.examDate);
    }

    getKey() {
        return this.key;
    }

    getSplitKey(){
        return Util.splitKey(this.key);
    }

    getExamName() {
        return this.examName;
    }

    getExamDate() {
        return this.examDate;
    }

    getMatriculationNumber() {
        return this.matriculationNumber;
    }

    setGrade(grade) {
        this.currentState = examState.GRADED;
        this.grade = grade;
    }

    isRegistered() {
        return this.currentState === examState.REGISTERED;
    }

    isGraded() {
        return this.currentState === examState.GRADED && this.grade !== undefined;
    }

    static fromBuffer(buffer) {
        return Util.deserialize(buffer, StudentExamRegistration);
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    static createInstance(matriculationNumber, examName, examDate) {
        return new StudentExamRegistration({matriculationNumber, examName, examDate});
    }

    static getClass() {
        return 'org.universitynet.studentexamregistration';
    }
}

module.exports = StudentExamRegistration;
