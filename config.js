require.config({
    baseUrl: location.pathname.replace(/\/[^/]+$/, '') + "static/",
    paths: {
        "backbone": "/static/vendor/js/backbone-min",
        "underscore": "/static/vendor/js/underscore-min",
        "text": "/static/vendor/js/text"
    }
});

window.STATIC_DIR = "/static/";