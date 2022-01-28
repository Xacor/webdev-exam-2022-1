"use strict";
let apiKey = "41119ee7-17d6-4bcd-9bd7-30490fe1a9cd";
let apiUrl = "http://exam-2022-1-api.std-900.ist.mospolytech.ru/api/restaurants";
let restaurantsJson;
let selectedRestaurant;
let prices = [];
let isStudent = false;
let forCompany = false;

async function getRestaurants() {
    let url = new URL(apiUrl);
    url.searchParams.set('api_key', apiKey);
    let response = await fetch(url);

    let json = await response.json();
    if (!json.error) {
        restaurantsJson = json;
        return Promise.resolve(json);
    } else {
        return Promise.reject(json.error);
    }
}

async function getSets() {
    let response = await fetch("http://webdev-exam-2022-1-z01jcn.std-1611.ist.mospolytech.ru/sets.json");
    let json = await response.json();
    return json;
}

async function getRestaurantByID(id) {
    let url = new URL(apiUrl + `/${id}`);
    url.searchParams.set('api_key', apiKey);
    let response = await fetch(url);

    let json = await response.json();
    if (!json.error) {
        selectedRestaurant = json;
        return Promise.resolve(json);
    } else {
        return Promise.reject(json.error);
    }
}

function createRestaurantTableItem(record) {
    let item = document.querySelector("#tr-template").cloneNode(true);
    item.classList.remove("d-none");
    item.classList.add("elem");
    item.querySelector(".restaurant-name").innerHTML = record.name;
    item.querySelector(".restaurant-type").innerHTML = record.typeObject;
    item.querySelector(".restaurant-addr").innerHTML = record.address;
    item.querySelector(".restaurant-id").value = record.id;
    item.querySelector(".select-rest-btn").onclick = selectRestBtnHandler;

    return item;
}

function setIsStudentAvailable(record) {
    if (record.socialPrivileges == false) {
        document.querySelector("#is-student").setAttribute("disabled", "");
    } else {
        document.querySelector("#is-student").removeAttribute("disabled", "");
    }
}

function renderRecords(records) {
    clearTable();
    resetPagintaion();

    records.sort((a, b) => {
        return a.rate < b.rate;
    });
    let restaurantTable = document.querySelector("tbody");
    for (let i = 0; i < records.length; i++) {
        createFilterOption(records[i]);
        restaurantTable.append(createRestaurantTableItem(records[i]));
    }
    pagination(1);
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
    let type = document.querySelector("#typeObject");
    let typeValues = Array.from(type.options).map(e => e.value);
    if (typeValues.indexOf(record.typeObject) == -1 && record.typeObject != null) {
        let newOption = document.createElement("option");
        newOption.value = record.typeObject;
        newOption.innerHTML = record.typeObject;
        type.append(newOption);
    }

}

