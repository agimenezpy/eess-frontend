require.config({
    baseUrl: location.pathname.replace(/\/[^/]+$/, ''),
    paths: {
        "backbone": "node_modules/backbone/backbone-min",
        "underscore": "node_modules/underscore/underscore-min",
        "text": "node_modules/requirejs-text/text"
    }
});

window.STATIC_DIR = "";