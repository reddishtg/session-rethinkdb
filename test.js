var Promise = require('bluebird');
var sinon = require('sinon');
var test = require('tape');
var session = require('express-session');

var drainStores = [];

// test('set then clear', function (t) {
//     t.plan(3);
//     var store = RethinkStore({
//         clearInterval: 60000
//     });
//     drainStores.push(store);
//     store.set('test1', {cookie: {maxAge: 1000}, name: 'InsertThenClear'})
//     .then(function () {
//         store.clear(function(err, cleared) {
//             t.error(err);
//
//             store.length(function(err, len) {
//                 t.error(err, 'no error after clear');
//                 t.equal(len, 0, 'empty after clear');
//             });
//         })
//     })
// })

test('clearInterval', function (t) {
    var clock = sinon.useFakeTimers();

    var RethinkStore = require('./index')(session);

    var store = RethinkStore({
        clearInterval: 7367
    });
    drainStores.push(store);
    t.plan(1);
    store.set('test2a', {cookie: {originalMaxAge: 100}, name: 'clearByInterval'})
    .then(function () {
        clock.tick(8000);
        clock.restore();
        setTimeout(function () {
            store.length()
            .then(function (len) {
                t.equal(len, 0);
            })
        }, 1000);
    })
    clock.tick(8000);

})

test('done', function (t) {
    Promise.all(drainStores.map(function (store) {
        return store.r.getPoolMaster().drain();
    }))
    .then(function () {
        t.end();
    })
});
