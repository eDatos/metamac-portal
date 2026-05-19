(function () {
    "use strict";

    App.namespace("App.Select2Utils");

    App.Select2Utils = {

        onOpen: function ($select, dropdownClass, alignRight) {
            setTimeout(function () {
                const $dropdown = $('.select2-dropdown');
                if (dropdownClass) {
                    $dropdown.addClass(dropdownClass);
                }

                $dropdown.css('width', 'auto');
                const dropdownWidth = $dropdown[0].getBoundingClientRect().width;
                const selectionWidth = $select.data('select2').$container.find('.selection')[0].getBoundingClientRect().width;

                $dropdown.css('min-width', selectionWidth);
                if (dropdownWidth > selectionWidth) {
                    $dropdown.addClass('select2-dropdown--wider-than-trigger');

                    if (alignRight) {
                        $dropdown.addClass('select2-dropdown--align-right');
                        $dropdown.css('transform', `translateX(-${dropdownWidth - selectionWidth}px)`);
                    }
                }

                const $results = $dropdown.find('.select2-results__options');
                $results.perfectScrollbar();
                $select.one('select2:closing', function () {
                    $results.perfectScrollbar('destroy');
                });
            });
        }

    };
}());
