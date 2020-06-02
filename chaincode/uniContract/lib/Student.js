'use strict';

const Util = require('../ledger-api/Util.js');

const studentState = {
    ENROLLED: 1,    
    DEREGISTERED: 2,
};

class Student {

    constructor(obj) {
        this.key = Util.makeKey([obj.matriculationNumber]);
        this.currentState = studentState.ENROLLED;
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
        return this.currentState === studentState.DEREGISTERED;
    }

    static fromBuffer(buffer) {
        return Util.deserialize(buffer, Student);
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    static createInstance(matriculationNumber, name, email) {
        return new Student({ matriculationNumber, name, email});
    }

    static getClass() {
        return 'org.universitynet.student';
    }
}

module.exports = Student;
