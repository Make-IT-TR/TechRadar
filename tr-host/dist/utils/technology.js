"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Content {
    constructor(id, contentType, content, subTitle) {
        this.id = id;
        this.contentType = contentType;
        this.content = content;
        this.subTitle = subTitle;
    }
}
exports.Content = Content;
/** description of a technology  */
class Technology {
    constructor(id, priority, category, thumbnail, timePeriod, relativeRadius, shortTitle, title, subTitle, text, color, visible = true, focus = false) {
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
}
exports.Technology = Technology;
//# sourceMappingURL=technology.js.map