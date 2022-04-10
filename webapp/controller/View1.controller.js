sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter",
    "r6tableandlist/model/formatter",
    "sap/ui/export/Spreadsheet"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, Filter, FilterOperator, Sorter, formatter, Spreadsheet) {
        "use strict";
        return Controller.extend("r6tableandlist.controller.View1", {
            f: formatter,
            onInit: function () {
                this.router = this.getOwnerComponent().getRouter();
                this.byId("idList").setVisible(false);
                this.byId("page").setTitle("Display Products in Table Format");
                var searchData = {
                    aPrices: [
                        { "price": ">150000" },
                        { "price": "<150000" }
                    ],
                    "statuses": [
                        {
                            "status": "Available",
                            "code": "A"
                        },
                        {
                            "status": "Not Available",
                            "code": "NA"
                        }
                    ],
                    "currencies": [
                        { "currency": "INR" },
                        { "currency": "USD" }
                    ],
                    "sort": [
                        {
                            "field": "Prdid",
                            "desc": "Product ID"
                        },
                        {
                            "field": "Prdname",
                            "desc": "Product Name"
                        },
                        {
                            "field": "Prdprice",
                            "desc": "Product Price"
                        }
                    ],
                    "orders": [
                        { "order": "Ascending" },
                        { "order": "Descending" }
                    ]
                };
                var oModel = new JSONModel(searchData);
                this.getView().setModel(oModel, "searchModel");
            },
            onRbSelect: function (oEvent) {
                var selectedIndex = oEvent.getParameter("selectedIndex");
                if (selectedIndex === 0) {
                    this.byId("idList").setVisible(false);
                    this.byId("idTable").setVisible(true);
                    this.byId("page").setTitle("Display Products in Table Format");
                } else if (selectedIndex === 1) {
                    this.byId("idTable").setVisible(false);
                    this.byId("idList").setVisible(true);
                    this.byId("page").setTitle("Display Products in List Format");
                }
            },
            onValueHelp: function () {
                if (!this.dialog) {
                    this.dialog = new sap.ui.xmlfragment(this.getView().getId(), "r6tableandlist.fragments.popup", this);
                    this.getView().addDependent(this.dialog);
                }
                this.dialog.open();
            },
            onDialogClose: function () {
                this.dialog.close();
            },
            onDialogValueSelection: function (oEvent) {
                var selectedValue = oEvent.getParameter("listItem").getBindingContext().getProperty("Prdid")
                this.byId("idPrdId").setValue(selectedValue);
                this.dialog.close();
            },
            onSearch: function () {
                var productId = this.getView().byId("idPrdId").getValue();
                var priceButton = this.getView().byId("idRbgS").getSelectedButton();
                var currencyCB = this.getView().byId("idComB").getSelectedItem();
                var status = this.getView().byId("idMComB").getSelectedItems();
                var sortField = this.getView().byId("idComBSort").getSelectedItem();
                var sortOrder = this.getView().byId("idRbGSort").getSelectedButton();
                var aFilter = [];
                if (productId) {
                    var oFilter = new Filter("Prdid", FilterOperator.EQ, productId);
                    aFilter.push(oFilter);
                };
                if (priceButton) {
                    var price = priceButton.getText();
                    if (price === ">150000") {
                        var oFilter = new Filter("Prdprice", FilterOperator.GT, "150000");
                    } else {
                        var oFilter = new Filter("Prdprice", FilterOperator.LT, "150000");
                    }
                    aFilter.push(oFilter);
                };
                if (currencyCB) {
                    var currency = currencyCB.getText();
                    var oFilter = new Filter("Currcode", FilterOperator.EQ, currency);
                    aFilter.push(oFilter);
                };
                if (status.length > 0) {
                    var aStatus = [];
                    for (var i = 0; i < status.length; i++) {
                        aStatus.push(new Filter("Statuscode", FilterOperator.EQ, status[i].getKey()));
                    }
                    var oStatusFilter = new Filter(aStatus, false);
                    aFilter.push(oStatusFilter);
                };
                if (sortField && sortOrder) {
                    var sortFieldValue = sortField.getKey();
                    var oSort;
                    var sortOrderValue = sortOrder.getText();
                    if (sortOrderValue === "Ascending") {
                        sortOrderValue = false;
                    } else {
                        sortOrderValue = true;
                    }
                    oSort = new Sorter(sortFieldValue, sortOrderValue);
                }
                this.getView().byId("idTable").getBinding("items").filter(aFilter).sort(oSort);
            },
            onReset: function () {
                this.getView().byId("idPrdId").setValue("");
                this.getView().byId("idRbgS").setSelectedIndex(-1);
                this.getView().byId("idComB").setSelectedKey("");
                this.getView().byId("idMComB").setSelectedKeys("");
                this.getView().byId("idTable").getBinding("items").filter([]);
            },
            onProductSelection: function (oEvent) {
                var selectedProductID = oEvent.getSource().getBindingContext().getProperty("Prdid");
                this.router.navTo("view2", {
                    key: selectedProductID
                });
            },
            onCreation: function () {
                this.router.navTo("view3");
            },
            onExcelDownlaod: function () {
                var oSheet, oSettings, acols, oRowBinding;
                oRowBinding = this.getView().byId("idTable").getBinding("items");
                acols = [
                    {
                        lable: "Product ID",
                        property: "Prdid"
                    },
                    {
                        lable: "Product Name",
                        property: "Prdname"
                    },
                    {
                        lable: "Description",
                        property: "Prddesc"
                    },
                    {
                        lable: "Price",
                        property: "Prdprice"
                    },
                    {
                        lable: "Currency Code",
                        property: "Currcode"
                    },
                    {
                        lable: "Status",
                        property: "Status"
                    }
                ]
                oSettings = {
                    workbook: {
                        columns: acols
                    },
                    dataSource: oRowBinding,
                    fileName: "myTableData.xlsx"
                };
                oSheet = new Spreadsheet(oSettings);
                oSheet.build().finally(function () {
                    oSheet.destroy();
                });
            },
            onPdfDownlaod: function () {
                var oColumns = ["Product ID", "Product Name", "Description", "Product Price", "Currency", "Status"];
                var data = [];
                var oTableItems = this.getView().byId("idTable").getItems();
                for (var i = 0; i < oTableItems.length; i++) {
                    data[i] = [
                        oTableItems[i].getCells()[0].getText(),
                        oTableItems[i].getCells()[1].getText(),
                        oTableItems[i].getCells()[2].getText(),
                        oTableItems[i].getCells()[3].getText(),
                        oTableItems[i].getCells()[4].getText(),
                        oTableItems[i].getCells()[5].getText()
                    ];
                };
                var doc = new jsPDF('p', 'pt');
                doc.autoTable(oColumns, data);
                doc.save("products.pdf");
            }
        });
    });
