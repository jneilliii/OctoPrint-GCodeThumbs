# coding=utf-8
from __future__ import absolute_import

import octoprint.plugin

class GCodeThumbsPlugin(octoprint.plugin.StartupPlugin,
						octoprint.plugin.AssetPlugin,
						octoprint.plugin.TemplatePlugin):

	def on_after_startup(self):
	  self._logger.info("Hello World from GCodeThumbsPlugin!")

	def get_assets(self):
		return dict(
			js=["js/three.js", "js/OrbitControls.js", "js/LineSegments2.js", "js/Line2.js", "js/LineSegmentsGeometry.js", "js/LineGeometry", "js/LineMaterial.js", "js/THREE.Meshline.js", "js/GCodeLoader.js", "js/gcodethumbs.js"],
			css=["css/gcodethumbs.css"]
		)

__plugin_implementation__ = GCodeThumbsPlugin()
