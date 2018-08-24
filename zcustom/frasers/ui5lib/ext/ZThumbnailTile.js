sap.ui.define([
	"sap/m/GenericTile",
	"zcustom/frasers/ui5lib/ext/ZThumbnailTileRenderer",
	"sap/m/library"
], function (GenericTile, ZThumbnailTileRenderer, stdLibrary) {
	"use strict";

	var ZThumbnailTile = GenericTile.extend("zcustom.frasers.ui5lib.ext.ZThumbnailTile", /** @lends zcustom.frasers.ui5lib.ext.ZThumbnailTile.prototype */ {
		metadata: {
			library: "zcustom.frasers.ui5lib"
		},
		renderer: function (oRm, oControl) {
			ZThumbnailTileRenderer.render(oRm, oControl);
		}
	});

	// just fixing title text doesn't exist
	ZThumbnailTile.prototype._isHeaderTextTruncated = function () {
		var oDom, iMaxHeight, $Header, iWidth;
		if (this.getMode() === stdLibrary.GenericTileMode.LineMode) {
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