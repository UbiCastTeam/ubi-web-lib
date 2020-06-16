/*******************************************
* UbiWebLibBase - Base js lib              *
* Copyright: UbiCast, all rights reserved  *
* Author: Stéphane Schoorens               *
*******************************************/
/* globals utils */

function UbiWebLibBase (options) {

    utils.setup_class(this, options);
    this.animation_end_event = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
    var obj = this;
    $(document).ready(function () {
        obj.init();
    });
}
UbiWebLibBase.prototype.init = function () {
    this.init_footer();
    this.init_aside();
    this.init_nav();
    this.init_dropdowns();
    this.init_tooltips();
    this.init_aria();
};
UbiWebLibBase.prototype.init_aria = function () {
    $('.aria-describedby-input input, .aria-describedby-input textarea, .aria-describedby-input select').each(function () {
        var describedby = $(this).attr('aria-describedby');
        if (describedby) {
            describedby = describedby.split(' ');
        } else {
            describedby = [];
        }
        if ($('#' + $(this).attr('id') + '_help').length) {
            describedby.push($(this).attr('id') + '_help');
        }
        if ($('#' + $(this).attr('id') + '_format').length) {
            describedby.push($(this).attr('id') + '_format');
        }
        if ($('#' + $(this).attr('id') + '_errors').length) {
            $(this).attr('aria-invalid', 'true');
            describedby.push($(this).attr('id') + '_errors');
        }
        if (describedby.length > 0) {
            $(this).attr('aria-describedby', describedby.join(' '));
        }
    });
    var errorField = $('.aria-focus-error').first();
    if (errorField.length) {
        utils.focus_first_descendant($(".input-place", errorField)[0]);
    } else {
        $("#messages_place .message").first().focus();
    }
    $('input, textarea, select').each(function () {
        if ($(this).attr('required')) {
            $(this).attr('aria-required', 'true');
        }
    });
    $('a').each(function () {
        if ($(this).attr('target') == '_blank') {
            var title = utils.translate('Open in a new window');
            if ($(this).text().trim()) {
                var text;
                if ($(this).attr('title')) {
                    text = $(this).attr('title');
                } else {
                    text = $(this).text();
                }
                title = utils.strip(text) + ' (' + utils.translate('new window') + ')';
            }
            $(this).attr('title', title);
        }
    });
    $(document).click(function () {
        $('html').removeClass('keyboard-navigation');
    });
    $(document).keydown(function (event) {
        var keyCode = event.keyCode || event.which; 
        if (keyCode == 9) {
            $('html').addClass('keyboard-navigation');
        }
    });
};
UbiWebLibBase.prototype.init_footer = function () {
    if ($('#footer').length < 1)
        return;
    // change body padding depending on footer height
    var set_body_padding = function () {
        var height = $('#footer').outerHeight();
        if (height && height > 30)
            $('body').css('padding-bottom', parseInt(height + 40, 10) + 'px');
    };
    set_body_padding();
    $(window).resize(set_body_padding);
};
UbiWebLibBase.prototype.init_aside = function () {
    var obj = this;
    $('.js-toogle-menu').click(function (event) {
        event.stopPropagation();
        var $this = $(this);
        var menu_id = $this.attr('data-menu-id');
        if (!menu_id)
            return;
        var $menu = $('#' + menu_id);
        if (!$menu.length)
            return;
        var $icon = $('.fa', $this);
        var $text = $('.text', $this);
        if ($menu.hasClass('hidden')) {
            $menu.removeClass('hidden').addClass('fadeInLeft');
            if ($icon.length) {
                $icon.removeClass('fa-bars').addClass('fa-close');
            }
            if ($text.length) {
                $text.text(obj.translate('Close'));
            }
            $this.attr('title', obj.translate('Close menu'));
        } else {
            obj.hide_menu(this);
        }
    });
    $('.js-active').each(function () {
        var $parent = $(this);
        $('.js-active-toogle', $parent).click(function (event) {
            event.stopPropagation();
            obj.click_js_active($(this), $parent);
        });
    });
    $(document).click(function (event) {
        var node = event.target;
        while (node && node.className !== undefined) {
            if (node.className.indexOf('js-active') != -1)
                return;
            node = node.parentNode;
        }
        $('.js-toogle-menu').each(function () {
            var menu = $('#' + $(this).attr('data-menu-id'));
            if (menu.length && event.target != menu[0])
                obj.hide_menu(this);
        });
    });
};
UbiWebLibBase.prototype.init_dropdowns = function () {
    var obj = this;
    $(document).click(function (event) {
        var node = event.target;
        while (node && node.className !== undefined) {
            if (node.className.indexOf('dropdown-button') != -1) {
                var id = node.getAttribute('data-dropdown-id');
                if (id)
                    obj.toggle_dropdown(this, id);
                return;
            }
            if (node.className.indexOf('dropdown') != -1) {
                return;
            }
            node = node.parentNode;
        }
        obj.hide_all_dropdowns();
    });
};
UbiWebLibBase.prototype.hide_menu = function (menu_btn) {
    var $this = $(menu_btn);
    var menu_id = $this.attr('data-menu-id');
    if (!menu_id)
        return;
    var $menu = $('#' + menu_id);
    if (!$menu.length)
        return;
    var $icon = $('.fa', $this);
    var $text = $('.text', $this);
    $menu.addClass('hidden').removeClass('fadeInLeft');
    if ($icon.length) {
        $icon.removeClass('fa-close').addClass('fa-bars');
    }
    if ($text.length) {
        $text.text(this.translate('Menu'));
    }
    $this.attr('title', this.translate('Open menu'));
};
UbiWebLibBase.prototype.hide_all_dropdowns = function () {
    $('.dropdown.active').each(function () {
        $(this).removeClass('active');
        $(this).removeClass($(this).attr('data-effect'));
    });
    $('.dropdown-button').each(function () {
        $(this).attr('aria-expanded', false);
        var $icon = $('.fa', $(this));
        if ($icon.length > 0) {
            $icon.removeClass($(this).attr('data-icon-effect'));
        }
    });
};
UbiWebLibBase.prototype.toggle_dropdown = function (button, id) {
    if (!$('#' + id).hasClass('active')) {
        this.hide_all_dropdowns();
    }
    var $icon = $('.fa', $(button));
    if ($icon.length > 0) {
        var effect = $(button).attr('data-icon-effect');
        if ($icon.hasClass(effect)) {
            $icon.removeClass(effect);
        } else {
            $icon.addClass(effect);
        }
    }
    if ($(button).attr('aria-expanded') == 'false') {
        $(button).attr('aria-expanded', true);
    } else {
        $(button).attr('aria-expanded', false);
    }
    if ($('#' + id).hasClass('active')) {
        $('#' + id).removeClass('active');
    } else {
        $('#' + id).addClass('active').addClass($('#' + id).attr('data-effect'));
    }
};
UbiWebLibBase.prototype.click_js_active = function ($this, $parent) {
    var $thisItem = $('.js-active-item', $this).first();
    var $icon = $('.fa', $this).first();
    var $btn = $('[aria-expanded]', $this).first();
    if ($thisItem.hasClass('active')) {
        $thisItem.removeClass('active');
        $btn.attr('aria-expanded', false);
        if ($icon.length) {
            $icon.removeClass('fa-rotate-90');
        }
    } else {
        $('.js-active-item', $parent).removeClass('active');
        $('.js-active-toogle .fa', $parent).removeClass('fa-rotate-90');
        $('.js-active-toogle [aria-expanded]', $parent).attr('aria-expanded', false);
        $thisItem.addClass('active');
        $btn.attr('aria-expanded', true);
        if ($icon.length) {
            $icon.addClass('fa-rotate-90');
        }
    }
};
UbiWebLibBase.prototype.init_nav = function () {
    var obj = this;
    var $nav_links = $('.navbar .links');
    var $next_menu = $('.navbar .next-menu');
    var $next_button = $('.next', $nav_links);
    var $prev_button = $('.prev', $nav_links);
    var prev_menus_hidden = [];
    var resize_check = function () {
        var total_width = 0;
        var hide_array = [];
        $next_button.addClass('not-visible');
        $('li:not(.button-nav)', $next_menu).each(function () {
            var $item = $(this).detach();
            $nav_links.append($item.addClass('animated fadeInRight').one(obj.animation_end_event, function () {
                $(this).removeClass('animated fadeInRight');
            }));
        });
        $nav_links.append($next_button.detach());
        $next_button.removeClass('not-visible');
        $prev_button.removeClass('not-visible');
        var menu_width = $nav_links.width() - $next_button.outerWidth() - $prev_button.outerWidth();
        $('li:not(.button-nav)', $nav_links).each(function () {
            total_width += $(this).outerWidth();
            if (total_width >= menu_width) {
                hide_array.push($(this).detach());
            }
        });
        var index, item;
        if (hide_array.length > 0) {
            for (index = 0; index < hide_array.length; index++) {
                item = hide_array[index];
                $next_menu.append(item);
            }
            $next_button.removeClass('not-visible');
        } else {
            for (index = 0; index < hide_array.length; index++) {
                item = hide_array[index];
                $nav_links.append(item);
            }
            $next_button.addClass('not-visible');
        }
        if (prev_menus_hidden.length > 0) {
            $prev_button.removeClass('not-visible');
        } else {
            $prev_button.addClass('not-visible');
        }
    };
    var go_to_current_menu = function () {
        var prev_menu = [];
        var total_width = 0;
        var menu_width = $nav_links.width() - $next_button.outerWidth() - $prev_button.outerWidth();
        $('li:not(.button-nav)', $nav_links).each(function () { total_width += $(this).outerWidth(); });
        $('li:not(.button-nav)', $nav_links).each(function () {
            var link = $('a', $(this)).attr('href');
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
        $('li:not(.button-nav)', $nav_links).each(function () {
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
            $prev_button.after(item.addClass('animated fadeInLeft').one(obj.animation_end_event, function () {
                $(this).removeClass('animated fadeInLeft');
            }));
        }
        resize_check();
    });
};
UbiWebLibBase.prototype.init_tooltips = function () {
    var on_tooltip_click = function (event, button) {
        event.stopPropagation();

        var tooltip_id = button.getAttribute('aria-describedby');
        if (tooltip_id) {
            tooltip_id += '_tooltip';
        }
        if (tooltip_id && $('#' + tooltip_id).length > 0) {
            $('#' + tooltip_id).remove();
            return;
        }
        if ($('.tooltip-overlay').length) {
            $('.tooltip-overlay').remove();
        }

        var content;
        if ($('.tooltip-hidden-content', button).length > 0) {
            content = $('.tooltip-hidden-content', button).html();
        } else if ($(button).attr('title')) {
            content = utils.escape_html($(button).attr('title'));
        }
        if (!content)
            return;

        var rect = button.getBoundingClientRect();
        var style = 'top: ' + parseInt(window.pageYOffset + rect.bottom + 2, 10) + 'px; ';
        if (window.pageXOffset + rect.left < $(window).width() / 2.0) {
            style += 'left: ' + parseInt(window.pageXOffset + rect.left - 10, 10) + 'px;';
        } else {
            style += 'right: ' + parseInt($(window).width() - window.pageXOffset - rect.right - 10, 10) + 'px;';
        }

        var tooltip = '<div class="tooltip-overlay"';
        if (tooltip_id)
            tooltip += ' id="' + tooltip_id + '" ';
        tooltip += ' style="' + style + '">';
        tooltip += content;
        tooltip += '</div>';
        $('body').append(tooltip);
    };
    // click events are not bound to 'tooltip-button' DOM elements because they can be added after the page loading
    $(document).click(function (event) {
        if (event.target.className.indexOf('tooltip-button') != -1) {
            // a tooltip button was clicked
            return on_tooltip_click(event, event.target);
        } else if (event.target.parentNode && event.target.parentNode.className.indexOf('tooltip-button') != -1) {
            // a node inside a tooltip button was clicked
            return on_tooltip_click(event, event.target.parentNode);
        }
        // close tooltips overlays if not clicked in
        if ($('.tooltip-overlay').length) {
            var node = event.target;
            while (node && node.className !== undefined) {
                if (node.className.indexOf('tooltip-overlay') != -1)
                    return;
                node = node.parentNode;
            }
            $('.tooltip-overlay').remove();
        }
    });
    $(document).keydown(function (event) {
        var keyCode = event.keyCode || event.which; 
        if (keyCode == 27 && $('.tooltip-overlay').length) {
            $('.tooltip-overlay').remove();
            event.stopPropagation();
        }
    });
};
UbiWebLibBase.prototype.generate_tooltip_button = function (id, text, button_text) {
    var html = '<button type="button" class="tooltip-button no-padding no-border no-background" aria-describedby="' + id + '" aria-label="' + utils.translate('help') + '">';
    if (button_text) {
        html += button_text;
    }
    html +=     '<i class="fa fa-question-circle fa-fw" aria-hidden="true"></i>';
    html +=     '<span role="tooltip" class="tooltip-hidden-content" id="' + id + '">' + text + '</span>';
    html += '</button>';
    return html;
};