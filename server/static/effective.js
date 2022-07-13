import fs from "fs";

let devices = ['hydra', 'rosa', 'studios', 'weather_api'];
let count = [7, 1, 1, 1];

let data = [["BME280_temp", "BME280_humidity"],
["temperature", "humidity",],
["BME280_temp", "BME280_humidity"], ["temp", "humidity"]]

let dev = [];

for (let i = 0; i < 4; i++) {
    let device = {
        name: devices[i],
        data: data[i],
        countInstances: count[i]
    }

    dev.push(device);
}

console.log(dev);
let datas = JSON.stringify(dev);
fs.writeFileSync("effective" + ".json", datas);