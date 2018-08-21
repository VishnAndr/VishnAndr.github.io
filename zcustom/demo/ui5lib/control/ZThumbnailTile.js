sap.ui.define([
	"sap/m/GenericTile",
	"zcustom/demo/ui5lib/control/ZThumbnailTileRenderer"
], function (GenericTile, ZThumbnailTileRenderer) {
	"use strict";

	var ZThumbnailTile = GenericTile.extend("zcustom.demo.ui5lib.control.ZThumbnailTile", /** @lends zcustom.demo.ui5lib.control.ZThumbnailTile.prototype */ {
		metadata: {
			library: "zcustom.demo.ui5lib",
			aggregations : {
				"tileContent" : {type : "sap.ui.core.Control", multiple : true, bindable : "bindable"} // chg: switch to sap.ui.core.Control instead of sap.m.TileContent
			}			
		},
		renderer: function (oRm, oControl) {
			ZThumbnailTileRenderer.render(oRm, oControl);
		}
	});

	return ZThumbnailTile;
});