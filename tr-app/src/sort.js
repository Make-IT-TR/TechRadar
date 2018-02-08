var SortValueConverter = (function () {
    function SortValueConverter() {
    }
    SortValueConverter.prototype.toView = function (array, propertyName, direction) {
        if (!array)
            return 1;
        var factor = direction === 'ascending' ? 1 : -1;
        return array
            .slice(0)
            .sort(function (a, b) {
            return (a[propertyName] - b[propertyName]) * factor;
        });
    };
    return SortValueConverter;
}());
export { SortValueConverter };
//# sourceMappingURL=sort.js.map