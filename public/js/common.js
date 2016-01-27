requirejs.config({
    baseUrl: '/lib',
    paths: {
        app: '../js/app',
        api: '../js/api',
        comp: '../views/components',
        'modernizr': 'modernizr.min',
        'jquery-ui': 'jquery-ui-1.9.2.custom.min',
        'nicescroll': 'jquery.nicescroll',
        'easypiechart': 'easypiechart/jquery.easypiechart',
        'iCheck': 'iCheck/jquery.icheck',
        'sparkline': 'sparkline/jquery.sparkline',
        'flot-chart': 'flot-chart/jquery.flot',
        'flot-tooltip':'flot-chart/jquery.flot.tooltip',
        'flot-resize': 'flot-chart/jquery.flot.resize',
        'morris': 'morris-chart/morris',
        'raphael': 'morris-chart/raphael-min',
        'calendar': 'calendar/clndr',
        'moment': 'calendar/moment-2.2.1',
        'ckeditor': 'ckeditor/ckeditor',
        'spinner': 'fuelux/js/spinner.min',
        'tagsInput': 'jquery-tags-input/jquery.tagsinput',
        'isotope': 'jquery.isotope',
        'fileupload': 'bootstrap-fileinput/fileinput',
        'datetimepicker': 'bootstrap-timepicker/js/bootstrap-timepicker'
    },
    shim: {
        "bootstrap": ["jquery"],
        'lodash': {
            exports: '_'
        },
        underscore: {
            exports: '_'
        },
        'jquery-ui': ["jquery"],
        nicescroll: {
            deps: ['jquery'],
            exports: '$.fn.niceScroll'
        },
        // easypiechart:{
        //     deps: ['jquery'],
        //     exports: '$.fn.easyPieChart'
        // },
        iCheck: {
            deps: ['jquery'],
            exports: '$.fn.iCheck'
        },
        sparkline: {
            deps: ['jquery'],
            exports: '$.fn.sparkline'
        },
        'flot-chart': {
            deps: ['jquery'],
            exports: '$.plot'
        },
        'flot-tooltip': {
            deps: ['jquery', 'flot-chart']
        },
        'flot-resize': {
            deps: ['jquery', 'flot-chart']
        },
        'raphael': {
            deps: [],
            exports: 'Raphael'
        },
        'morris': {
            deps: ['jquery', 'raphael'],
            exports: 'Morris'
        },
        'calendar': {
            deps: ['jquery', 'moment', 'underscore'],
            exports: '$.fn.clndr'
        },
        'ckeditor': {
            deps: ['jquery'],
            exports: 'window.CKEDITOR'
        },
        spinner: {
            deps: ['jquery'],
            exports: '$.fn.spinner'
        },
        tagsInput: {
            deps: ['jquery'],
            exports: '$.fn.tagsInput'
        },
        isotope: {
            deps: ['jquery'],
            exports: '$.fn.isotope'
        },
        'fileupload': {
            deps: ['jquery'],
            exports: '$.fn.fileinput'
        },
        'datetimepicker': {
            deps: ['jquery', "jquery-ui", "bootstrap"],
            exports: '$.fn.datetimepicker'
        }
    }
});