/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

class Util {
    /**
     * Convert object to buffer containing JSON data serialization
     * Typically used before putState()ledger API
     * @param {Object} JSON object to serialize
     * @return {buffer} buffer with the data to store
     */
    static serialize(object) {
        return Buffer.from(JSON.stringify(object));
    }

    /**
     * Deserialize object into specific object class
     * Typically used after getState() ledger API
     * @param {data} data to deserialize into JSON object
     * @return {json} json with the data to store
     */
    static deserialize(data, objClass) {
        let json = JSON.parse(data.toString());
        let object = new (objClass)(json);
        return object;
    }

    /**
     * Join the keyParts to make a unififed string
     * @param (String[]) keyParts
     */
    static makeKey(keyParts) {
        return keyParts.map(part => part.toString()).join(':');
    }

    static splitKey(key){
        return key.split(':');
    }

    static createDateKey(date){
        return date.getYear().toString() + "-" + date.getMonth().toString() + "-" + date.getDay().toString();
    }

}

module.exports = Util;