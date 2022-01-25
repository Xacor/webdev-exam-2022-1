"use strict";
let apiKey = "41119ee7-17d6-4bcd-9bd7-30490fe1a9cd";
let apiUrl = "http://exam-2022-1-api.std-900.ist.mospolytech.ru/api/restaurants";
let restaurantsJson;

// let paginationInfo = {
//     "currentPage": 1,
//     "perPage": 20,
//     "totalCount": 0,
//     "totalPages": 0
// }
// function setPaginationInfo(records) {
//     paginationInfo["totalCount"] = records.length
//     paginationInfo["totalPages"] = 
// }

async function getRestaurants() {
    let url = new URL(apiUrl);
    url.searchParams.set('api_key', apiKey);
    let response = await fetch(url);

    let json = await response.json();
    restaurantsJson = json;
    return json;
}
function createRestaurantTableItem(record) {
    let item = document.querySelector("#tr-template").cloneNode(true)
    item.classList.remove("d-none")
    item.querySelector(".restaurant-name").innerHTML = record.name
    item.querySelector(".restaurant-type").innerHTML = record.typeObject
    item.querySelector(".restaurant-addr").innerHTML = record.address
    item.querySelector(".restaurant-id").value = record.id

    return item
}

function renderRecords(records) {
    let restaurantTable = document.querySelector("tbody");
    // let data = pagination(state)

    for (let i = 0; i < records.length; i++) {
        createFilterOption(records[i]);
        restaurantTable.append(createRestaurantTableItem(records[i]));
    }
}

function createAreaOption(record) {
    let area = document.querySelector("#area");
    let areaValues = Array.from(area.options).map(e => e.value);
    if (areaValues.indexOf(record.admArea) == -1 && record.admArea != null) {
        let newOption = document.createElement("option");
        newOption.value = record.admArea;
        newOption.innerHTML = record.admArea;
        area.append(newOption);
    }
}

function createDistrictOption(record) {
    let district = document.querySelector("#district");
    let districtValues = Array.from(district.options).map(e => e.value);
    if (districtValues.indexOf(record.district) == -1 && record.district != null) {
        let newOption = document.createElement("option");
        newOption.value = record.district;
        newOption.innerHTML = record.district;
        district.append(newOption);
    }
}

function createTypeOption(record) {
    let type = document.querySelector("#type");
    let typeValues = Array.from(type.options).map(e => e.value);
    if (typeValues.indexOf(record.typeObject) == -1 && record.typeObject != null) {
        let newOption = document.createElement("option");
        newOption.value = record.typeObject;
        newOption.innerHTML = record.typeObject;
        type.append(newOption);
    }

}

function createDiscountOption(record) {
    let socialPrivileges = document.querySelector("#discount");
    let socialPrivilegesValues = Array.from(socialPrivileges.options).map(e => e.value);
    console.log(socialPrivilegesValues);
    console.log(record.socialPrivileges);
    if (socialPrivilegesValues.indexOf(String(record.socialPrivileges)) == -1 && record.socialPrivileges != null) {
        let newOption = document.createElement("option");
        newOption.value = record.socialPrivileges;
        newOption.innerHTML = record.socialPrivileges ? "Да" : "Нет";
        socialPrivileges.append(newOption);
    }
}


function createFilterOption(record) {
    createAreaOption(record);
    createDistrictOption(record);
    createTypeOption(record);
    createDiscountOption(record);
}


// function pagination(data, page, rows) {
//     let start = (page - 1) * rows;
//     let end = start + rows - 1;

//     var trimmedData = data.slice(start, end);

//     var totalPages = Math.ceil(data.length / rows);

//     return {
//         "data": trimmedData,
//         "pages": totalPages
//     }
// }


window.onload = function () {
    getRestaurants().then(renderRecords);
}