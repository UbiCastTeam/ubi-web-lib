/*******************************************
* UbiWebLibBase - Base js lib              *
* Copyright: UbiCast, all rights reserved  *
* Author: Stéphane Schoorens               *
*******************************************/
/* globals utils */
function UbiWebLibBase (options) {
    
    utils.setup_class(this, options);
    var obj = this;
    $(document).ready(function () {
        obj.init();
    });
}
UbiWebLibBase.prototype.init = function () {
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