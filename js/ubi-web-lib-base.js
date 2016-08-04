/*******************************************
* UbiWebLibBase - Base js lib              *
* Copyright: UbiCast, all rights reserved  *
* Author: Stéphane Schoorens               *
*******************************************/
/* globals utils */
function UbiWebLibBase (options) {
    
    utils.setup_class(this, options);
    this.animation_end_event = "webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend";
    var obj = this;
    $(document).ready(function () {
        obj.init();
    });
}
UbiWebLibBase.prototype.init = function () {
    this.init_aside();
    this.init_nav();
};
UbiWebLibBase.prototype.init_aside = function () {
    $(".js-toogle-menu").click(function () {
        var $this = $(this);
        var menu_id = $this.attr("data-menu-id");
        if (!menu_id)
            return;
        var $menu = $("#" + menu_id);
        if (!$menu.length)
            return;
        var $icon = $(".fa", $this);
        if ($menu.hasClass("hidden")) {
            $menu.removeClass("hidden").addClass("fadeInLeft");
            if ($icon.length) {
                $icon.addClass("fa-rotate-90");
            }
        } else {
            $menu.addClass("hidden").removeClass("fadeInLeft");
            if ($icon.length) {
                $icon.removeClass("fa-rotate-90");
            }
        }
    });
    $(".js-active").each(function () {
        var $this = $(this);
        $(".js-active-item .js-active-toogle", $this).click(function () {
            var $thisItem = $(this).parent();
            var $icon = $(".fa", $thisItem);
            if ($thisItem.hasClass("active")) {
                $thisItem.removeClass("active");
                if ($icon.length) {
                    $icon.removeClass("fa-rotate-90");
                }
            } else {
                $(".js-active-item", $this).removeClass("active");
                $(".js-active-item .js-active-toogle .fa", $this).removeClass("fa-rotate-90");
                $thisItem.addClass("active");
                if ($icon.length) {
                    $icon.addClass("fa-rotate-90");
                }
            }
        });
    });
};
UbiWebLibBase.prototype.init_nav = function () {
    var obj = this;
    var $nav_links = $(".navbar .links");
    var $next_menu = $(".navbar .next-menu");
    var $next_button = $(".next", $nav_links);
    var $prev_button = $(".prev", $nav_links);
    var prev_menus_hidden = [];
    var resize_check = function () {
        var total_width = 0;
        var hide_array = [];
        $next_button.addClass("hidden");
        $("li", $next_menu).each(function () {
            $nav_links.append($(this).detach());
        });
        $nav_links.append($next_button.detach());
        var menu_width = $nav_links.width() - $next_button.outerWidth() - $prev_button.outerWidth() - 30;
        $("li", $nav_links).each(function () {
            total_width += $(this).outerWidth();
            if (total_width > menu_width) {
                hide_array.push($(this).detach());
            }
        });
        if (hide_array.length > 0) {
            for (var index = 0; index < hide_array.length; index++) {
                var item = hide_array[index];
                $next_menu.append(item);
            }
            $next_button.removeClass("hidden");
        } else {
            for (var index = 0; index < hide_array.length; index++) {
                var item = hide_array[index];
                $nav_links.append(item);
            }
            $next_button.addClass("hidden");
        }
        if (prev_menus_hidden.length > 0) {
            $prev_button.removeClass("hidden");
        } else {
            $prev_button.addClass("hidden");
        }
    };
    resize_check();
    $(window).resize(resize_check);

    $next_button.click(function () {
        var prev_menu = [];
        var i = 0;
        var nb_menu = $("li", $nav_links).length;
        var ready = true;
        $("li", $nav_links).each(function () {
            prev_menu.push($(this));
            $(this).addClass("animated fadeOutLeft").one(obj.animation_end_event, function () {
                ready = false;
                i++;
                $(this).removeClass("animated fadeOutLeft");
                $(this).detach();
                if (i == nb_menu) {
                    prev_menus_hidden.push(prev_menu);
                    resize_check();
                }
                ready = true;
            });
        });
    });
    $prev_button.click(function () {
        if (!prev_menus_hidden.length)
            return;
        var prev_menu = prev_menus_hidden.pop();
        for (var index = (prev_menu.length - 1); index >= 0; index--) {
            var item = prev_menu[index];
            $nav_links.prepend(item.addClass("animated fadeInLeft").one(obj.animation_end_event, function () {
                $(this).removeClass("animated fadeInLeft");
            }));
        }
        resize_check();
    });
};