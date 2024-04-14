function getMonth(date) {
    return date.getMonth() + 1; // Adding 1 because getMonth() returns zero-based index (0 for January)
}

module.exports = { getMonth };
