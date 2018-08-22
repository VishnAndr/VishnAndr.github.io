sap.ui.define([
	"sap/m/TileContent",
	"zcustom/demo/ui5lib/ext/ZThumbnailTileContentRenderer"
], function (GenericTile, ZThumbnailTileContentRenderer) {
	"use strict";

	var ZThumbnailTileContent = TileContent.extend("zcustom.demo.ui5lib.ext.ZThumbnailTileContent", /** @lends zcustom.demo.ui5lib.ext.ZThumbnailTileContent.prototype */ {
		metadata: {
			library: "zcustom.demo.ui5lib"
		},
		renderer: function (oRm, oControl) {
			ZThumbnailTileContentRenderer.render(oRm, oControl);
		}
	});

	return ZThumbnailTileContent;
});