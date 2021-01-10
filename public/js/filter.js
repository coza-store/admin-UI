const form = document.getElementById('filter-form');
const colorBody = document.getElementById('colorBody');
const tagBody = document.getElementById('tagBody');
const lowestPrice = document.getElementById('lowestPriceBody');
const highestPrice = document.getElementById('highestPriceBody');
const sortBody = document.getElementById('sortBody');

const getColor = (btn, e) => {
    e.preventDefault();
    if (colorBody.value == "" || colorBody.value != btn.innerText) {
        colorBody.value = btn.innerText;
    } else {
        colorBody.value = "";
    }
    form.submit();
}
const getTag = (btn, e) => {
    e.preventDefault();
    if (tagBody.value == "" || tagBody.value != btn.innerText.toLowerCase()) {
        tagBody.value = btn.innerText.toLowerCase();
        if (btn.innerText == "Women") {
            tagBody.value = "woman";
        }
    } else {
        tagBody.value = "";
    }
    form.submit();
}

const getPrice = (btn, e) => {
    e.preventDefault();
    const range = btn.value.split("-");
    if ((lowestPrice.value == "" && highestPrice.value == "") || (lowestPrice.value != range[0] && highestPrice.value != range[1])) {
        lowestPrice.value = range[0];
        highestPrice.value = range[1];
        if (range[1] == undefined) {
            highestPrice.value = 10000000000;
        }
    } else {
        lowestPrice.value = 0;
        highestPrice.value = 10000000000;
    }
    form.submit();
}

const getSort = (btn, e) => {
    e.preventDefault();
    if (sortBody.value == "" || sortBody.value != btn.value) {
        sortBody.value = btn.value;
    } else {
        sortBody.value = "";

    }
    form.submit();
}

const removeFilter = (e) => {
    e.preventDefault();
    sortBody.value = "";
    colorBody.value = "";
    tagBody.value = "";
    lowestPrice.value = "";
    highestPrice.value = "";
    form.submit();
}