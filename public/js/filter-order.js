const form = document.getElementById('filter-form');
const sortBody = document.getElementById('sortBody');
const statusBody = document.getElementById('statusBody');

const getSort = (btn, e) => {
    e.preventDefault();
    if (sortBody.value == "" || sortBody.value != btn.value) {
        sortBody.value = btn.value;
    } else {
        sortBody.value = "";

    }
    form.submit();
}

const getStatus = (btn, e) => {
    e.preventDefault();
    if (statusBody.value == "" || statusBody.value != btn.value) {
        statusBody.value = btn.value;
    } else {
        statusBody.value = "";
    }
    form.submit();
}

const removeFilter = (e) => {
    e.preventDefault();
    sortBody.value = "";
    statusBody.value = "";
    form.submit();
}