var FilterOnPropertyValueConverter = (function () {
    function FilterOnPropertyValueConverter() {
    }
    FilterOnPropertyValueConverter.prototype.toView = function (array, property, exp) {
        // console.log(property);
        if (array === undefined || array === null || property === undefined || exp === undefined) {
            return array;
        }
        return array.filter(function (item) { return item[property].toLowerCase().indexOf(exp.toLowerCase()) > -1; });
    };
    return FilterOnPropertyValueConverter;
}());
export { FilterOnPropertyValueConverter };
var HasPropertyValueValueConverter = (function () {
    function HasPropertyValueValueConverter() {
    }
    HasPropertyValueValueConverter.prototype.toView = function (array, property, exp) {
        if (array === undefined || array === null || property === undefined || exp === undefined) {
            return false;
        }
        return array.filter(function (item) { return item[property].toLowerCase().indexOf(exp.toLowerCase()) > -1; }).length > 0;
    };
    return HasPropertyValueValueConverter;
}());
export { HasPropertyValueValueConverter };
//# sourceMappingURL=valueconverters.js.map