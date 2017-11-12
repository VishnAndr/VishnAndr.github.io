/*!
 * ${copyright}
 */
/* globals zcustom */
/* global google.maps:true */
/**
 * Initialization code and shared classes of library zcustom.c4c.ui5lib
 */
sap.ui.define([
	"jquery.sap.global",
	"sap/ui/core/library"
], function(jQuery, library) {
	"use strict";


	/**
	 * A library containing mobile controls
	 *
	 * @namespace
	 * @name zcustom.c4c.ui5lib
	 * @public
	 */

	// library dependencies
	jQuery.sap.registerResourcePath("google.maps", "https://maps.googleapis.com/maps/api/js?key=AIzaSyC4AW-ryf58z7at7ZK15abTfiyGJ_VMMcM&libraries=places");
	
	// delegate further initialization of this library to the Core
	sap.ui.getCore().initLibrary({
		name : "zcustom.c4c.ui5lib",
		dependencies : ["sap.ui.core", "sap.m" , "sap.ui.unified", "google.maps"],
		types: [],
		interfaces: [],
		controls: [
			"zcustom.c4c.ui5lib.control.ZBarCodeScanner"
		],
		elements: [],
		version: "0.1.0"
	});

	return zcustom.c4c.ui5lib;

});
