// Application hooks that run for every service
const logger = require('./hooks/logger');
module.exports = {
    before: {
        all: [],
        find: [],
        get: [],
        create: [],
        update: [],
        patch: [],
        remove: []
    },
    after: {
        all: [],
        find: [],
        get: [],
        create: [logger()],
        update: [logger()],
        patch: [logger()],
        remove: [logger()]
    },
    error: {
        all: [logger()],
        find: [],
        get: [],
        create: [],
        update: [],
        patch: [],
        remove: []
    }
};
//# sourceMappingURL=app.hooks.js.map