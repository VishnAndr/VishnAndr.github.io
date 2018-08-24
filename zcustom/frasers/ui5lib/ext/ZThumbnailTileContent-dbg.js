sap.ui.define([
	"sap/m/TileContent",
	"zcustom/frasers/ui5lib/ext/ZThumbnailTileContentRenderer"
], function (TileContent, ZThumbnailTileContentRenderer) {
	"use strict";

	var ZThumbnailTileContent = TileContent.extend("zcustom.frasers.ui5lib.ext.ZThumbnailTileContent", /** @lends zcustom.frasers.ui5lib.ext.ZThumbnailTileContent.prototype */ {
		metadata: {
			library: "zcustom.frasers.ui5lib"
		},
		renderer: function (oRm, oControl) {
			ZThumbnailTileContentRenderer.render(oRm, oControl);
		}
	});

	return ZThumbnailTileContent;
});