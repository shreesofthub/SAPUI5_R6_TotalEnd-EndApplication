sap.ui.define(
    ["sap/ui/core/mvc/Controller",
        "sap/m/MessageBox"
    ],
    function (Controller, MessageBox) {
        "use strict"
        return Controller.extend("r6tableandlist.controller.view3", {
            onInit: function () {
                this.oRouter = this.getOwnerComponent().getRouter();
            },
            onBack: function () {
                this.getOwnerComponent().back();
            },
            onSave: function () {
                var oSF = this.getView().byId("idV3SF").getContent();
                if (!oSF[1].getValue()) {
                    this.getView().byId("idV3Ip1").setValueStateText("Product ID is Required");
                    this.getView().byId("idV3Ip1").setValueState("Error");
                } else {
                    this.pID = oSF[1].getValue();
                    var pName = oSF[3].getValue();
                    var pDesc = oSF[5].getValue();
                    var pPrice = oSF[7].getValue();
                    var pCurr = oSF[9].getValue();
                    var pSts = oSF[11].getValue().toUpperCase();
                    var pStsCd = "";
                    if (pSts === "AVAILABLE") {
                        pStsCd = "A";
                    } else {
                        pStsCd = "NA";
                    };
                    var aSupplier = [];
                    var aRows = this.getView().byId("idV3Table").getItems();
                    for (var i = 0; i < aRows.length; i++) {
                        var jsonObj = {
                            Supid: aRows[i].getCells()[0].getValue(),
                            Prdid: aRows[i].getCells()[1].getValue(),
                            Supname: aRows[i].getCells()[2].getValue(),
                            Suploc: aRows[i].getCells()[3].getValue(),
                        }
                        aSupplier.push(jsonObj);
                    }
                    var payLoad = {
                        Prdid: this.pID,
                        Prdname: pName,
                        Prddesc: pDesc,
                        Prdprice: pPrice,
                        Currcode: pCurr,
                        Status: pSts,
                        Statuscode: pStsCd,
                        toSuppliers: aSupplier
                    }
                    var oModel = this.getOwnerComponent().getModel();
                    oModel.create("/productsSet", payLoad, {
                        success: function (req, res) {
                            MessageBox.success("New Product-" + res.data.Prdid + " Created Successfully");
                        },
                        error: function () {
                            MessageBox.error("Some Error occured please contact Administrator");
                        }
                    });
                }
            },
            onCancel: function () {
                var oSF = this.getView().byId("idV3SF").getContent();
                oSF.length = 0;
                this.getOwnerComponent().back();
            },
            onAdd: function () {
                var that = this;
                var oTable = this.getView().byId("idV3Table");
                var oNewRow = new sap.m.ColumnListItem({
                    cells: [
                        new sap.m.Input(),
                        new sap.m.Input(),
                        new sap.m.Input(),
                        new sap.m.Input(),
                        new sap.m.Button({
                            icon: "sap-icon://delete",
                            type: "Reject",
                            press: function (oEvent) {
                                oTable.removeItem(oEvent.getSource().getParent());
                            }.bind(this)
                        })
                    ]
                })
                oTable.addItem(oNewRow);
            },
            handleUploadComplete: function () {
                sap.m.MessageToast.show("File Uploaded");
            },
            onUpload: function () {
                var oModel = this.getOwnerComponent().getModel();
                this.oFileUploader = this.getView().byId("fileUploader");
                if (this.oFileUploader.getValue() === "") {
                    MessageToast.show("Please Choose any File");
                } else {
                    this.slug = this.getView().byId("idV3Ip1").getValue() + ',' + this.oFileUploader.getValue();
                }
                this.oFileUploader.addHeaderParameter(new sap.ui.unified.FileUploaderParameter({
                    name: "SLUG",
                    value: this.slug
                }));
                this.oFileUploader.addHeaderParameter(new sap.ui.unified.FileUploaderParameter({
                    name: "x-csrf-token",
                    value: oModel.getSecurityToken()
                }));
                this.oFileUploader.setSendXHR(true);
                this.oFileUploader.upload();
            }
        });
    }
)