import Service from "./../service/service.js";

class Controller {
    async getNames(req, res) {
        try {
            const post = await Service.getNames();
            res.json(post);
        } catch (e) {
            res.status(500).json(e);
        }
    }

    async getDateRange(req, res) {

            const post = await Service.getDateRange(req, res);
            res.json(post);

    }

    async getEffectiveNames(req, res) {
        let jsondata = Service.getJsonFromFile(Service.getEffecivePath());

        let devices_name = [];

        for (let i in jsondata) {
            devices_name.push(jsondata[i].name);
        }

        res.status(200).json(devices_name);
    }

    async getDevice(req, res) {
        let device = req.params.device;

        let jsondata = Service.getJsonFromFile(Service.getDevicesPath());

        for (let i in jsondata) {
            if (jsondata[i].name == device) {
                res.status(200).json(jsondata[i]);
                return;
            }
        }

        res.status(404).json(Service.getNotSuchDeviceError);
    }

    async getEffectiveDevice(req, res) {
        let device = req.params.device;

        let jsondata = Service.getJsonFromFile(Service.getEffecivePath());

        for (let i in jsondata) {
            if (jsondata[i].name == device) {
                res.status(200).json(jsondata[i]);
                return;
            }
        }

        res.status(404).json(Service.getNotSuchDeviceError);
    }

    async getConstraints(req, res) {
        res.status(200).json(Service.getConstraints());
    }
}

export default new Controller();