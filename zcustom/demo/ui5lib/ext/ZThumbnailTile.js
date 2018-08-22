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

	return ZThumbnailTile;
});