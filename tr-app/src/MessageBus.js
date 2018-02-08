// Handle returned when subscribing to a topic
var MessageBusHandle = (function () {
    function MessageBusHandle(topic, callback) {
        this.topic = topic;
        this.callback = callback;
    }
    return MessageBusHandle;
}());
export { MessageBusHandle };
export var NotifyLocation;
(function (NotifyLocation) {
    NotifyLocation[NotifyLocation["BottomRight"] = 0] = "BottomRight";
    NotifyLocation[NotifyLocation["BottomLeft"] = 1] = "BottomLeft";
    NotifyLocation[NotifyLocation["TopRight"] = 2] = "TopRight";
    NotifyLocation[NotifyLocation["TopLeft"] = 3] = "TopLeft";
})(NotifyLocation || (NotifyLocation = {}));
/**
 * Simple message bus service, used for subscribing and unsubsubscribing to topics.
 * @see {@link https://gist.github.com/floatingmonkey/3384419}
 */
var MessageBusService = (function () {
    function MessageBusService() {
    }
    /**
     * Publish to a topic
     */
    MessageBusService.prototype.publish = function (topic, title, data) {
        //window.console.log("publish: " + topic + ", " + title);
        if (!MessageBusService.cache[topic])
            return;
        MessageBusService.cache[topic].forEach(function (cb) { return cb(title, data); });
    };
    //public publish(topic: string, title: string, data?: any): void {
    //	MessageBusService.publish(topic, title, data);
    //}
    /**
     * Subscribe to a topic
     * @param {string} topic The desired topic of the message.
     * @param {IMessageBusCallback} callback The callback to call.
     */
    MessageBusService.prototype.subscribe = function (topic, callback) {
        if (!MessageBusService.cache[topic])
            MessageBusService.cache[topic] = new Array();
        MessageBusService.cache[topic].push(callback);
        return new MessageBusHandle(topic, callback);
    };
    //public subscribe(topic: string, callback: IMessageBusCallback): MessageBusHandle {
    //	return MessageBusService.subscribe(topic, callback);
    //}
    /**
     * Unsubscribe to a topic by providing its handle
     */
    MessageBusService.prototype.unsubscribe = function (handle) {
        var topic = handle.topic;
        var callback = handle.callback;
        if (!MessageBusService.cache[topic])
            return;
        MessageBusService.cache[topic].forEach(function (cb, idx) {
            if (cb == callback) {
                MessageBusService.cache[topic].splice(idx, 1);
                return;
            }
        });
    };
    MessageBusService.cache = {};
    return MessageBusService;
}());
export { MessageBusService };
var EventObj = (function () {
    function EventObj() {
    }
    // Events primitives ======================
    EventObj.prototype.bind = function (event, fct) {
        this.myEvents = this.myEvents || {};
        this.myEvents[event] = this.myEvents[event] || [];
        this.myEvents[event].push(fct);
    };
    EventObj.prototype.unbind = function (event, fct) {
        this.myEvents = this.myEvents || {};
        if (event in this.myEvents === false)
            return;
        this.myEvents[event].splice(this.myEvents[event].indexOf(fct), 1);
    };
    EventObj.prototype.unbindEvent = function (event) {
        this.myEvents = this.myEvents || {};
        this.myEvents[event] = [];
    };
    EventObj.prototype.unbindAll = function () {
        this.myEvents = this.myEvents || {};
        for (var event in this.myEvents)
            this.myEvents[event] = false;
    };
    EventObj.prototype.trigger = function (event) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        this.myEvents = this.myEvents || {};
        if (event in this.myEvents === false)
            return;
        for (var i = 0; i < this.myEvents[event].length; i++) {
            this.myEvents[event][i].apply(this, Array.prototype.slice.call(arguments, 1));
        }
    };
    EventObj.prototype.registerEvent = function (evtname) {
        this[evtname] = function (callback, replace) {
            if (typeof callback == 'function') {
                if (replace)
                    this.unbindEvent(evtname);
                this.bind(evtname, callback);
            }
            return this;
        };
    };
    EventObj.prototype.registerEvents = function (evtnames) {
        var _this = this;
        evtnames.forEach(function (evtname) {
            _this.registerEvent(evtname);
        });
    };
    return EventObj;
}());
export { EventObj };
//# sourceMappingURL=MessageBus.js.map