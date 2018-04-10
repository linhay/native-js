
const native = function (source, version, wp) {
    this.config = {
        source: source,
        wp: wp,
        version: version
    }
    return this
}

native.prototype.config = {
    source: -1,
    wp: -1,
    version: -1
}

native.prototype.navigatior = new nav(this.config);
// native.prototype.network = network;
// native.prototype.cache = cache;
// native.prototype.web = web;
// native.prototype.app = app;