var _native_network = function () {

};

_native_network.prototype.post = function (params, cb) {
    Native.post("sp://network/post", params, cb)
};

