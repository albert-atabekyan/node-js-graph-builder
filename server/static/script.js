import fs from "fs";

let devices = ['hydra', 'rosa', 'studios', 'weather_api'];
let count = [7, 1, 1, 1];

let data = [["BME280_temp", "BME280_humidity", "BME280_pressure"],
    ["color_illumination", "soil_humidity", "soil_temperature", "color_temperature",
        "red_infrared", "green_infrared", "blue_infrared", "temperature", "humidity",
        "pressure", "light_illumination", "color_clear", "infrared", "voltage", "rssi"],
    ["voltage", "rssi", "BH1750_lux", "BH1750_blink", "TCS34725_red", "TCS34725_green", "TCS34725_blue",
        "TCS34725_clear", "TCS34725_redC", "TCS34725_greenC", "TCS34725_blueC", "TCS34725_clearC",
        "TCS34725_ir", "color_temperature", "TCS34725_lux", "TCS34725_lux_advanced",
        "CCS811_concentration_CO2", "CCS811_volatile_organic_compound", "BMP280_temp", "BMP280_pressure",
        "BME280_temp", "BME280_humidity", "BME280_pressure", "DS18B20_temp",
        "AM2321_temp", "AM2321_humidity"], ["temp", "pressure", "humidity"]
]

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
fs.writeFileSync("devices" + ".json", datas);