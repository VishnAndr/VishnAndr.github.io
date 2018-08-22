// This extension is required due to a bug in standard sap.m.Image
// when the load event not working if LightBox is attached
sap.ui.define([
	"sap/m/Image"
], function (Image) {
	"use strict";

	var ZImage = Image.extend("zcustom.demo.ui5lib.ext.ZImage", /** @lends zcustom.demo.ui5lib.ext.ZImage.prototype */ {
		metadata: {
			library: "zcustom.demo.ui5lib"
		}
	});

	ZImage.prototype.onAfterRendering = function() {
		var $DomNode = this.$(),
			sMode = this.getMode(),
			oDomImageRef;
		
		// chg: to fix the issue for load/error event when the detailbox is set (e.g. with LightBox)	
		if (this.getDetailBox()) {
			$DomNode = this.$().children('img').first();
		}
		// end chg

		if (sMode === ImageMode.Image) {
			// bind the load and error event handler
			$DomNode.on("load", jQuery.proxy(this.onload, this));
			$DomNode.on("error", jQuery.proxy(this.onerror, this));

			oDomImageRef = $DomNode[0];
		}

		if (sMode === ImageMode.Background) {
			oDomImageRef = this._oImage;
		}

		// if image has already been loaded and the load or error event handler hasn't been called, trigger it manually.
		if (oDomImageRef && oDomImageRef.complete && !this._defaultEventTriggered) {
			// need to use the naturalWidth property instead of jDomNode.width(),
			// the later one returns positive value even in case of broken image
			if (oDomImageRef.naturalWidth > 0) {
				this.onload({/* empty event object*/});
			} else {
				this.onerror({/* empty event object*/});
			}
		}
	};
	
	return ZImage;
});