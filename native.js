
var native_config = {
    source: -1,
    wp: -1,
    version: -1
}

var native = function (source, version, wp) {
    native_config = {
        source: source,
        wp: wp,
        version: version
    },
    this.navigatior = new nav();
}

native.prototype.navigatior = null;
// native.prototype.network = network;
// native.prototype.cache = cache;
// native.prototype.web = web;
// native.prototype.app = app;
