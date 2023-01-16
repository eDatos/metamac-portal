<%@ page pageEncoding="UTF-8" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib prefix="t" tagdir="/WEB-INF/tags" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<c:set var="requestURL">${pageContext.request.requestURL}</c:set>
<c:set var="baseURL">${fn:replace(requestURL, pageContext.request.requestURI, pageContext.request.contextPath)}</c:set>

<script src="${baseURL}/client/metamac.js?d=${jsDate}"></script>
<link rel="stylesheet" type="text/css" href="${baseURL}/client/metamac.css?d=${cssDate}">

<t:metamac_plantilla_1col baseURL="${baseURL}">
<script>
    var baseURL = "${baseURL}";
    var statisticalResourcesApi = "${ApiUrlStatisticalResources}/v1.0";
    var locale = "${currentLocale}";
</script>
<script>
    function parseCollectionsIntoOperationsTree(collections) {
        return _.chain(collections)
            .groupBy((collection) => collection.statisticalOperation.id)
            .map((operation) => { 
                if (!(operation[0] && operation[0].statisticalOperation)) {
                    console.error("No statistical operation for collection. This simply can´t happen");
                    return null;
                }
                return { "statisticalOperation": operation[0].statisticalOperation, "collections": operation }; 
            })
            .filter((operation) => !!operation)
            .value();
    }
    
    function getText(internationalString) {
        var translatedText = _.findWhere(internationalString.text, {lang: locale});
        if (typeof translatedText !== "undefined") {
            return translatedText.value;
        }
        return internationalString.text[0].value;
    }
    
    function buildCollectionUrl(collectionUrn) {
        // Sample: /visualizer/collection.html?resourceType=collection&agencyId=BCE&resourceId=E30260A_000001
        return baseURL + '/visualizer/collection.html?resourceType=collection' + urnStructureToParams(splitUrnStructure(collectionUrn));
    }
    
    function splitUrnStructure(urn) {
        return splitUrnWithoutPrefixStructure(removePrefix(urn));
    }
    
    function urnStructureToParams(urnStructure) {
        return '&agencyId=' + urnStructure.agencyId + '&resourceId=' + urnStructure.resourceId + (urnStructure.version ? '&version=' + urnStructure.version : '');
    }
    
    function splitUrnWithoutPrefixStructure(tripletIdentifier) {
        var agencyId = tripletIdentifier.substring(0, tripletIdentifier.indexOf(":"));
        var hasVersion = tripletIdentifier.indexOf("(") != -1;
        var resourceId = tripletIdentifier.substring(tripletIdentifier.indexOf(":") + 1, hasVersion ? tripletIdentifier.indexOf("(") : tripletIdentifier.length);
        // if no match, version will be empty string
        var version = tripletIdentifier.substring(tripletIdentifier.indexOf("(") + 1, tripletIdentifier.indexOf(")"));
        return {
            "agencyId": agencyId,
            "resourceId": resourceId,
            "version": version
        }
    }
    
    function removePrefix(urn) {
        var parts = urn.split("=");
        if (parts.length != 2) {
            console.error("URN does not have a valid format", urn);
            return null;
        }
        return parts[1];
    }
    
    function buildOperationsList(operations) {
        if (!operations.length) { return null;}        
        var operationsList = document.createElement('ul');
        operationsList.classList.add('capitulos', 'deep-tree');
        operations.forEach(operation => {
            var listItem = document.createElement('li');
            listItem.classList.add('dimension','dimension-depth-1', 'closed');
            listItem.innerHTML = '<a href="#" class="tree-icon"></a><span class="dimension-title">'+ getText(operation.statisticalOperation.name) + '</span>';
            listItem.append(buildCollectionsList(operation.collections));
            operationsList.append(listItem);
        });
        return operationsList;        
    }
    
    function buildCollectionsList(collections) {
        if (!collections.length) { return null;}
        var collectionList = document.createElement('ul');
        collectionList.classList.add('capitulos');
        collections.forEach(collection => {
            var listItem = document.createElement('li');
            var link = document.createElement('a');
            link.append(getText(collection.name));
            link.setAttribute('href',buildCollectionUrl(collection.urn));
            listItem.append(link);
            collectionList.append(listItem);
        });
        return collectionList;
    }
    
    fetch(statisticalResourcesApi + '/collections.json?fields=+statisticalOperation&limit=10000')
        .then(response => response.json())
        .then(data => {
            var operations = parseCollectionsIntoOperationsTree(data.collection);
            var operationsElement = document.getElementById("operations");
            operationsElement.innerHTML = null;
            operationsElement.append(buildOperationsList(operations));

            // Tree behaviour
            $(".tree-icon").click(function (e) {
                e.preventDefault();
                var $icon = $(this);
                var $parentDimension = $icon.closest(".dimension-depth-1");
                $parentDimension.toggleClass("open");
                $parentDimension.toggleClass("close");
            });
        });
</script>
<div id="operations" class="contenido"><div class="loader">Cargando...</div></div>
</t:metamac_plantilla_1col>