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
    this.navigatior = new _native_nav();
    this.cache = new _native_storage();
    this.app = new _native_app();
    this.web = new _native_web();
    this.network = new _native_network();
    this.life = new _native_life();
    this.init();
};

native.prototype.init = function () {
    if ((native_config.wp) && native_config.wp < 2000) {
        var data = {};
        data.url = 'http://t/t';
        data.isHiddenNavbar = 1;
        data.isHiddenLoadAnimation = 1;
        data.navbarItems = [];
        Native.bridge_for_1('ui', data);
    }

    if ((native_config.wp) && native_config.wp > 2000) {
        Native.post('sp://web/config?version' + native_config.wp);
    }

};

native.prototype.navigatior = null;
native.prototype.network = null;
native.prototype.cache = null;
native.prototype.web = null;
native.prototype.app = null;
native.prototype.life = null;