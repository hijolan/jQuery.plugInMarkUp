(function () {
	(function ($, window, document) {
		var Plugin, defaults, pluginName;
		pluginName = "plugInMarkUp";
		defaults = {
			property: "value"
		};

		/**
		 * @class NoPluginFoundException
		 * @param plugInName
		 * @constructor
		 */
		function NoPluginFoundException(plugInName) {
			this.message = "No jQuery plugin named '" + plugInName + "' found";
			this.name = "";
		}

		Plugin = (function () {
			function Plugin(element, options) {
				this.element = element;
				this.options = $.extend({}, defaults, options);
				this._defaults = defaults;
				this._name = pluginName;
				this.init();
			}

			/**
			 * activates plugins from given data attributes in html source
			 *
			 * @param {jQuery} element
			 * @returns {*}
			 */
			Plugin.prototype.enablePlugInsForSection = function (element) {
				// find all jQuery dom elements that have the correct markup

				var $sectionsWithPlugIns = $(element).filter("[data-enable-plugins]").add($(element).find("[data-enable-plugins]"));

				// iterate over them
				$sectionsWithPlugIns.each($.proxy(function (sectionIndex, subSection) {
					// get plugin names for that section
					var plugIns = eval($(subSection).data("enable-plugins")); // jshint ignore:line
					// iterate over plugins
					$.each(plugIns, $.proxy(function (pluginIndex, plugInName) {
						// fetch arguments if given
						var pluginArguments = eval($(subSection).data(plugInName.toLowerCase())); // jshint ignore:line
						// and start plugin
						if (typeof $(subSection)[plugInName] !== "function") {
							throw new NoPluginFoundException(plugInName);
						} else {
							$(subSection)[plugInName].apply($(subSection), pluginArguments);
						}
					}, this));
				}, this));
			};

			Plugin.prototype.init = function () {
				return this.enablePlugInsForSection(this.element);
			};

			return Plugin;

		})();
		return $.fn[pluginName] = function (options) {
			return this.each(function () {
				if (!$.data(this, "plugin_" + pluginName)) {
					return $.data(this, "plugin_" + pluginName, new Plugin(this, options));
				}
			});
		};
	})(jQuery, window, document);

}).call(this);
