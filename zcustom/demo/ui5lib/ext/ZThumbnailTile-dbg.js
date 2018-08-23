sap.ui.define([
	"sap/m/GenericTile",
	"zcustom/demo/ui5lib/ext/ZThumbnailTileRenderer"
], function (GenericTile, ZThumbnailTileRenderer) {
	"use strict";

	var ZThumbnailTile = GenericTile.extend("zcustom.demo.ui5lib.ext.ZThumbnailTile", /** @lends zcustom.demo.ui5lib.ext.ZThumbnailTile.prototype */ {
		metadata: {
			library: "zcustom.demo.ui5lib"
		},
		renderer: function (oRm, oControl) {
			ZThumbnailTileRenderer.render(oRm, oControl);
		}
	});

	// just fixing title text doesn't exist
	ZThumbnailTile.prototype._isHeaderTextTruncated = function () {
		var oDom, iMaxHeight, $Header, iWidth;
		if (this.getMode() === library.GenericTileMode.LineMode) {
			$Header = this.$("hdr-text");
			if ($Header.length > 0) {
				iWidth = Math.ceil($Header[0].getBoundingClientRect().width);
				return ($Header[0] && iWidth < $Header[0].scrollWidth);
			} else {
				return false;
			}
		} else {
			oDom = this.getAggregation("_titleText").getDomRef("inner");
			if (oDom) { // chg: fix
				iMaxHeight = this.getAggregation("_titleText").getClampHeight(oDom);
				return (iMaxHeight < oDom.scrollHeight);
			} else {
				return false;
			}
		}
	};

	return ZThumbnailTile;
});