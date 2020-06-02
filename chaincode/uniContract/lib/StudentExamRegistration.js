'use strict';

const Util = require('../ledger-api/Util.js');

const examState = {
    REGISTERED: 1,
    GRADED: 2
};

class StudentExamRegistration {

    constructor(obj) {
        this.key = Util.makeKey([obj.examName, obj.matriculationNumber]);
        this.currentState = examState.REGISTERED;
        Object.assign(this, obj);
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

    static createInstance(examName, matriculationNumber) {
        return new StudentExamRegistration({ examName, matriculationNumber});
    }

    static getClass() {
        return 'org.universitynet.studentexamregistration';
    }
}

module.exports = StudentExamRegistration;
