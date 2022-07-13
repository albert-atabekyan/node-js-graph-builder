import fs from "fs";
import { isNotValidDate } from "./../functions.js";
import { MAX_DATE, MIN_DATE } from "../constraints.js";
import {
    EFFECTIVE_PATH,
    DEVICES_PATH,
    STATIC_PATH,
    NOT_SUCH_FILE_ERROR,
    NOT_SUCH_DEVICE_ERROR,
    DATE_FORMAT_ERROR,
    DEVICE_NOT_FOUND_ERROR,
    NOT_VALID_DATE_ERROR
} from "../properties.js";

import path from 'path';

let devices = getDeviceFromFile();

class Service {
    async getNames() {
        let json = this.getJsonFromFile(this.getDevicesPath());

       let devices_names = [];

        for (let i in json) {
            devices_names.push(json[i].name);
       }

       return devices_names;
    }

    async getDateRange(req, res) {
        let dateFrom = this.getDateFrom(req);
        let dateTo = this.getDateTo(req);

        let device = req.params.device;
        let serial = req.params.serial;

        const STATIC_PATH = this.getStaicPath();

        if (!devices.includes(device)) {
            res.status(404).json(this.getDeviceNotFoundError);
            return;
        }

        this.validateData(dateFrom, dateTo, res);

        let paths = path.join(STATIC_PATH, device, serial + '.json');

        let json = this.getJsonFromFile(paths);

        let dateConstraints = this.getDateConstraints(json, dateFrom, dateTo);

        res.status(200).json(json.slice(dateConstraints.first, dateConstraints.last  + 1));
    }

    validateData(dateFrom, dateTo, res) {
        if (isNotValidDate(dateFrom) || isNotValidDate(dateTo)) {
            res.status(404).json(this.getNotValidDateError());
            return;
        }

        if (dateFrom > MAX_DATE || dateFrom < MIN_DATE || dateTo > MAX_DATE || dateTo < MIN_DATE) {
            res.status(404).json(this.getDateFormatError());
            return;
        }

        if (dateTo - dateFrom < 0) {
            res.status(404).json(this.getDateFormatError());
            return;
        }
    }

    getDateConstraints(json, dateFrom, dateTo) {
        let i = 0;
        while ((new Date(json[i].Date).getTime()) <= dateFrom) {
            i++;
        }

        let j = json.length - 1;
        while ((new Date(json[j].Date).getTime()) >= dateTo) {
            j--;
        }

        let data = {
            first: i,
            last: j
        }

        return data;
    }

    getDateFrom(req) {
        return new Date(req.params.year1, parseInt(req.params.month1) - 1,
            req.params.day1,
            req.params.hours1,
            req.params.minutes1).getTime();
    }

    getDateTo(req) {
        return new Date(req.params.year2, parseInt(req.params.month2) - 1,
            req.params.day2,
            req.params.hours2,
            req.params.minutes2).getTime();
    }

    getJsonFromFile(path) {
        let rawdata = fs.readFileSync(path);
        let jsondata = JSON.parse(rawdata);

        return jsondata;
    }

    getConstraints() {
        return { max_date: MAX_DATE, min_date: MIN_DATE };
    }

    getEffecivePath() {
        return EFFECTIVE_PATH;
    }

    getDevicesPath() {
        return DEVICES_PATH;
    }

    getStaicPath() {
        return STATIC_PATH;
    }

    getNotSuchFileError() {
        return NOT_SUCH_FILE_ERROR;
    }

    getNotSuchDeviceError() {
        return NOT_SUCH_DEVICE_ERROR;
    }

    getDateFormatError() {
        return DATE_FORMAT_ERROR;
    }

    getDeviceNotFoundError() {
        return DEVICE_NOT_FOUND_ERROR;
    }

    getNotValidDateError() {
        return NOT_VALID_DATE_ERROR;
    }
}

function getDeviceFromFile() {
    let rawdata = fs.readFileSync(DEVICES_PATH);
    let jsondata = JSON.parse(rawdata);

    let devices = [];
    for (let i in jsondata) {
        devices.push(jsondata[i].name);
    }

    return devices;
}

export default new Service();