function createDiscountOption(record) {
    let socialPrivileges = document.querySelector("#socialPrivileges");
    let socialPrivilegesValues = Array.from(socialPrivileges.options).map(e => e.value);
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

function filterByArea(array, area) {
    return array.filter(elem => elem.admArea == area);
}

function filterByDistrict(array, district) {
    return array.filter(elem => elem.district == district);
}

function filterByType(array, typeObject) {
    return array.filter(elem => elem.typeObject == typeObject);
}

function filterBySocial(array, socialPrivileges) {
    return array.filter(elem => String(elem.socialPrivileges) == socialPrivileges);
}

function filterBtnHandler(event) {
    let form = event.target.closest("form");
    let result = [...restaurantsJson];

    if (form.elements["area"].value != "not-chosen") {
        result = filterByArea(result, form.elements["area"].value);
    }

    if (form.elements["district"].value != "not-chosen") {
        result = filterByDistrict(result, form.elements["district"].value);
    }

    if (form.elements["typeObject"].value != "not-chosen") {
        result = filterByType(result, form.elements["typeObject"].value);
    }

    if (form.elements["socialPrivileges"].value != "not-chosen") {
        result = filterBySocial(result, form.elements["socialPrivileges"].value);
    }

    result.sort((a, b) => {
        return a.rate < b.rate;
    });
    renderRecords(result);
}

function clearTable() {
    let elems = document.querySelectorAll(".elem");
    for (let i = 0; i < elems.length; i++) {
        elems[i].remove();
    }
}

function plusBtnHandler(event) {
    let counter = event.target.closest("div").querySelector("span");
    counter.innerHTML = Number(counter.innerHTML) + 1;
    calculateTotal();
}

function minusBtnHandler(event) {
    let counter = event.target.closest("div").querySelector("span");
    if (Number(counter.innerHTML) - 1 < 0) return;
    counter.innerHTML = Number(counter.innerHTML) - 1;
    calculateTotal();
}

function calculateTotal() {
    let total = 0;
    let counters = document.querySelectorAll(".counter");
    for (let i = 1; i < counters.length; i++) {
        total += Number(counters[i].innerHTML) * prices[i];
    }

    if (selectedRestaurant.socialPrivileges && document.querySelector("#is-student").checked) {
        total *= selectedRestaurant.socialDiscount / 100;
    }

    document.querySelector(".total").innerHTML = total;
}

function createSetItem(record) {
    let item = document.querySelector(".set-card").cloneNode(true);
    item.classList.remove("d-none");
    item.classList.add("set-item");
    item.querySelector(".set-name").innerHTML = record.name;
    item.querySelector(".set-description").innerHTML = record.description;
    item.querySelector(".card-image").src = record.img;
    item.querySelector(".plus-btn").onclick = plusBtnHandler;
    item.querySelector(".minus-btn").onclick = minusBtnHandler;
    return item
}

function clearSets() {
    let items = document.querySelectorAll(".set-item");
    for (let i = 0; i < items.length; i++) {
        items[i].remove();
    }
}

function renderSets(records) {
    let menu = document.querySelector(".menu");
    for (let i = 0; i < records.length; i++) {
        menu.append(createSetItem(records[i]));
    }
}

function pagination(newPage) {
    let elems = document.querySelectorAll(".elem");
    for (let i = 0; i < elems.length; i++) {
        elems[i].classList.add("d-none");
    }

    let end = Math.min(((newPage - 1) * 20 + 20), document.querySelectorAll(".elem").length - (newPage - 1) * 20)
    for (let i = (newPage - 1) * 20; i < end; i++) {
        elems[i].classList.remove("d-none");
    }
}

function resetPagintaion() {
    let buttons = document.querySelectorAll(".page-link");

    for (let i = 1; i <= 3; i++) {
        buttons[i].innerHTML = i;
        buttons[i].dataset.page = i;
    }
    buttons[1].closest("ul").querySelector(".active").classList.remove("active");
    buttons[1].closest(".page-item").classList.add("active");
}

function maxPage() {
    return Math.ceil(document.querySelectorAll(".elem").length / 20);
}

function curPage() {
    return document.querySelector(".page-item.active").firstChild.dataset.page;
}

function pageLinkHandler(event) {
    let page = event.target.dataset.page;

    if (page * 20 > maxPage() * 20) return;
    if (page == "prev") page = Math.max(Number(curPage()) - 1, 1);
    if (page == "next") page = Math.min(Number(curPage()) + 1, Number(maxPage()));

    let buttons = document.querySelectorAll(".page-link");
    event.target.closest("ul").querySelector(".active").classList.remove("active")
    if (page == 1) {
        for (let i = 1; i <= 3; i++) {
            buttons[i].innerHTML = i;
            buttons[i].dataset.page = i;
        }
        buttons[1].closest(".page-item").classList.add("active");

    } else if (page == maxPage()) {
        buttons[1].innerHTML = page - 2;
        buttons[1].dataset.page = page - 2;
        buttons[2].innerHTML = page - 1;
        buttons[2].dataset.page = page - 1;
        buttons[3].innerHTML = page;
        buttons[3].dataset.page = page;
        buttons[3].closest(".page-item").classList.add("active");

    } else {
        buttons[1].innerHTML = page - 1;
        buttons[1].dataset.page = page - 1;
        buttons[2].innerHTML = page;
        buttons[2].dataset.page = page;
        buttons[2].closest(".page-item").classList.add("active");
        buttons[3].innerHTML = page - (-1);
        buttons[3].dataset.page = page - (-1);
    }
    pagination(page);
}

function enableCheckBoxes() {
    for (let box of document.querySelectorAll(".form-check-input")) {
        box.removeAttribute("disabled", "");
    }
}

function selectRestBtnHandler(event) {
    clearSets();
    enableCheckBoxes();
    let restId = event.target.closest("form").querySelector(".restaurant-id").value;
    getSets()
        .then(renderSets)
        .then(function () {
            getRestaurantByID(restId)
                .then(setPrice)
                .then(setIsStudentAvailable)
        });
}

function setPrice(record) {
    let cards = document.querySelectorAll(".set-card");
    for (let i = 1; i < cards.length; i++) {
        cards[i].querySelector(".price").innerHTML = record["set_" + i];
        prices[i] = record["set_" + i];
    }
    return record;
}

function isStudentCheckBoxHandler() {
    calculateTotal();
    isStudent = !isStudent;
}

function forCompanyCheckBoxHandler() {
    forCompany = !forCompany;
}

function prepareModalContent() {
    prepareModalObjectInfo();
    prepareModalOptions();
}

function prepareModalOptions() {
    if (isStudent) {
        document.querySelector(".modal-is-student").classList.remove("d-none");
    } else {
        document.querySelector(".modal-is-student").classList.add("d-none");
    }
    if (forCompany) {
        document.querySelector(".modal-for-company").classList.remove("d-none");
    } else {
        document.querySelector(".modal-for-company").classList.add("d-none");
    }
}

function prepareModalObjectInfo() {
    document.querySelector(".modal-object-name").innerHTML = selectedRestaurant.name;
    document.querySelector(".modal-adm-area").innerHTML = selectedRestaurant.admArea;
    document.querySelector(".modal-district").innerHTML = selectedRestaurant.district;
    document.querySelector(".modal-address").innerHTML = selectedRestaurant.address;
    document.querySelector(".modal-rate").innerHTML = selectedRestaurant.rate;
}

window.onload = function () {
    getRestaurants().then(renderRecords);
    document.querySelector(".filter-btn").onclick = filterBtnHandler;
    document.querySelector("#is-student").onchange = isStudentCheckBoxHandler;
    document.querySelector("#for-company").onchange = forCompanyCheckBoxHandler;
    document.querySelector(".make-order-btn").onclick = prepareModalContent;

    for (let btn of document.querySelectorAll(".page-link")) {
        btn.onclick = pageLinkHandler;
    }
}