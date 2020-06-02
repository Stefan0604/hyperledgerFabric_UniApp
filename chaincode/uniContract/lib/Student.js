'use strict';

const Util = require('../ledger-api/Util.js');

const studentState = {
    ENROLLED: 1,    
    DEREGISTERED: 2,
};

class Student {

    constructor(obj) {
        this.key = Util.makeKey([obj.matriculationNumber]);
        this.currentState = examState.ENROLLED;
        Object.assign(this, obj);
    }

    getKey() {
        return this.key;
    }

    getSplitKey(){
        return Util.splitKey(this.key);
    }

    getName() {
        return this.Name;
    }

    getMatriculationNumber() {
        return this.matriculationNumber;
    }

    getEMail() {
        return this.getEMail;
    }

    deregister() {
        this.currentState = studentState.DEREGISTERED;
    }

    isEnrolled() {
        return this.currentState === studentState.ENROLLED;
    }

    isDeregistered() {
        return this.currentState === examState.DEREGISTERED;
    }

    static fromBuffer(buffer) {
        return Util.deserializeClass(buffer);
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    static createInstance(examName, matriculationNumber) {
        return new Student({ examName, matriculationNumber});
    }

    static getClass() {
        return 'org.universitynet.student';
    }
}

module.exports = Student;
