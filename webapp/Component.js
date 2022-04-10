sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/Device",
    "r6tableandlist/model/models",
    "sap/ui/core/routing/History"
],
    function (UIComponent, Device, models, History) {
        "use strict";

        return UIComponent.extend("r6tableandlist.Component", {
            metadata: {
                manifest: "json"
            },

            /**
             * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
             * @public
             * @override
             */
            init: function () {
                // call the base component's init function
                UIComponent.prototype.init.apply(this, arguments);

                // enable routing
                this.getRouter().initialize();

                // set the device model
                this.setModel(models.createDeviceModel(), "device");

                // back functionality using History.
                this.back();
            },
            back: function () {
                var prevTag = History.getInstance().getPreviousHash();
                if (prevTag) {
                    history.go(-1);
                } else {
                    this.getRouter().navTo("default");
                }
            }
        });
    }
);