sap.ui.define(
    [],
    function () {
        "use strict";
        return {
            colorStatus: function (status) {
                if (status === "AVAILABLE") {
                    return "Success";
                } else {
                    return "Error";
                }
            }
        }
    }
)