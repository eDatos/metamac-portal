(function (DOMPurify, moment) {
	"use strict";

	App.namespace('App.Helpers');

	App.Helpers = {
		cleanHtml: function (html) {
			return DOMPurify.sanitize(html, {
				ALLOWED_TAGS: ['a', 'b', 'em', 'i', 'strong', 'u', 'br', 'div', 'ul', 'ol', 'li']
			});
		},

		getHostname: function (url) {
			var l = document.createElement("a");
			l.href = url;
			return l.hostname;
		},

		formatUrl: function (url) {
			//https://css-tricks.com/better-line-breaks-for-long-urls/
			var doubleSlash = url.split('//');

			// Format the strings on either side of double slashes separately
			var formatted = doubleSlash.map(str => {
				// Insert a word break opportunity after a colon
				return str.replace(/(?<after>:)/giu, '$1<wbr>')
					// Before a single slash, tilde, period, comma, hyphen, underline, question mark, number sign, or percent symbol
					.replace(/(?<before>[/~.,\-_?#%])/giu, '<wbr>$1')
					// Before and after an equals sign or ampersand
					.replace(/(?<beforeAndAfter>[=&])/giu, '<wbr>$1<wbr>')
					// Reconnect the strings with word break opportunities after double slashes
				}).join('//<wbr>');
			return formatted;
		},

		createUpdateDatesSection: function (options) {
			var updateDatesSectionParts = [];

			var lastUpdate = options.lastUpdate ? moment.parseZone(options.lastUpdate) : null;
			if (lastUpdate && lastUpdate.isValid()) {
				updateDatesSectionParts.push(I18n.t("entity.dataset.header.lastUpdate", {
					dateLastUpdate: lastUpdate.locale(I18n.locale).format('D MMM YYYY HH:mm [GMT]Z')
				}));
			}

			var nextUpdate = moment(options.nextUpdate, 'DD/MM/YYYY');
			if (nextUpdate.isValid()) {
				updateDatesSectionParts.push(I18n.t("entity.dataset.header.nextUpdate", {
					dateNextUpdate: nextUpdate.locale(I18n.locale).format('D MMM YYYY')
				}));
			}

			if (updateDatesSectionParts.length) {
				var $extraInfo = App.Helpers.getResourceExtraInfoSection();
				if ($extraInfo.length) {
					var $dates = $extraInfo.children('.visualizer-resource-dates');
					if (!$dates.length) {
						$dates = $('<span class="visualizer-resource-dates"></span>').appendTo($extraInfo);
					}
					$dates.html(updateDatesSectionParts.join(' | '));
				}
			}
		},

		getResourceExtraInfoSection: function () {
			var $headerInfo = $('.visualizer-header-info');
			if (!$headerInfo.length) {
				return $();
			}
			var $extraInfo = $headerInfo.find('.visualizer-resource-extra-info');
			if (!$extraInfo.length) {
				$extraInfo = $('<div class="visualizer-resource-extra-info"></div>').appendTo($headerInfo);
			}
			return $extraInfo;
		}
	};
}(DOMPurify, moment));
