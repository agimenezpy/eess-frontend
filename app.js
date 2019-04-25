define("jquery", [], function () {
    return jQuery.noConflict();
});

define("leaflet", [], function () {
    L.mapbox.accessToken = "pk.eyJ1IjoiYWdpbWVuZXoiLCJhIjoiWmFvUEVERSJ9.xk7ZhnfTiRRvLJ1mtvDloQ";
    return L;
});

require(["jquery", "app/js/main"], function ($, App) {

    $(App());

    // Search
    var input = $(".geocoder-control-input");
    input.focus(function () {
        $("#panelSearch .panel-body").css("height", "150px");
    });
    input.blur(function () {
        $("#panelSearch .panel-body").css("height", "auto");
    });

    // Attach search control for desktop or mobile
    function attachSearch() {
        var parentName = $(".geocoder-control").parent().attr("id"),
            geocoder = $(".geocoder-control"),
            width = $(window).width();
        if (width <= 767 && parentName !== "geocodeMobile") {
            geocoder.detach();
            $("#geocodeMobile").append(geocoder);
        } else if (width > 767 && parentName !== "geocode") {
            geocoder.detach();
            $("#geocode").append(geocoder);
        }
    }

    $(window).resize(function () {
        attachSearch();
    });

    attachSearch();
});