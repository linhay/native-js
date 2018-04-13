var life = function () {
    this.enterBackground()
};

life.prototype.enterForeground = function (cb) {
    var name = 'enterForeground';
    NativeEvent.removeEvent(name);
    NativeEvent.addEvent(name, cb);
};

life.prototype.enterBackground = function (cb) {
    var name = 'enterBackground';
    NativeEvent.removeEvent(name);
    NativeEvent.addEvent(name, cb);
};

life.prototype.backFromNative = function (cb) {
    var name = 'backFromNative';
    NativeEvent.removeEvent(name);
    NativeEvent.addEvent(name, cb);
};

life.prototype.backFromWeb = function (cb) {
    var name = 'backFromWeb';
    NativeEvent.removeEvent(name);
    NativeEvent.addEvent(name, cb);
};


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