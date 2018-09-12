// Provides control zcustom.frasers.docuplace.PlaceLocator.
sap.ui.define([
	"jquery.sap.global", 
	"./../library", 
	"sap/ui/core/Control", 
	"sap/client/basecontrols/core/CustomPane",
	"zcustom/frasers/docuplace/lib/ol"],
	function (jQuery, library, Control, CustomPane, OpenLayerLib) {
		"use strict";

		var PlaceLocator = CustomPane.extend("zcustom.frasers.docuplace.controls.PlaceLocator", {
			metadata: {

				library: "zcustom.frasers.docuplace",
				properties: {},
				aggregations: {},
				events: {}
			},

			initializePane: function () {

			},

			onBeforeRendering: function () {

			},

			onAfterRendering: function () {
				var extent = [0, 0, 1024, 968];
				var projection = new OpenLayerLib.Projection({
					code: "xkcd-image",
					units: "pixels",
					extent: extent
				});

				var map = new OpenLayerLib.Map({
					layers: [
						new OpenLayerLib.ImageLayer({
							source: new OpenLayerLib.Static({
								attributions: "Floorplan UG1",
								url: "https://imgs.xkcd.com/comics/online_communities.png", // eslint-disable-line sap-no-hardcoded-url
								projection: projection,
								imageExtent: extent
							})
						})
					],
					target: "floorplan",
					view: new OpenLayerLib.View({
						projection: projection,
						center: OpenLayerLib.Extent.getCenter(extent),
						zoom: 2,
						maxZoom: 8
					})
				});
			}
		});

		return PlaceLocator;
	}, /* bExport= */ true);