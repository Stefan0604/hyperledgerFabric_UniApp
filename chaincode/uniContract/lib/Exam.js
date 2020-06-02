'use strict';

const Util = require('../ledger-api/Util.js');

class Exam {

    constructor(obj) {
        this.key = Util.makeKey([
            obj.matriculationNumber,
            obj.startTime.getYear().toStrint() + "-" + obj.startTime.getMonth().toStrint() + "-" + obj.startTime.getDay().toStrint()
        ]);
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

    getStartTime() {
        return this.startTime;
    }

    getEndTime() {
        return this.endTime;
    }

    static fromBuffer(buffer) {
        return Util.deserializeClass(buffer);
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    static createInstance(examName, matriculationNumber) {
        return new Exam({ examName, matriculationNumber});
    }

    static getClass() {
        return 'org.universitynet.student';
    }
}

module.exports = Exam;
