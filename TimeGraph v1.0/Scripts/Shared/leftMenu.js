tg.shared = tg.shared || {};
tg.shared.LeftMenu = function() {
    function ctor(sandbox, options) {
        this.sandbox = sandbox;
        this.panelSelector = options.panelSelector;
        this.togglingDuration = options.togglingDuration;
        this.isToggling = false;
    }

    ctor.prototype.toggle = function () {
        var self = this;
        var toggleOptions = {
            duration: self.togglingDuration,
            done: function () { self.isToggling = false; }
        };
        var toggleProperties = { width: 'toggle' };
        if (!self.isToggling) {
            self.isToggling = true;
            $(self.panelSelector).animate(toggleOptions, toggleProperties);
        }

    }

    return ctor;
}();
