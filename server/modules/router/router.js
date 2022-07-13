import Router from 'express'
import Controller from "./../controller/controller.js";

const router = new Router();

router.get("/constraints", Controller.getConstraints);

router.get("/devices/names", Controller.getNames);

router.get("/devices/:device", Controller.getDevice);

router.get("/json/:device/:serial/:year1/:month1/:day1/:hours1/:minutes1/to/:year2/:month2/:day2/:hours2/:minutes2", Controller.getDateRange);

router.get("/devices/effective", Controller.getEffectiveNames);

router.get("/devices/effective/:device", Controller.getEffectiveDevice);

export default router;