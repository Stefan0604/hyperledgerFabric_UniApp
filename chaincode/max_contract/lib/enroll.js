/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class Enroll extends Contract {

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        const enrolls = [
            {
                studentName: 'Max',
                courseName: 'Calculus',
            },
            {
                studentName: 'Edvin',
                courseName: 'Swedish',
            },
            {
                studentName: 'David',
                courseName: 'Biology',
            },
            {
                studentName: 'Gustav',
                courseName: 'Economy',
            },
        ];

        for (let i = 0; i < enrolls.length; i++) {
            enrolls[i].docType = 'student';
            await ctx.stub.putState('E' + i, Buffer.from(JSON.stringify(enrolls[i])));
            console.info('Added <--> ', enrolls[i]);
        }
        console.info('============= END : Initialize Ledger ===========');
    }

    async queryEnroll(ctx, enrollID) {
        const enrollAsBytes = await ctx.stub.getState(enrollID); // get the car from chaincode state
        if (!enrollAsBytes || enrollAsBytes.length === 0) {
            throw new Error(`${carNumber} does not exist`);
        }
        console.log(enrollAsBytes.toString());
        return enrollAsBytes.toString();
    }

    async enrollStudent(ctx, enrollID, studentName, courseName) {
        console.info('============= START : Create Student ===========');

        const student = {
            studentName,
            docType: 'student',
            courseName,
        };

        await ctx.stub.putState(enrollID, Buffer.from(JSON.stringify(student)));
        console.info('============= END : Create Student ===========');
    }

    async queryAllEnrolls(ctx) {
        const startKey = 'E0';
        const endKey = 'E99';
        const allResults = [];
        for await (const {key, value} of ctx.stub.getStateByRange(startKey, endKey)) {
            const strValue = Buffer.from(value).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push({ Key: key, Record: record });
        }
        console.info(allResults);
        return JSON.stringify(allResults);
    }

}

module.exports = Enroll;
