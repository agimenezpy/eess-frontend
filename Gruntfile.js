/*jshint esversion: 6*/

const CONFIG = {
    src: ".",
    build: "build",
    dist: "../eessadmin/public",
    static: "../eessadmin/public/static",
    root: "../eessadmin/templates"
};

module.exports = function (grunt) {
    // Build customizations would be left up to developer to implement.
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-processhtml');

    grunt.initConfig({
        config: CONFIG,
        clean: {
            dev:  ['<%= config.build %>/*'],
            vendor:  ['<%= config.static %>/vendor/*'],
            prod:  [
                '<%= config.static %>/app/*',
                '<%= config.static %>/app.js',
                '<%= config.root %>/index.html'
            ]
        },
        copy: {
            prod: {
                files: [{
                        expand: true,
                        src: ['img/**'],
                        dest: '<%= config.static %>/'
                    },
                    {
                        expand: true,
                        src: ['app/**', 'app.js', 'config.js'],
                        dest: '<%= config.static %>/'
                }]
            },
            vendor: {
                files: [{
                        expand: true,
                        cwd: 'vendor/',
                        flatten: true,
                        src: [
                            'calcite-maps/js/jquery/calcitemaps-v0.9.js',
                            'mapbox.js-3.2.0/mapbox.js',
                        ],
                        dest: '<%= config.static %>/vendor/js/'
                    }, {
                        expand: true,
                        cwd: 'vendor/',
                        flatten: true,
                        src: [
                            'mapbox.js-3.2.0/images/**',
                        ],
                        dest: '<%= config.static %>/vendor/css/images/'
                    }, {
                        expand: true,
                        cwd: 'vendor/calcite-maps/fonts/',
                        src: [
                            '**',
                        ],
                        dest: '<%= config.static %>/vendor/fonts/'
                    }, {
                        expand: true,
                        cwd: 'vendor/',
                        flatten: true,
                        src: [
                            'calcite-maps/css/calcite-maps-bootstrap.min-v0.9.css',
                            'calcite-maps/css/calcite-maps-esri-leaflet.min-v0.9.css',
                            'mapbox.js-3.2.0/mapbox.css'
                        ],
                        dest: '<%= config.static %>/vendor/css/'
                    }, {
                        expand: true,
                        cwd: 'node_modules/',
                        flatten: true,
                        src: [
                            'leaflet-measure/dist/assets/**',
                        ],
                        dest: '<%= config.static %>/vendor/css/assets/'
                    }, {
                        expand: true,
                        cwd: 'node_modules/',
                        flatten: true,
                        src: [
                            'leaflet-measure/dist/leaflet-measure.css',
                            'leaflet.markercluster/dist/MarkerCluster.css',
                            'leaflet.markercluster/dist/MarkerCluster.Default.css'
                        ],
                        dest: '<%= config.static %>/vendor/css/'
                    }, {
                        expand: true,
                        cwd: 'node_modules/',
                        flatten: true,
                        src: [
                            'leaflet.markercluster/dist/leaflet.markercluster.js',
                            'leaflet-measure/dist/leaflet-measure.es.js',
                            'jquery/dist/jquery.min.js',
                            'bootstrap/dist/js/bootstrap.min.js',
                            'requirejs/require.js',
                            'backbone/backbone-min.js',
                            'underscore/underscore-min.js',
                            'requirejs-text/text.js'
                        ],
                        dest: '<%= config.static %>/vendor/js/'
                }]
            }
        },
        processhtml: {
            prod: {
                options: { process: true },
                files: {
                    '<%= config.root %>/index.html': ['index.html']
                }
            }
        }
    });

    grunt.registerTask('build', ['clean:prod', 'copy:prod', 'processhtml:prod']);
    grunt.registerTask('vendor', ['clean:vendor', 'copy:vendor']);

};
