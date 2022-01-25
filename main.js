"use strict";
let apiKey = "41119ee7-17d6-4bcd-9bd7-30490fe1a9cd";
let apiUrl = "http://exam-2022-1-api.std-900.ist.mospolytech.ru/api/restaurants";

async function getRestaurants() {
    let url = new URL(apiUrl);
    url.searchParams.set('api_key', apiKey);
    let response = await fetch(url);

    let json = await response.json();
    return json;
}
function createRestaurantTableItem(record) {
    let item = document.getElementById("tr-template").cloneNode(true)
    item.classList.remove("d-none")
    item.querySelector(".restaurant-name").innerHTML = record.name
    item.querySelector(".restaurant-type").innerHTML = record.typeObject
    item.querySelector(".restaurant-addr").innerHTML = record.address
    item.querySelector(".restaurant-id").value = record.id

    return item
}

function renderRecords(records) {
    let restaurantTable = document.querySelector('tbody');
    for (let i = 0; i < records.length; i++) {
        restaurantTable.append(createRestaurantTableItem(records[i]));
    }
}

window.onload = function () {
    getRestaurants().then(
        result => renderRecords(result),
    )
}