/*******************************************
* UbiWebLibBase - Base js lib              *
* Copyright: UbiCast, all rights reserved  *
* Author: Stéphane Schoorens               *
*******************************************/
/* globals utils */
"use strict";

function UbiWebLibBase (options) {

    utils.setup_class(this, options);
    this.animation_end_event = "webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend";
    var obj = this;
    $(document).ready(function () {
        obj.init();
    });
}
UbiWebLibBase.prototype.init = function () {
    this.init_footer();
    this.init_aside();
    this.init_nav();
    this.init_tooltips();
    this.init_messages();
    this.init_aria();
};
UbiWebLibBase.prototype.init_aria = function () {
    $(".aria-describedby-input input, .aria-describedby-input textarea, .aria-describedby-input select").each(function () {
        var describedby = $(this).attr("aria-describedby");
        if (describedby) {
            describedby = describedby.split(" ");
        } else {
            describedby = [];
        }
        if ($("#" + $(this).attr("id") + "_help").length) {
            describedby.push($(this).attr("id") + "_help");
        }
        if ($("#" + $(this).attr("id") + "_format").length) {
            describedby.push($(this).attr("id") + "_format");
        }
        if ($("#" + $(this).attr("id") + "_errors").length) {
            $(this).attr("aria-invalid", "true");
            describedby.push($(this).attr("id") + "_errors");
        }
        $(this).attr("aria-describedby", describedby.join(" "));
    });
    $("input, textarea, select").each(function () {
        if ($(this).attr("required")) {
            $(this).attr("aria-required", "true");
        }
    });
    $(document).click(function () {
        $("html").removeClass("keyboard-navigation");
    });
    $(document).keydown(function (event) {
        var keyCode = event.keyCode || event.which; 
        if (keyCode == 9) {
            $("html").addClass("keyboard-navigation");
        }
    });
};
UbiWebLibBase.prototype.init_footer = function () {
    if ($("#footer").length < 1)
        return;
    // change body padding depending on footer height
    var set_body_padding = function () {
        var height = $("#footer").outerHeight();
        if (height && height > 30)
            $("body").css("padding-bottom", parseInt(height + 40, 10) + "px");
    };
    set_body_padding();
    $(window).resize(set_body_padding);
};
UbiWebLibBase.prototype.init_messages = function () {
    var obj = this;
    var hide_msg = function () {
        $("#messages_place").hide(250, function () {
            $("#message_box_button").removeClass("hidden");
            $(".message-box-count").html("(" + $(".message", this).length + ")");
        });
    };
    if ($("#messages_place .message").length) {
        setTimeout(hide_msg, 7000);
    }
    $("#message_box_button").click(function () {
        $("#messages_place").show();
        obj.hide_all_dropdowns();
    });
    $(document).click(function (event) {
        if ($("#messages_place .message").length) {
            var hide = true;
            $("#messages_place .message").each(function () {
                if (event.target === this) {
                    hide = false;
                }
            });
            if (hide) {
                hide_msg();
            }
        }
    });
};
UbiWebLibBase.prototype.init_aside = function () {
    var obj = this;
    $(".js-toogle-menu").click(function (event) {
        event.stopPropagation();
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
            obj.hide_menu(this);
        }
    });
    $(".js-active").each(function () {
        var $parent = $(this);
        $(".js-active-toogle", $parent).click(function (event) {
            event.stopPropagation();
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
    $(document).click(function (event) {
        obj.hide_all_dropdowns();
        $(".js-toogle-menu").each(function () {
            var menu = $("#" + $(this).attr("data-menu-id"));
            if (menu.length && event.target != menu[0])
                obj.hide_menu(this);
        });
    });
    $(".dropdown").click(function (event) {
        event.stopPropagation();
        var box = $("#tooltip_content");
        if (box.length && event.target != box[0])
            box.remove();
    });
};
UbiWebLibBase.prototype.hide_menu = function (menu_btn) {
    var $this = $(menu_btn);
    var menu_id = $this.attr("data-menu-id");
    if (!menu_id)
        return;
    var $menu = $("#" + menu_id);
    if (!$menu.length)
        return;
    var $icon = $(".fa", $this);
    var $text = $(".text", $this);
    $menu.addClass("hidden").removeClass("fadeInLeft");
    if ($icon.length) {
        $icon.removeClass("fa-close").addClass("fa-bars");
    }
    if ($text.length) {
        $text.text(this.translate("Menu"));
    }
    $this.attr("title", this.translate("Open menu"));
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
    if ($(button).attr("aria-expanded") == 'false') {
        $(button).attr("aria-expanded", true);
    } else {
        $(button).attr("aria-expanded", false);
    }
    if ($("#" + id).hasClass("active")) {
        $("#" + id).removeClass("active");
    } else {
        $("#" + id).addClass("active").addClass($("#" + id).attr("data-effect"));
    }
};
UbiWebLibBase.prototype.click_js_active = function ($this, $parent) {
    var $thisItem = $(".js-active-item", $this).first();
    var $icon = $(".fa", $this).first();
    var $btn = $("[aria-expanded]", $this).first();
    if ($btn) {
        if ($btn.attr("aria-expanded") == 'false') {
            $btn.attr("aria-expanded", true);
        } else {
            $btn.attr("aria-expanded", false);
        }
    }
    if ($thisItem.hasClass("active")) {
        $thisItem.removeClass("active");
        if ($icon.length) {
            $icon.removeClass("fa-rotate-90");
        }
    } else {
        $(".js-active-item", $parent).removeClass("active");
        $(".js-active-toogle .fa", $parent).removeClass("fa-rotate-90");
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
        $next_button.addClass("not-visible");
        $("li:not(.button-nav)", $next_menu).each(function () {
            var $item = $(this).detach();
            $nav_links.append($item.addClass("animated fadeInRight").one(obj.animation_end_event, function () {
                $(this).removeClass("animated fadeInRight");
            }));
        });
        $nav_links.append($next_button.detach());
        $next_button.removeClass("not-visible");
        $prev_button.removeClass("not-visible");
        var menu_width = $nav_links.width() - $next_button.outerWidth() - $prev_button.outerWidth();
        $("li:not(.button-nav)", $nav_links).each(function () {
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
            $next_button.removeClass("not-visible");
        } else {
            for (var index = 0; index < hide_array.length; index++) {
                var item = hide_array[index];
                $nav_links.append(item);
            }
            $next_button.addClass("not-visible");
        }
        if (prev_menus_hidden.length > 0) {
            $prev_button.removeClass("not-visible");
        } else {
            $prev_button.addClass("not-visible");
        }
    };
    var go_to_current_menu = function () {
        var prev_menu = [];
        var total_width = 0;
        var menu_width = $nav_links.width() - $next_button.outerWidth() - $prev_button.outerWidth();
        $("li:not(.button-nav)", $nav_links).each(function () { total_width += $(this).outerWidth(); });
        $("li:not(.button-nav)", $nav_links).each(function () {
            var link = $("a", $(this)).attr("href");
            if (window.location.pathname == link) {
                return false;
            }
            if (total_width > menu_width) {
                total_width -= $(this).outerWidth();
                prev_menu.push($(this).detach());
            }
        });
        if (prev_menu.length) {
            prev_menus_hidden.push(prev_menu);
        }
    };
    go_to_current_menu();
    resize_check();
    $(window).resize(resize_check);

    $next_button.click(function () {
        var prev_menu = [];
        $("li:not(.button-nav)", $nav_links).each(function () {
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
            $prev_button.after(item.addClass("animated fadeInLeft").one(obj.animation_end_event, function () {
                $(this).removeClass("animated fadeInLeft");
            }));
        }
        resize_check();
    });
};
UbiWebLibBase.prototype.init_tooltips = function () {
    var obj = this;
    $(".tooltip-button").each(function () {
        if ($(".tooltip-hidden-content", this).length < 1 && !$(this).attr("title")) {
            return;
        }
        $(this).click(obj.tooltip_click);
    });
    $(document).click(function (event) {
        var box = $(".tooltip-content");
        if (box.length && event.target != box[0])
            box.removeClass("tooltip-content").addClass("tooltip-hidden-content");
    });
    $(document).keydown(function (event) {
        var keyCode = event.keyCode || event.which; 
        if (keyCode == 27 && $(".tooltip-content").length) {
            $(".tooltip-content").removeClass("tooltip-content").addClass("tooltip-hidden-content");
            event.stopPropagation();
        }
    });
};
UbiWebLibBase.prototype.tooltip_click = function (event) {
    event.stopPropagation();
    if ($(".tooltip-content", this).length > 0) {
        if (event.target != $(".tooltip-content", this)[0]) {
            $(".tooltip-content", this).removeClass("tooltip-content").addClass("tooltip-hidden-content");
        }
        return;
    }
    $(".tooltip-content").removeClass("tooltip-content").addClass("tooltip-hidden-content");
    if ($(".tooltip-hidden-content", this).length > 0) {
        $(".tooltip-hidden-content", this).removeClass("tooltip-hidden-content").addClass("tooltip-content");
    } else {
        var html = utils.escape_html($(this).attr("title"));
        var box = $("<span class=\"tooltip-content\" id=\"tooltip_content\"></span>");
        box.html(html);
        $(this).append(box);
    }
};
UbiWebLibBase.prototype.generate_tooltip_button = function (id, text, button_text) {
    var html = "<button type=\"button\" class=\"tooltip-button no-padding no-border no-background\" aria-describedby=\"" + id + "\" aria-label=\"" + utils.translate('help') + "\">";
    if (button_text) {
        html += button_text;
    }
    html +=     "<i class=\"fa fa-question-circle fa-fw\" aria-hidden=\"true\"></i>";
    html +=     "<span role=\"tooltip\" class=\"tooltip-hidden-content\" id=\"" + id + "\">" + text + "</span>";
    html += "</button>";
    return html;
};