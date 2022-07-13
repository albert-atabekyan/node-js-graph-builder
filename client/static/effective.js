import { createFormElement, deleteGraph, getDates1day } from "./modules/functions.js";
import { checkIsSubmitButtonExist } from "./modules/functions.js";
import { createSubmitButton } from "./modules/functions.js";
import { createDateInput } from "./modules/functions.js";
import { createTimeInput } from "./modules/functions.js";
import { replaceDataInSelect } from "./modules/functions.js";
import { checkIsExist } from "./modules/functions.js";
import { createSelector } from "./modules/functions.js";
import { convertToRoundHoursDate } from "./modules/functions.js";
import { convertToRoundDate } from "./modules/functions.js";
import { populateDates } from "./modules/functions.js";
import { formatDates } from "./modules/functions.js";
import { createDeleteButton } from "./modules/functions.js";
import { populateMaxValues } from "./modules/functions.js";
import { populateMinValues } from "./modules/functions.js";
import { createTableRow } from "./modules/functions.js";

Plotly.newPlot('Chart', [], {}, { responsive: true });

async function getDevices() {
    let devices = [];
    const data = await fetch('http://localhost:5000/devices/names').
        then(response => response.json())

    for (let i in data) {
        devices.push(data[i]);
    }

    let graphForm = document.createElement("form");
    let container = document.getElementsByClassName("container__form");

    container[0].appendChild(graphForm);

    let select = document.createElement("select");
    select.className = "chart";
    graphForm.appendChild(select);

    let firstOption = {
        type: "option",
        value: "",
        text: "Выберите прибор",
        parentElement: select
    }

    createFormElement(firstOption);

    for (let i in devices) {
        let option = {
            type: "option",
            value: devices[i],
            text: devices[i],
            parentElement: select
        }

        createFormElement(option);
    }

    select.addEventListener("change", change);
}

let change = async (event) => {
    let select = event.target;
    let parent = select.parentNode;

    let selectedDevice = select.options[select.selectedIndex].text;

    if (selectedDevice == "Выберите прибор") {
        parent.remove();

        getDevices();

        return;
    }

    const response = await fetch('http://localhost:5000/devices/effective/' + selectedDevice);
    const devices = await response.json();

    let indicators = document.createElement("select");
    indicators.className = "indicators";

    let data = devices.data;

    for (let i in data) {
        if (data[i].includes("temp")) {
            let indicatorOption = {
                type: "option",
                value: data[i],
                text: data[i],
                parentElement: indicators
            }

            createFormElement(indicatorOption);
        }
    }

    let humidity = []
    for (let i in data) {
        if (data[i].includes("humidity")) {
            humidity.push(data[i]);
        }
    }

    let deviceNumber = document.createElement("select");
    deviceNumber.className = "deviceNumber";

    for (let i = 0; i < devices.countInstances; i++) {
        let deviceNumberOption = {
            type: "option",
            value: (i + 1),
            text: (i + 1),
            parentElement: deviceNumber
        }

        createFormElement(deviceNumberOption);
    }

    replaceDataInSelect(select, indicators, "indicators");
    replaceDataInSelect(select, deviceNumber, "deviceNumber");

    let isNotDateExist = true;

    let isNotDateExistData = {
        parent: parent.children.item(3),
        name: "dateFrom",
        isNotExist: isNotDateExist
    }

    checkIsExist(isNotDateExistData);

    if (isNotDateExistData.isNotExist) {
        const response = await fetch('http://localhost:5000/constraints')
        const constraints = await response.json();

        const max_date = new Date(constraints.max_date);
        const min_date = new Date(constraints.min_date);

        const min_date_month = ((min_date.getMonth() + 1) < 10
            ? "0" + (min_date.getMonth() + 1)
            : (min_date.getMonth() + 1));

        const max_date_month = ((max_date.getMonth() + 1) < 10
            ? "0" + (max_date.getMonth() + 1)
            : (max_date.getMonth() + 1));

        const min_date_string = min_date.getFullYear() + "-" + min_date_month + "-" + min_date.getDate();
        const max_date_string = max_date.getFullYear() + "-" + max_date_month + "-" + max_date.getDate();

        let fromDiv = document.createElement('div');

        let dateFromData = {
            name: "dateFrom",
            max: max_date_string,
            min: min_date_string,
            value: min_date_string
        }

        let dateFrom = createDateInput(dateFromData);

        let timeFromData = {
            name: "timeFrom",
            value: min_date.toLocaleTimeString().substring(0, 5)
        }

        let timeFrom = createTimeInput(timeFromData);

        fromDiv.appendChild(dateFrom);
        fromDiv.appendChild(timeFrom);

        parent.appendChild(fromDiv);

        let toDiv = document.createElement('div');

        let dateToData = {
            name: "dateTo",
            max: max_date_string,
            min: min_date_string,
            value: max_date_string
        }

        let dateTo = createDateInput(dateToData);

        let timeToData = {
            name: "timeTo",
            value: max_date.toLocaleTimeString().substring(0, 5)
        }

        let timeTo = createTimeInput(timeToData);

        toDiv.appendChild(dateTo);
        toDiv.appendChild(timeTo);

        parent.appendChild(toDiv);
    }

    let isNotChartTypeSelectorExist = true;

    let isNotChartTypeSelectorExistData = {
        parent: parent.children.item(6),
        name: "type",
        isNotExist: isNotChartTypeSelectorExist
    }

    checkIsExist(isNotChartTypeSelectorExistData);

    if (isNotChartTypeSelectorExistData.isNotExist) {
        let types = ["scatter", "bar", "markers"];
        let typesNames = ["Линейный", "Столбчатый", "Точечный"];

        let chartTypeSelector = {
            types: types,
            typesNames: typesNames,
            name: "type",
            selectorName: "Тип",
            parentElement: parent
        }

        createSelector(chartTypeSelector);
    }

    let isNotAverageSelectorExist = true;

    let isNotAverageSelectorExistData = {
        parent: parent.children.item(10),
        name: "average",
        isNotExist: isNotAverageSelectorExist
    }

    checkIsExist(isNotAverageSelectorExistData);

    if (isNotAverageSelectorExistData.isNotExist) {
        const types = ["not", "1hour", "3hours", "1day"];
        const typesNames = ["Данные как есть",
            "Осреднять за час",
            "Осреднять за 3 часа",
            "Осреднять за сутки"];

        let averageSelector = {
            types: types,
            typesNames: typesNames,
            selectorName: "Осреднение",
            name: "average",
            parentElement: parent
        }

        createSelector(averageSelector);
    }

    let isNotSubmitButtonExist = true;

    let isNotSubmitButtonExistData = {
        parent: select.parentNode,
        type: "submit",
        isNotExist: isNotSubmitButtonExist
    }

    checkIsSubmitButtonExist(isNotSubmitButtonExistData)

    if (isNotSubmitButtonExistData.isNotExist) {
        createSubmitButton(select.parentNode);
    }

    select.parentNode.addEventListener("submit", submitAction);
}

