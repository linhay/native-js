var network = function () {

};

network.prototype.post = function (params, cb) {
    Native.post("sp://network/post", params, cb)
};