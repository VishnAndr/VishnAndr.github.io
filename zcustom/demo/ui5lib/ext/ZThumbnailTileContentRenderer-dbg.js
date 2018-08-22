sap.ui.define([
	"sap/m/library",
	"jquery.sap.global",
	"sap/m/TileContentRenderer",
	"sap/ui/core/Renderer"
], function (library, jQuery, TileContentRenderer, Renderer) {
	"use strict";

	var ZThumbnailTileContentRenderer = Renderer.extend(TileContentRenderer);

	ZThumbnailTileContentRenderer.render = function (oRm, oControl) {

		var sTooltip = oControl.getTooltip_AsString();
		var sContentTypeClass = oControl._getContentType();
		if (sContentTypeClass) {
			sContentTypeClass = jQuery.sap.encodeCSS(sContentTypeClass);
		}
		var sFrameTypeClass = jQuery.sap.encodeCSS("sapMFrameType" + oControl.getFrameType());

		oRm.write("<div");
		oRm.writeControlData(oControl);
		oRm.addClass("sapMTileCnt");
		oRm.addClass(sContentTypeClass);
		oRm.addClass(sFrameTypeClass);
		if (sTooltip.trim()) { // trim check needed since IE11 renders white spaces
			oRm.writeAttributeEscaped("title", sTooltip);
		}
		oRm.writeClasses();
		oRm.write(">");
		this._renderContent(oRm, oControl); // chg: use own _renderContent
		if (oControl.getFooter()) { // chg: rendering footer if it has been given only
			this._super._renderFooter(oRm, oControl);
		}

		oRm.write("</div>");
	};

	ZThumbnailTileContentRenderer._renderContent = function(oRm, oControl) {
		if (!oControl._bRenderContent) {
			return;
		}

		var oContent = oControl.getContent();
		if (oContent) {
			oRm.write("<div");
			//oRm.addClass("sapMTileCntContent"); // chg: hide this class, it will prevent whitening
			oRm.writeClasses();
			oRm.writeAttribute("id", oControl.getId() + "-content");
			oRm.write(">");
			if (!oContent.hasStyleClass("sapMTcInnerMarker")) {
				oContent.addStyleClass("sapMTcInnerMarker");
			}
			oRm.renderControl(oContent);
			oRm.write("</div>");
		}
	};

	return ZThumbnailTileContentRenderer;

}, /* bExport= */ true);