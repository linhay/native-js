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
    };
    Native.source = source;
    this.navigatior = new nav();
    this.cache = new storage();
    this.app = new app();
}

native.prototype.navigatior = null;
// native.prototype.network = network;
native.prototype.cache = null;
// native.prototype.web = web;
native.prototype.app = null;