// Test version of metamac-portal\metamac-portal-web\src\main\webapp\js\widget.jsp

function getWidgetUrl(options) {
	var endpoint = 'widget/widget.html';
	//var endpoint = "${baseURL}/widget.html";
	endpoint += options.sharedVisualizerUrl ? 'sharedVisualizerUrl=' + options.sharedVisualizerUrl + '&' : '';
	endpoint += options.locale ? 'locale=' + options.locale + '&' : '';
	endpoint += options.title ? 'title=' + encodeURIComponent(JSON.stringify(options.title)) + '&' : '';
	return endpoint + options.params;
}


function appendIframe(options) {
	var src = getWidgetUrl(options);
	var width = options.width || '100%';
	var height = options.height || '100%';

	var iframe = '<iframe id="' + options.id + '-iframe" allowfullscreen="" ';
	iframe += 'src="' + src + '"';
	iframe += 'width="' + width + '" height="' + height + '" frameborder="0"></iframe>';

	document.getElementById(options.id).innerHTML = iframe;
}

function datasetWidget(options) {
	appendIframe(options);
}