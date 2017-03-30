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
    this.init_tooltips();
};
UbiWebLibBase.prototype.init_aside = function () {
    var obj = this;
    $(".js-toogle-menu").click(function () {
        var $this = $(this);
        var menu_id = $this.attr("data-menu-id");
        if (!menu_id)
            return;
        var $menu = $("#" + menu_id);
        if (!$menu.length)
            return;
        var $icon = $(".fa", $this);
        var $text = $(".text", $this);
        if ($menu.hasClass("hidden")) {
            $menu.removeClass("hidden").addClass("fadeInLeft");
            if ($icon.length) {
                $icon.removeClass("fa-bars").addClass("fa-close");
            }
            if ($text.length) {
                $text.text(obj.translate("Close"));
            }
            $this.attr("title", obj.translate("Close menu"));
        } else {
            $menu.addClass("hidden").removeClass("fadeInLeft");
            if ($icon.length) {
                $icon.removeClass("fa-close").addClass("fa-bars");
            }
            if ($text.length) {
                $text.text(obj.translate("Menu"));
            }
            $this.attr("title", obj.translate("Open menu"));
        }
    });
    $(".js-active").each(function () {
        var $parent = $(this);
        $(".js-active-item .js-active-toogle", $parent).click(function () {
            obj.click_js_active($(this), $parent);
        });
    });
    $(".js-display").click(function (event) {
        event.stopPropagation();
        var id = $(this).attr("data-display-id");
        if (!id || !$("#" + id).length)
            return;
        obj.toggle_dropdown(this, id);
    });
    $(window).click(function () {
        obj.hide_all_dropdowns();
    });
    $(".dropdown").click(function(event) { event.stopPropagation(); });
};
UbiWebLibBase.prototype.hide_all_dropdowns = function () {
    $(".dropdown").each(function () {
        $(this).removeClass("active");
        $(this).removeClass($(this).attr("data-effect"));
    });
    $(".js-display").each(function () {
        var $icon = $(".fa", $(this));
        if ($icon.length > 0) {
            $icon.removeClass($(this).attr("data-icon-effect"));
        }
    });
};
UbiWebLibBase.prototype.toggle_dropdown = function (button, id) {
    if (!$("#" + id).hasClass("active")) {
        this.hide_all_dropdowns();
    }
    var $icon = $(".fa", $(button));
    if ($icon.length > 0) {
        var effect = $(button).attr("data-icon-effect");
        if ($icon.hasClass(effect)) {
            $icon.removeClass(effect);
        } else {
            $icon.addClass(effect);
        }
    }
    if ($("#" + id).hasClass("active")) {
        $("#" + id).removeClass("active");
    } else {
        $("#" + id).addClass("active").addClass($("#" + id).attr("data-effect"));
    }
};
UbiWebLibBase.prototype.click_js_active = function ($this, $parent) {
    var $thisItem = $this.parent();
    var $icon = $(".fa", $this);
    if ($thisItem.hasClass("active")) {
        $thisItem.removeClass("active");
        if ($icon.length) {
            $icon.removeClass("fa-rotate-90");
        }
    } else {
        $(".js-active-item", $parent).removeClass("active");
        $(".js-active-item .js-active-toogle .fa", $parent).removeClass("fa-rotate-90");
        $thisItem.addClass("active");
        if ($icon.length) {
            $icon.addClass("fa-rotate-90");
        }
    }
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
            var $item = $(this).detach();
            $nav_links.append($item.addClass("animated fadeInRight").one(obj.animation_end_event, function () {
                $(this).removeClass("animated fadeInRight");
            }));
        });
        $nav_links.append($next_button.detach());
        $next_button.removeClass("hidden");
        $prev_button.removeClass("hidden");
        var menu_width = $nav_links.width() - $next_button.outerWidth() - $prev_button.outerWidth();
        $("li", $nav_links).each(function () {
            total_width += $(this).outerWidth();
            if (total_width >= menu_width) {
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
            prev_menu.push($(this).detach());
        });
        prev_menus_hidden.push(prev_menu);
        resize_check();
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
UbiWebLibBase.prototype.init_tooltips = function () {
    $(".tooltip").each(function () {
        if (!$(this).attr("data-tooltip-content")) {
            return;
        }
        $(this).click(function (event) {
            event.stopPropagation();
            var text = $(this).attr("data-tooltip-content");
            var box = $("#tooltip_content");
            if (!box.length)
                box = $("<span class=\"tooltip-content\" id=\"tooltip_content\"></span>");
            box.text(text);
            box.css({
                "position": "absolute",
                "left": event.pageX + "px",
                "top": event.pageY + "px"
            });
            $("body").append(box);
        });
    });
    $(document).click(function (event) {
        var box = $("#tooltip_content");
        if (box.length && event.target != box[0])
            box.remove();
    });
};
