sap.ui.define(["jquery.sap.global"],

	function ( /*jQuery*/ ) {
		"use strict";

		/**
		 * PlaceLocator renderer.
		 * @namespace
		 */
		var PlaceLocatorRenderer = {};

		PlaceLocatorRenderer.render = function (oRm, oControl) {

			oRm.write("<div");
			oRm.writeControlData(oControl);
			oRm.writeClasses();
			oRm.write(">");
			oRm.write("<div id='floorplan' class='floorplan'>");
			oRm.write("</div>");
			oRm.write("</div>");

		};

		return PlaceLocatorRenderer;

	}, /* bExport= */ true);