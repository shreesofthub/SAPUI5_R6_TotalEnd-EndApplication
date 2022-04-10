    sap.ui.define(
    ["sap/ui/core/mvc/Controller",
        "sap/m/MessageBox"],
    function (Controller, MessageBox) {
        "use strict"
        return Controller.extend("r6tableandlist.controller.view4", {
            onInit: function () {
                this.oRouter = this.getOwnerComponent().getRouter();
                this.oRouter.attachRoutePatternMatched(this.onPatternMatched, this);
            },
            onPatternMatched: function (oEvent) {
                this.productID = oEvent.getParameter("arguments").key;
                this.getView().bindElement("/productsSet('" + this.productID + "')");
                this.getView().byId("idPage4").setTitle("Edit the Selected Product-" + this.productID);
            },
            onBack: function () {
                this.getOwnerComponent().back();
            },
            onSave: function () {
                var oPName = this.getView().byId("idV4I2").getValue();
                var oPDesc = this.getView().byId("idV4I3").getValue();
                var oPPrice = this.getView().byId("idV4I4").getValue();
                var oPCurr = this.getView().byId("idV4I5").getValue();
                var oPSts = this.getView().byId("idV4I6").getValue();
                var oStsCode;
                if (oPSts.toUpperCase() === "AVAILABLE") {
                    oStsCode = "A";
                } else {
                    oStsCode = "NA";
                }
                var payLoad = {
                    Prdid: this.productID,
                    Prdname: oPName,
                    Prddesc: oPDesc,
                    Prdprice: oPPrice,
                    Currcode: oPCurr,
                    Status: oPSts,
                    Statuscode: oStsCode
                };
                var oModel = this.getOwnerComponent().getModel();
                oModel.update("/productsSet('" + this.productID + "')", payLoad, {
                    success: function (res) {
                        MessageBox.success("Product ID Edited Successfully");
                    },
                    error: function () {
                        MessageBox.error("Some Error occured please check once again");
                    }
                })
            },
            
        })
    }
)