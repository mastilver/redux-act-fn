const {createAction} = require('redux-act');

const defaultOptions = {
    before: {
        metaReducer: () => 'BEFORE'
    },
    after: {
        metaReducer: () => 'AFTER'
    }
};

module.exports = (description, fn, options = {}) => {
    options = {
        before: Object.assign({}, defaultOptions.before, options.before),
        after: Object.assign({}, defaultOptions.after, options.after)
    };

    const actions = {
        before: createAction(`${description}_BEFORE`, options.before.payloadReducer, options.before.metaReducer),
        after: createAction(`${description}_AFTER`, options.after.payloadReducer, options.after.metaReducer)
    };

    const actionFn = (...args) => (dispatch, getState) => {
        dispatch(actions.before(...args));

        const output = fn(...args, dispatch, getState);

        dispatch(actions.after({
            output,
            retuns: output,
            args,
            arg: args[0]
        }));

        return output;
    };

    return Object.assign(actionFn, actions, actions.after);
};
