sap.ui.define([
	"sap/client/basecontrols/core/CustomPane",
	"sap/m/MessageToast",
	"sap/m/MessageBox"
], function(CustomPane, MessageToast, MessageBox) {
	"use strict";

	// Provides control zcustom.frasers.ui5lib.control.ZCustomEmptyPane
	var ZPoCCustomPane = CustomPane.extend("zcustom.frasers.ui5lib.control.ZPoCCustomPane", /** @lends zcustom.frasers.ui5lib.control.ZCustomEmptyPane.prototype */ {
		metadata: {

			library: "zcustom.frasers.ui5lib",
			properties: {},
			aggregations: {
				_btn: {
					type: "sap.m.Button",
					multiple: false,
					visibility: "hidden"
				}
			},
			events: {}
		},

		renderer: function(oRM, oControl) {
			jQuery.sap.log.debug(">> renderer");

			if (!oControl.getVisible()) {
				return;
			}

			oRM.write("<span");
			oRM.writeControlData(oControl);
			oRM.write(">");
			oRM.renderControl(oControl.getAggregation("_btn"));
			oRM.write("</span>");
		},

		initializePane: function() {
			jQuery.sap.log.debug(">> initializePane");

			var that = this;

			this.btn = new sap.m.Button({
				width: "100%",
				text: "Test",
				press: jQuery.proxy(this._onButtonPressed, this)
			});

			this.setAggregation("_btn", this.btn);
		},

		onBeforeRendering: function() {
			jQuery.sap.log.debug(">> onBeforeRendering");

			var that = this;

		},

		onAfterRendering: function() {
			jQuery.sap.log.debug(">> onAfterRendering");

			var that = this;

		},

		_onButtonPressed: function() {
			jQuery.sap.log.debug(">> _onButtonPressed");

			try {
				this.getController().getParentController().getDataContainer().getDataObject("/Root/zFeederRelevant/SelectedSMAPEmail").setValue(
					"vishneuski@gmail.com");
			} catch (err) {
				jQuery.sap.log.error("Error in _onButtonPressed: ", err.message,"zcustom");
			}
		}
	});

	return ZPoCCustomPane;

}, true);