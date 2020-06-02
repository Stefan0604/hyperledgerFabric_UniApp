'use strict';

const Util = require('../ledger-api/Util.js');

class Exam {

    constructor(obj) {
        let keyParts = [
            obj.name,
            (obj.startTime instanceof Date) ? Util.createDateKey(obj.startTime) : Util.createDateKey(new Date(obj.startTime))
        ];
        this.key = Util.makeKey(keyParts);
        Object.assign(this, obj);
        this.startTime =  (obj.startTime instanceof Date) ? obj.startTime : new Date(obj.startTime);
        this.endTime =  (obj.endTime instanceof Date) ? obj.endTime : new Date(obj.endTime);
    }

    getKey() {
        return this.key;
    }

    getSplitKey(){
        return Util.splitKey(this.key);
    }

    getName() {
        return this.name;
    }

    getStartTime() {
        return this.startTime;
    }

    getEndTime() {
        return this.endTime;
    }

    getECTS() {
        return this.ECTS;
    }

    static fromBuffer(buffer) {
        return Util.deserialize(buffer, Exam);
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    static createInstance(name, startTime, endTime, ECTS) {
        return new Exam({name, startTime, endTime, ECTS});
    }

    static getClass() {
        return 'org.universitynet.exam';
    }
}

module.exports = Exam;
