sap.ui.define(
    ["sap/ui/core/mvc/Controller",
        "r6tableandlist/model/formatter",
        "sap/m/MessageBox"],
    function (Controller, formatter, MessageBox) {
        return Controller.extend("r6tableandlist.controller.view2", {
            f: formatter,
            onInit: function () {
                this.oRouter = this.getOwnerComponent().getRouter();
                this.getOwnerComponent().getRouter().getRoute("view2").attachPatternMatched(this.onPatternMatched, this);
            },
            onBack: function () {
                this.getOwnerComponent().back();
            },
            onPatternMatched: function (oEvent) {
                this.prdID = oEvent.getParameter("arguments").key;
                this.getView().bindElement("/productsSet('" + this.prdID +"')");
                // this.getView().bindElement({
                //     path: "/productsSet('" + this.prdID + "')",
                //     paremeters: {
                //         expand: "toSuppliers"
                //     }
                // });
            },
            onEdit: function () {
                this.oRouter.navTo("view4", {
                    key: this.prdID
                });
            },
            onDelete: function () {
                var that = this;
                var oModel = this.getOwnerComponent().getModel();
                MessageBox.confirm("Really do you want to delete this product", {
                    onClose: function (Action) {
                        if (Action === "OK") {
                            oModel.remove("/productsSet('" + that.prdID + "')", {
                                success: function (res) {
                                    MessageBox.success("Product-" + that.prdID + " deleted Successfully", {
                                        onClose: function () {
                                            that.getOwnerComponent().back();
                                        }
                                    });
                                },
                                error: function () {
                                    MessageBox.error("Error occured please check");
                                }
                            });
                        }
                    }
                })
            },
            onAttachDownload: function (oEvent) {
                var Prdid = oEvent.getSource().getBindingContext().getObject().Prdid;
                var Filename = oEvent.getSource().getBindingContext().getObject().Filename;
                var url = "/sap/opu/odata/sap/ZSHREE_PRODUCTS_SRV/attachmentsSet(Prdid='" + Prdid + "',Filename='" +Filename + "')/$value";
                sap.m.URLHelper.redirect(url,false);
            }

        })
    }
)