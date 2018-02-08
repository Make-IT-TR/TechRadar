var Content = (function () {
    function Content(id, contentType, content, subTitle) {
        this.id = id;
        this.contentType = contentType;
        this.content = content;
        this.subTitle = subTitle;
    }
    return Content;
}());
export { Content };
/** description of a technology  */
var Technology = (function () {
    function Technology(id, priority, category, thumbnail, timePeriod, relativeRadius, shortTitle, title, subTitle, text, color, visible, focus) {
        if (visible === void 0) { visible = true; }
        if (focus === void 0) { focus = false; }
        this.id = id;
        this.priority = priority;
        this.category = category;
        this.thumbnail = thumbnail;
        this.timePeriod = timePeriod;
        this.relativeRadius = relativeRadius;
        this.shortTitle = shortTitle;
        this.title = title;
        this.subTitle = subTitle;
        this.text = text;
        this.color = color;
        this.visible = visible;
        this.focus = focus;
        this.content = [];
        this.content = [];
    }
    return Technology;
}());
export { Technology };
//# sourceMappingURL=technology.js.map