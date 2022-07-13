const functions = {
    createFormElement: function createFormElement(data) {
        let element = document.createElement(data.type);
        element.value = data.value;
        element.innerText = data.text;
        data.parentElement.appendChild(element);
    },

    checkIsSubmitButtonExist: function checkIsSubmitButtonExist(data) {
        for (let i = 0; i < data.parent.children.length; i++) {
            if (data.parent?.children[i]?.type == data.type)
                data.isNotExist = false;
        }
    },
    createSubmitButton: function createSubmitButton(parent) {
        let submitButton = document.createElement("button");
        submitButton.type = "submit";
        submitButton.innerText = "Нарисовать график";
        parent.appendChild(submitButton);
    },
    createDateInput: function createDateInput(data) {
        let date = document.createElement("input");
        date.name = data.name;
        date.max = data.max;
        date.min = data.min;
        date.value = data.value;
        date.type = "date";
        return date;
    },
    createTimeInput: function createTimeInput(data) {
        let time = document.createElement("input");
        time.name = data.name;
        time.value = data.value;
        time.type = "time";
        return time;
    },
    replaceDataInSelect: function replaceDataInSelect(select, option, text) {
        let childrens = select.parentNode.children;
        let parent = select.parentNode;

        for (let i = 0; i < childrens.length; i++) {
            if (childrens[i].className == text) {
                parent.replaceChild(option, parent.children[i]);
                break;
            } else {
                parent.appendChild(option);
            }
        }
    },
    checkIsExist: function checkIsExist(data) {
        for (let i = 0; i < data.parent?.children?.length; i++) {
            if (data.parent?.children[i]?.name == data.name)
                data.isNotExist = false;
        }
    },
    createSelector: function createSelector(data) {
        let types = data.types;
        let typesNames = data.typesNames;

        let selectorName = document.createElement("div");
        selectorName.innerHTML = data.selectorName;
        data.parentElement.appendChild(selectorName);

        for (let i = 0; i < types.length; i++) {
            let divSelector = document.createElement('div');
            let radioButton = document.createElement("input");
            let label = document.createElement("label");

            label.innerText = typesNames[i];

            radioButton.name = data.name;
            radioButton.id = data.name + (i + 1);

            label.htmlFor = data.name + (i + 1);

            radioButton.value = types[i];
            radioButton.type = "radio";

            divSelector.appendChild(radioButton);
            divSelector.appendChild(label);

            data.parentElement.appendChild(divSelector);

        }

        document.getElementById(data.name + "1").checked = true;
    },
    convertToRoundHoursDate: function convertToRoundHoursDate(date) {
        let roundDate = new Date(date)
        roundDate.setMinutes(
            roundDate.getMinutes() - roundDate.getMinutes(),
            roundDate.getSeconds() - roundDate.getSeconds(),
            roundDate.getMilliseconds() - roundDate.getMilliseconds(),
        )

        return roundDate;
    },
    convertToRoundDate: function convertToRoundDate(date) {
        let roundDate = convertToRoundHoursDate(date);

        roundDate.setHours(roundDate.getHours() - roundDate.getHours());

        return roundDate;
    },
    populateDates: function populateDates(datesHourArray, datesArray, indicators) {
        let dataArr = new Array();
        let j = 0;

        for (let i = 1; i < datesHourArray.length; i++) {
            let tempArr = [];
            while (datesHourArray[i].getTime() > new Date(datesArray[j]).getTime()) {
                tempArr.push(indicators[j]);
                j++;
            }

            let sum = tempArr.reduce((a, b) => parseInt(a) + parseInt(b), 0);
            let avg = sum / tempArr.length;
            dataArr.push(avg);
        }

        return dataArr;
    },
    formatDates: function formatDates(datesHourArray) {
        let datesHourStringArray = new Array();
        for (let i in datesHourArray) {
            datesHourStringArray[i] = datesHourArray[i].getFullYear() + "-"
                + ((datesHourArray[i].getMonth() + 1) < 10
                    ? "0" + (datesHourArray[i].getMonth() + 1)
                    : (datesHourArray[i].getMonth() + 1)) + "-"
                + datesHourArray[i].getDate() + " "
                + ((datesHourArray[i].getHours()) < 10
                    ? "0" + (datesHourArray[i].getHours())
                    : (datesHourArray[i].getHours())) + ":"
                + "00";
        }

        return datesHourStringArray;
    },
    createDeleteButton: function createDeleteButton(parent) {
        let deleteButton = document.createElement('button');

        let buttonId = parent.childNodes.length;

        deleteButton.value = buttonId;
        deleteButton.innerText = "Удалить график " + (buttonId + 1);
        deleteButton.addEventListener("click", deleteGraph);

        parent.appendChild(deleteButton);
    },
    deleteGraph: function deleteGraph(event) {
        let button = event.target;
        const table = button.parentNode.parentNode.parentNode;
        const rowCount = table.rows.length;
        const row = button.parentNode.parentNode;

        Plotly.deleteTraces("Chart", parseInt(button.value));

        for (let i = parseInt(button.value) + 2; i < rowCount; i++) {
            table.children[i].children[9].children[0].value--;
        }

        button.remove();
        row.remove();

    }, populateMaxValues: function populateDates(datesHourArray, datesArray, indicators) {
        let dataArr = new Array();
        let j = 0;

        for (let i = 1; i < datesHourArray.length; i++) {
            let tempArr = [];
            while (datesHourArray[i].getTime() > new Date(datesArray[j]).getTime()) {
                tempArr.push(indicators[j]);
                j++;
            }

            dataArr.push(Math.max.apply(null,tempArr));
        }

        return dataArr;
    },
    populateMinValues: function populateDates(datesHourArray, datesArray, indicators) {
        let dataArr = new Array();
        let j = 0;

        for (let i = 1; i < datesHourArray.length; i++) {
            let tempArr = [];
            while (datesHourArray[i].getTime() > new Date(datesArray[j]).getTime()) {
                tempArr.push(indicators[j]);
                j++;
            }

            dataArr.push(Math.min.apply(null, tempArr));
        }

        return dataArr;
    }, getDates1day(dates) {
        let firstDate = convertToRoundDate(dates[0]);

        let lastDate = convertToRoundDate(dates[dates.length - 1]);

        let dates1day = [];

        dates1day.push(new Date(firstDate));
        while (firstDate.getTime() <= lastDate.getTime()) {
            dates1day.push(new Date(firstDate.setDate(firstDate.getDate() + 1)));
        }

        return dates1day;
    }, createTableRow(data) {
        const tableDataArray = [
            data.formData.get("dateFrom") + " " + data.formData.get("timeFrom"),
            data.formData.get("dateTo") + " " + data.formData.get("timeTo"),
            data.formData.get("name"),
            data.formData.get("serial"),
            data.indicator,
            data.type,
            data.average,
            data.dataMinArr.join("<br><br>"),
            data.dataMaxArr.join("<br><br>")
        ];

        const buttonCount = data.table.childElementCount;

        const columnCount = data.table.childNodes[0].childElementCount;
        const row = document.createElement("tr");

        for (let i = 0; i < columnCount - 1; i++) {
            const cell = document.createElement("td");

            cell.innerHTML = tableDataArray[i];

            row.appendChild(cell);
        }

        data.table.appendChild(row);

        const buttonCell = document.createElement("td");
        let deleteButton = document.createElement('button');

        let buttonId = buttonCount - 1;

        deleteButton.value = buttonId;
        deleteButton.innerText = "Удалить график";
        deleteButton.addEventListener("click", deleteGraph);
        buttonCell.appendChild(deleteButton);


        row.appendChild(buttonCell);
    }

}

export const createFormElement = functions.createFormElement;
export const checkIsSubmitButtonExist = functions.checkIsSubmitButtonExist;
export const createSubmitButton = functions.createSubmitButton;
export const createDateInput = functions.createDateInput;
export const createTimeInput = functions.createTimeInput;
export const replaceDataInSelect = functions.replaceDataInSelect;
export const checkIsExist = functions.checkIsExist;
export const createSelector = functions.createSelector;
export const convertToRoundHoursDate = functions.convertToRoundHoursDate;
export const convertToRoundDate = functions.convertToRoundDate;
export const populateDates = functions.populateDates;
export const formatDates = functions.formatDates;
export const createDeleteButton = functions.createDeleteButton;
export const deleteGraph = functions.deleteGraph;
export const populateMaxValues = functions.populateMaxValues;
export const populateMinValues = functions.populateMinValues;
export const getDates1day = functions.getDates1day;
export const createTableRow = functions.createTableRow;
