(function () {
    "use strict";

    App.namespace("App.Select2Utils");

    App.Select2Utils = {

        onOpen: function ($select, dropdownClass) {
            setTimeout(function () {
                const $dropdown = $('.select2-dropdown');
                if (dropdownClass) {
                    $dropdown.addClass(dropdownClass);
                }

                const selectionEl = $select.data('select2').$container.find('.selection')[0];
                $dropdown.css('width', selectionEl.getBoundingClientRect().width);

                const observer = new ResizeObserver(function () {
                    $dropdown.css('width', selectionEl.getBoundingClientRect().width);
                });
                observer.observe(selectionEl);

                const $results = $dropdown.find('.select2-results__options');
                $results.perfectScrollbar();
                $select.one('select2:closing', function () {
                    observer.disconnect();
                    $results.perfectScrollbar('destroy');
                });
            });
        }

    };
}());
