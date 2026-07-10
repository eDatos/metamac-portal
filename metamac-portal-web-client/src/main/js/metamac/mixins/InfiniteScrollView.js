(function () {
    "use strict";

    App.namespace("App.mixins.InfiniteScrollView");

    App.mixins.InfiniteScrollView = {
        template : App.templateManager.get("search/search-infinitescroll"),

        initializeInfiniteScroll : function ($container) {
            var self = this;
            self.$infiniteScrollContainer = $container;
            self.hasMore = false;
            self.$infiniteScrollContainer.on('click', function () {
                self.loadMore();
            });

            _.bindAll(this, "scroll", "isNearBottom");
            $(window).smartscroll(this.scroll);

            self.isDuringAjax = false;
        },

        render : function (state) {
            if (this.$infiniteScrollContainer) {
                this.$infiniteScrollContainer.html(this.template(state));
            }
        },

        fetchStart : function () {
            this.isDuringAjax = true;
            this.render({loading : true});
        },

        fetchEnd : function (collection) {
            this.isDuringAjax = false;
            this.hasMore = collection.hasMorePages();

            if (this.hasMore) {
                this.render({loadMore : true});
            } else {
                this.render({noMore : true});
            }
        },

        loadMore : function () {
            if (this.hasMore) {
                this.trigger('infiniteScroll:loadMore');
            }
        },

        scroll : function () {
            if (this.isDuringAjax) {
                return;
            }

            if (this.isNearBottom()) {
                this.loadMore();
            }
        },

        isNearBottom : function () {
            var $window = $(window);
            var windowScroll = $window.scrollTop();
            var windowHeight = $window.height();

            var button = this.$infiniteScrollContainer;
            var buttonPosition = button.offset().top + button.height() - 1;

            var pixelsFromWindowBottomToBottom = 0 + buttonPosition - windowScroll - windowHeight;

            return pixelsFromWindowBottomToBottom < 0;
        }
    }

}());
