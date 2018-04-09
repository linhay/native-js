const cache = {

    get: function (list, cb) {
        Native.post('sp://cache/get', {list: JSON.stringify(list)}, cb)
    },

    set: function (key, value, cb) {
        Native.post('sp://cache/set', {key: value}, cb)
    }

}