getDevices();

async function submitAction(event) {
    event.preventDefault();

    const formData = new FormData(event.target);

    const formParametrs = ["name",
        "indicator",
        "serial",
        "dateFrom",
        "timeFrom",
        "dateTo",
        "timeTo"];

    const childrens = event.target.children;

    Array.prototype.forEach.call(childrens,
        (element, index) => formData.append(formParametrs[index], element.value));

    const request = `http://localhost:5000/json/` +
        `${formData.get("name")}` +
        `/${formData.get("serial")}` +
        `/${formData.get("dateFrom").split("-")[0]}` +
        `/${formData.get("dateFrom").split("-")[1]}` +
        `/${formData.get("dateFrom").split("-")[2]}` +
        `/${formData.get("timeFrom").split(":")[0]}` +
        `/${formData.get("timeFrom").split(":")[1]}` +
        `/to` +
        `/${formData.get("dateTo").split("-")[0]}` +
        `/${formData.get("dateTo").split("-")[1]}` +
        `/${formData.get("dateTo").split("-")[2]}` +
        `/${formData.get("timeTo").split(":")[0]}` +
        `/${formData.get("timeTo").split(":")[1]}`;

    const responseHumidity = await fetch('http://localhost:5000/devices/effective/' + formData.get("name"));
    const dataHumidity = await responseHumidity.json();

    let humidity = dataHumidity.data[1];

    const response = await fetch(request);
    const data = await response.json();

    const indicator = formData.get("indicator");
    let indicators = [];

    let dates = [];
    let humidityArr = [];

    data.forEach((element) => {
        indicators.push(element.data[indicator]);
        humidityArr.push(element.data[humidity]);
        dates.push(element.Date);
    });

    for (let i = 0; i < indicators.length; i++) {
        indicators[i] = indicators[i] - (indicators[i] - 10) * 0.4 * (1 - humidityArr[i] / 100);
    }

    let average = "not";


    Array.prototype.forEach.call(childrens,
        (element) => {
            if (element?.children?.item(0)?.checked && element?.children?.item(0)?.name == "average")
                average = element?.children?.item(0)?.value;
        });

    if (average == "1hour") {
        let firstDate = convertToRoundHoursDate(dates[0]);

        let lastDate = convertToRoundHoursDate(dates[dates.length - 1]);

        let dates1hour = [];

        while (firstDate.getTime() != lastDate.getTime()) {
            firstDate.setHours(firstDate.getHours() + 1);
            dates1hour.push(new Date(firstDate));
        }

        lastDate.setHours(lastDate.getHours() + 1)
        dates1hour.push(lastDate);

        let dataArr = populateDates(dates1hour, dates, indicators);

        let dates1hourString = formatDates(dates1hour);

        dates = dates1hourString;
        indicators = dataArr;

    } else if (average == "3hours") {
        let firstDate = convertToRoundHoursDate(dates[0]);

        let lastDate = convertToRoundHoursDate(dates[dates.length - 1]);

        let dates3hour = [];

        while (firstDate.getTime() < lastDate.getTime()) {
            dates3hour.push(firstDate);
            firstDate = new Date(firstDate.setHours(firstDate.getHours() + 3));
        }

        lastDate = new Date(dates3hour[dates3hour.length - 1]);
        lastDate.setHours(lastDate.getHours() + 3);
        dates3hour.push(lastDate);

        let dataArr = populateDates(dates3hour, dates, indicators);

        let dates3hourString = formatDates(dates3hour);

        dates = dates3hourString;
        indicators = dataArr;

    } else if (average == "1day") {
        let firstDate = convertToRoundDate(dates[0]);

        let lastDate = convertToRoundDate(dates[dates.length - 1]);

        let dates1day = getDates1day(dates);

        let dataArr = populateDates(dates1day, dates, indicators);

        if (dates1day.length == 1) dates1day[0].setDate(dates1day[0].getDate() - 1);

        let dates1dayString = formatDates(dates1day);

        dates = dates1dayString;
        indicators = dataArr;
    }

    let perception = [];
    let perceptionMatch = [20, 15, 10, 5, 1, 1.1, 1.2, 1.3, 10, 20];
    for (let i = 0; i < indicators.length; i++) {
        if (parseFloat(indicators[i]) < -30) {
            perception.push(indicators[i] * perceptionMatch[0]);
        } else if (parseFloat(indicators[i]) >= -30 && parseFloat(indicators[i]) < -24) {
            perception.push(indicators[i] * perceptionMatch[1]);
        } else if (parseFloat(indicators[i]) >= -24 && parseFloat(indicators[i]) < -12) {
            perception.push(indicators[i] * perceptionMatch[2]);
        } else if (parseFloat(indicators[i]) >= -12 && parseFloat(indicators[i]) < 0) {
            perception.push(indicators[i] * perceptionMatch[3]);
        } else if (parseFloat(indicators[i]) >= 0 && parseFloat(indicators[i]) < 6) {
            perception.push(indicators[i] * perceptionMatch[4]);
        } else if (parseFloat(indicators[i]) >= 6 && parseFloat(indicators[i]) < 12) {
            perception.push(indicators[i] * perceptionMatch[5]);
        } else if (parseFloat(indicators[i]) >= 12 && parseFloat(indicators[i]) < 18) {
            perception.push(indicators[i] * perceptionMatch[6]);
        } else if (parseFloat(indicators[i]) >= 18 && parseFloat(indicators[i]) < 24) {
            perception.push(indicators[i] * perceptionMatch[7]);
        } else if (parseFloat(indicators[i]) >= 24 && parseFloat(indicators[i]) < 30) {
            perception.push(indicators[i] * perceptionMatch[8]);
        } else {
            perception.push(indicators[i] * perceptionMatch[9]);
        }
    }

    let traceEffective = {
        x: dates,
        y: indicators
    };

    let tracePerception = {
        x: dates,
        y: perception
    };

    let type = "scatter";


    Array.prototype.forEach.call(childrens,
        (element) => {
            if (element?.children?.item(0)?.checked && element?.children?.item(0)?.name == "type")
                type = element?.children?.item(0)?.value;
        });


    if (type == "markers") {
        traceEffective.mode = type;
        traceEffective.type = "scatter";

        tracePerception.mode = type;
        tracePerception.type = "scatter";
    } else {
        traceEffective.type = type;
        tracePerception.type = type;
    }

    let traces = [traceEffective, tracePerception];
    Plotly.addTraces("Chart", traces);

    const dataTable = document.getElementById("data-table").childNodes[1];

    let dates1day = getDates1day(dates);

    let dataMaxArr = populateMaxValues(dates1day, dates, indicators);
    let dataMinArr = populateMinValues(dates1day, dates, indicators);

    let tableCellData = {
        table: dataTable,
        formData: formData,
        indicator: "Эффективная<br>температура",
        type: type,
        average: average,
        dataMaxArr: dataMaxArr,
        dataMinArr: dataMinArr
    }

    createTableRow(tableCellData);

    let data2MaxArr = populateMaxValues(dates1day, dates, perception);
    let data2MinArr = populateMinValues(dates1day, dates, perception);

    let tableCellData2 = {
        table: dataTable,
        formData: formData,
        indicator: "Теплоощущение",
        type: type,
        average: average,
        dataMaxArr: data2MaxArr,
        dataMinArr: data2MinArr
    }

    createTableRow(tableCellData2);

}



