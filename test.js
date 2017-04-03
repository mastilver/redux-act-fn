import test from 'ava';
import fn from '.';

test('expose all actions', t => {
    const login = fn('LOGIN_1', () => {});

    t.is(login.before.toString(), 'LOGIN_1_BEFORE');
    t.is(login.before.getType(), 'LOGIN_1_BEFORE');

    t.is(login.after.toString(), 'LOGIN_1_AFTER');
    t.is(login.after.getType(), 'LOGIN_1_AFTER');

    t.is(login.toString(), 'LOGIN_1_AFTER');
    t.is(login.getType(), 'LOGIN_1_AFTER');
});

test('run the action', t => {
    const metas = [];
    let called = false;

    const login = fn('LOGIN_2', () => {
        called = true;
        return true;
    });

    function dispatch({meta}) {
        metas.push(meta);
    }

    t.true(login()(dispatch));
    t.true(called);
    t.deepEqual(metas, ['BEFORE', 'AFTER']);
});

test('passing correct payload to reducer', t => {
    let pending = 0;

    const login = fn('LOGIN_3', () => true);

    function dispatch({type, payload}) {
        if (type === 'LOGIN_3_BEFORE') {
            pending++;

            t.is(payload, 1);
        } else if (type === 'LOGIN_3_AFTER') {
            const {args, arg, retuns, output} = payload;

            pending--;

            t.deepEqual(args, [1, 2, 3]);
            t.is(arg, 1);
            t.is(retuns, true);
            t.is(output, true);
        }
    }

    login(1, 2, 3)(dispatch);

    t.is(pending, 0);
});

test('payloadReducer', t => {
    const login = fn('LOGIN_4', () => true, {
        before: {
            payloadReducer: (...args) => args
        },
        after: {
            payloadReducer: ({output}) => output
        }
    });

    function dispatch({type, payload}) {
        if (type === 'LOGIN_4_BEFORE') {
            t.deepEqual(payload, [1, 2, 3]);
        } else if (type === 'LOGIN_4_AFTER') {
            t.true(payload);
        }
    }

    login(1, 2, 3)(dispatch);
});

test('metaReducer', t => {
    const login = fn('LOGIN_5', () => true, {
        before: {
            metaReducer: () => 'b'
        },
        after: {
            metaReducer: () => 'a'
        }
    });

    function dispatch({type, meta}) {
        if (type === 'LOGIN_5_BEFORE') {
            t.is(meta, 'b')
        } else if (type === 'LOGIN_5_AFTER') {
            t.is(meta, 'a');
        }
    }

    login()(dispatch);
});
