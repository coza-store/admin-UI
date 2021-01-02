const capitalize = (s) => {
    if (typeof s !== 'string') return '';
    return s.charAt(0).toUpperCase() + s.slice(1);
};

exports.escapeRegex = (text) => {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

exports.toArraySize = (size) => {
    let sizeArr = [];
    size = size.toUpperCase();
    const split = size.split(" ");
    split.forEach(s => {
        sizeArr.push(s);
    });
    return sizeArr;
}

exports.toArrayColor = (color) => {
    let colorArr = [];
    const split = color.split(" ");
    split.forEach(c => {
        c = capitalize(c);
        colorArr.push(c);
    });
    return colorArr;
}