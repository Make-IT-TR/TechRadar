"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Handle returned when subscribing to a topic
class MessageBusHandle {
    constructor(topic, callback) {
        this.topic = topic;
        this.callback = callback;
    }
}
exports.MessageBusHandle = MessageBusHandle;
var NotifyLocation;
(function (NotifyLocation) {
    NotifyLocation[NotifyLocation["BottomRight"] = 0] = "BottomRight";
    NotifyLocation[NotifyLocation["BottomLeft"] = 1] = "BottomLeft";
    NotifyLocation[NotifyLocation["TopRight"] = 2] = "TopRight";
    NotifyLocation[NotifyLocation["TopLeft"] = 3] = "TopLeft";
})(NotifyLocation = exports.NotifyLocation || (exports.NotifyLocation = {}));
/**
 * Simple message bus service, used for subscribing and unsubsubscribing to topics.
 * @see {@link https://gist.github.com/floatingmonkey/3384419}
 */
class MessageBusService {
    constructor() {
    }
    /**
     * Publish to a topic
     */
    publish(topic, title, data) {
        //window.console.log("publish: " + topic + ", " + title);
        if (!MessageBusService.cache[topic])
            return;
        MessageBusService.cache[topic].forEach(cb => cb(title, data));
    }
    //public publish(topic: string, title: string, data?: any): void {
    //	MessageBusService.publish(topic, title, data);
    //}
    /**
     * Subscribe to a topic
     * @param {string} topic The desired topic of the message.
     * @param {IMessageBusCallback} callback The callback to call.
     */
    subscribe(topic, callback) {
        if (!MessageBusService.cache[topic])
            MessageBusService.cache[topic] = new Array();
        MessageBusService.cache[topic].push(callback);
        return new MessageBusHandle(topic, callback);
    }
    //public subscribe(topic: string, callback: IMessageBusCallback): MessageBusHandle {
    //	return MessageBusService.subscribe(topic, callback);
    //}
    /**
     * Unsubscribe to a topic by providing its handle
     */
    unsubscribe(handle) {
        var topic = handle.topic;
        var callback = handle.callback;
        if (!MessageBusService.cache[topic])
            return;
        MessageBusService.cache[topic].forEach((cb, idx) => {
            if (cb == callback) {
                MessageBusService.cache[topic].splice(idx, 1);
                return;
            }
        });
    }
}
MessageBusService.cache = {};
exports.MessageBusService = MessageBusService;
class EventObj {
    constructor() {
    }
    // Events primitives ======================
    bind(event, fct) {
        this.myEvents = this.myEvents || {};
        this.myEvents[event] = this.myEvents[event] || [];
        this.myEvents[event].push(fct);
    }
    unbind(event, fct) {
        this.myEvents = this.myEvents || {};
        if (event in this.myEvents === false)
            return;
        this.myEvents[event].splice(this.myEvents[event].indexOf(fct), 1);
    }
    unbindEvent(event) {
        this.myEvents = this.myEvents || {};
        this.myEvents[event] = [];
    }
    unbindAll() {
        this.myEvents = this.myEvents || {};
        for (var event in this.myEvents)
            this.myEvents[event] = false;
    }
    trigger(event, ...args) {
        this.myEvents = this.myEvents || {};
        if (event in this.myEvents === false)
            return;
        for (var i = 0; i < this.myEvents[event].length; i++) {
            this.myEvents[event][i].apply(this, Array.prototype.slice.call(arguments, 1));
        }
    }
    registerEvent(evtname) {
        this[evtname] = function (callback, replace) {
            if (typeof callback == 'function') {
                if (replace)
                    this.unbindEvent(evtname);
                this.bind(evtname, callback);
            }
            return this;
        };
    }
    registerEvents(evtnames) {
        evtnames.forEach(evtname => {
            this.registerEvent(evtname);
        });
    }
}
exports.EventObj = EventObj;
//# sourceMappingURL=MessageBus.js.map