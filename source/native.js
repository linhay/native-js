var native_config = {
    source: -1,
    wp: -1,
    version: -1
};

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
    this.web = new web();
    this.network = new network();
    this.life = new life();
    if ((wp) && wp < 2000) {
        Native.bridge_for_1('ui', {
            isHiddenNavbar: 1,
            isHiddenLoadAnimation: 1
        });
    }
};


native.prototype.navigatior = null;
native.prototype.network = null;
native.prototype.cache = null;
native.prototype.web = null;
native.prototype.app = null;
native.prototype.life = null;