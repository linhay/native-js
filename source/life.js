var _native_life = function () {
    this.enterBackground()
};

_native_life.prototype.enterForeground = function (cb) {
    var name = 'enterForeground';
    NativeEvent.removeEvent(name);
    NativeEvent.addEvent(name, cb);
};

_native_life.prototype.enterBackground = function (cb) {
    var name = 'enterBackground';
    NativeEvent.removeEvent(name);
    NativeEvent.addEvent(name, cb);
};

_native_life.prototype.backFromNative = function (cb) {
    var name = 'backFromNative';
    NativeEvent.removeEvent(name);
    NativeEvent.addEvent(name, cb);
};

_native_life.prototype.backFromWeb = function (cb) {
    var name = 'backFromWeb';
    NativeEvent.removeEvent(name);
    NativeEvent.addEvent(name, cb);
};

/* 2.0 life */
function enterForeground() {
    NativeEvent.fireEvent('enterForeground');
};

function enterBackground() {
    NativeEvent.fireEvent('enterBackground');
};

function backFromNative() {
    NativeEvent.fireEvent('backFromNative');
};

function backFromWeb() {
    NativeEvent.fireEvent('backFromWeb');
};


/* 1.0 life */
function didAppear() {
    if (Native.isEnterNative) {
        Native.isEnterNative = false;
        NativeEvent.fireEvent('backFromNative');
    }
}

function webDidAppear() {
    NativeEvent.fireEvent('backFromWeb');
}