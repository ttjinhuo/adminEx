define(function (require) {
    var $ = require('jquery');
    var jQuery = $;
    var jQueryUI = require('jquery-ui');
    var niceScroll = require('nicescroll');
    var iCheck = require('iCheck');
    var sparkline = require('sparkline');
    var flotChart = require('flot-chart');
    var flotTooltip = require('flot-tooltip');
    var flotResize = require('flot-resize');
    var calendar = require('calendar');
    var easyPieChart = require('EasyPieChart');

    var morris = require('morris');



    searchform_reposition();

    jQuery(window).resize(function(){

       if(jQuery('body').css('position') == 'relative') {

          jQuery('body').removeClass('left-side-collapsed');

       } else {

          jQuery('body').css({left: '', marginRight: ''});
       }

       searchform_reposition();

    });

    function searchform_reposition() {
       if(jQuery('.searchform').css('position') == 'relative') {
          jQuery('.searchform').insertBefore('.left-side-inner .logged-user');
       } else {
          jQuery('.searchform').insertBefore('.menu-right');
       }
    }

     // panel collapsible
     $('.panel .tools .fa').click(function () {
         var el = $(this).parents(".panel").children(".panel-body");
         if ($(this).hasClass("fa-chevron-down")) {
             $(this).removeClass("fa-chevron-down").addClass("fa-chevron-up");
             el.slideUp(200);
         } else {
             $(this).removeClass("fa-chevron-up").addClass("fa-chevron-down");
             el.slideDown(200); }
     });

     $('.todo-check label').click(function () {
         $(this).parents('li').children('.todo-title').toggleClass('line-through');
     });

     $(document).on('click', '.todo-remove', function () {
         $(this).closest("li").remove();
         return false;
     });

     //jquery ui
     $("#sortable-todo").sortable();


     // panel close
     $('.panel .tools .fa-times').click(function () {
         $(this).parents(".panel").parent().remove();
     });



     // tool tips
     $('.tooltips').tooltip();

     //easy piechart
     $('.chart').easyPieChart({});

     // popovers
     $('.popovers').popover();

     //sparkline
     $(".sparkline").each(function(){
         var $data = $(this).data();
         $data.valueSpots = {'0:': $data.spotColor};
         $(this).sparkline( $data.data || "html", $data, {
             tooltipFormat: '<span style="display:block; padding:0px 10px 12px 0px;">' +
                 '<span style="color: {{color}}">&#9679;</span> {{offset:names}} ({{percent.1}}%)</span>'
         });
     });

    //income expense progress bar
    $("#income").sparkline([5,6,7,5,9,6,4,9,8,5,6,7], {type: 'bar', height: '35', barWidth: 5, barSpacing: 2, barColor: '#fc8675'});
    $("#expense").sparkline([3,2,5,8,4,7,5,8,4,6], {type: 'bar', height: '35', barWidth: 5, barSpacing: 2, barColor: '#65cea7'});
    $("#expense2").sparkline([3,2,5,8,4,7,5,8,4,6], {type: 'bar', height: '35', barWidth: 5, barSpacing: 2, barColor: '#65cea7'});
    $("#pro-refund").sparkline([3,2,5,8,4,7,5,8,4,6], {type: 'bar', height: '35', barWidth: 5, barSpacing: 2, barColor: '#ffffff'});
    $("#p-lead-1").sparkline([7,5,9,6,4,9,8,5,6,7], {type: 'bar', height: '35', barWidth: 5, barSpacing: 2, barColor: '#65cea7'});
    $("#p-lead-2").sparkline([3,2,5,8,4,7,5,8,4,6], {type: 'bar', height: '35', barWidth: 5, barSpacing: 2, barColor: '#fc8675'});
    $("#p-lead-3").sparkline([3,2,5,8,4,7,5,8,4,6], {type: 'bar', height: '35', barWidth: 5, barSpacing: 2, barColor: '#5ab5de'});
    $("#visit-1").sparkline([5,6,7,9,9,5,3,2,4,6,7,5,6,8,7,9,5 ], {type: 'line', width: '100', height: '25', lineColor: '#55accc', fillColor: '#edf7f9'}); 
    $("#visit-2").sparkline([5,6,7,7,9,5,8,5,4,6,7,8,6,8,7,9,5 ], {type: 'line', width: '100', height: '25', lineColor: '#55accc', fillColor: '#edf7f9'});

    // Use Morris.Area instead of Morris.Line
    Morris.Donut({
        element: 'graph-donut',
        data: [
            {value: 40, label: 'New Visit', formatted: 'at least 70%' },
            {value: 30, label: 'Unique Visits', formatted: 'approx. 15%' },
            {value: 20, label: 'Bounce Rate', formatted: 'approx. 10%' },
            {value: 10, label: 'Up Time', formatted: 'at most 99.99%' }
        ],
        backgroundColor: false,
        labelColor: '#fff',
        colors: [
            '#4acacb','#6a8bc0','#5ab6df','#fe8676'
        ],
        formatter: function (x, data) { return data.formatted; }
    });


    $(function() {

        var d1 = [[0, 501], [1, 620], [2, 437], [3, 361], [4, 549], [5, 618], [6, 570], [7, 758], [8, 658], [9, 538], [10, 488] ];
        var d2 = [[0, 401], [1, 520], [2, 337], [3, 261], [4, 449], [5, 518], [6, 470], [7, 658], [8, 558], [9, 438], [10, 388] ];
        var data = ([{
            label: "New Visitors",
            data: d1,
            lines: {
                show: true,
                fill: true,
                fillColor: {
                    colors: ["rgba(255,255,255,.4)", "rgba(183,236,240,.4)"]
                }
            }
        },
            {
                label: "Unique Visitors",
                data: d2,
                lines: {
                    show: true,
                    fill: true,
                    fillColor: {
                        colors: ["rgba(255,255,255,.0)", "rgba(253,96,91,.7)"]
                    }
                }
            }
        ]);

        var options = {
            grid: {
                backgroundColor:
                {
                    colors: ["#ffffff", "#f4f4f6"]
                },
                hoverable: true,
                clickable: true,
                tickColor: "#eeeeee",
                borderWidth: 1,
                borderColor: "#eeeeee"
            },
            // Tooltip
            tooltip: true,
            tooltipOpts: {
                content: "%s X: %x Y: %y",
                shifts: {
                    x: -60,
                    y: 25
                },
                defaultTheme: false
            },
            legend: {
                labelBoxBorderColor: "#000000",
                container: $("#main-chart-legend"), //remove to show in the chart
                noColumns: 0
            },
            series: {
                stack: true,
                shadowSize: 0,
                highlightColor: 'rgba(000,000,000,.2)'
            },
    //        lines: {
    //            show: true,
    //            fill: true
    //
    //        },
            points: {
                show: true,
                radius: 3,
                symbol: "circle"
            },
            colors: ["#5abcdf", "#ff8673"]
        };
        var plot = $.plot($("#main-chart #main-chart-container"), data, options);
    });


    //=================init clendar =====================
    // call this from the developer console and you can control both instances
    var calendars = {};

    $(document).ready( function() {

        // assuming you've got the appropriate language files,
        // clndr will respect whatever moment's language is set to.
        // moment.lang('ru');

        // here's some magic to make sure the dates are happening this month.
        var thisMonth = moment().format('YYYY-MM');

        var eventArray = [
            { startDate: thisMonth + '-10', endDate: thisMonth + '-14', title: 'Multi-Day Event' },
            { startDate: thisMonth + '-21', endDate: thisMonth + '-23', title: 'Another Multi-Day Event' }
        ];

        // the order of the click handlers is predictable.
        // direct click action callbacks come first: click, nextMonth, previousMonth, nextYear, previousYear, or today.
        // then onMonthChange (if the month changed).
        // finally onYearChange (if the year changed).

        calendars.clndr1 = $('.cal1').clndr({
            events: eventArray,
            // constraints: {
            //   startDate: '2013-11-01',
            //   endDate: '2013-11-15'
            // },
            clickEvents: {
                click: function(target) {
                    console.log(target);
                    // if you turn the `constraints` option on, try this out:
                    // if($(target.element).hasClass('inactive')) {
                    //   console.log('not a valid datepicker date.');
                    // } else {
                    //   console.log('VALID datepicker date.');
                    // }
                },
                nextMonth: function() {
                    console.log('next month.');
                },
                previousMonth: function() {
                    console.log('previous month.');
                },
                onMonthChange: function() {
                    console.log('month changed.');
                },
                nextYear: function() {
                    console.log('next year.');
                },
                previousYear: function() {
                    console.log('previous year.');
                },
                onYearChange: function() {
                    console.log('year changed.');
                }
            },
            multiDayEvents: {
                startDate: 'startDate',
                endDate: 'endDate'
            },
            showAdjacentMonths: true,
            adjacentDaysChangeMonth: false
        });

        calendars.clndr2 = $('.cal2').clndr({
            template: $('#template-calendar').html(),
            events: eventArray,
            startWithMonth: moment().add('month', 1),
            clickEvents: {
                click: function(target) {
                    console.log(target);
                }
            },
            forceSixRows: true
        });

        // bind both clndrs to the left and right arrow keys
        $(document).keydown( function(e) {
            if(e.keyCode == 37) {
                // left arrow
                calendars.clndr1.back();
                calendars.clndr2.back();
            }
            if(e.keyCode == 39) {
                // right arrow
                calendars.clndr1.forward();
                calendars.clndr2.forward();
            }
        });

    });

  //icheck
  $(function(){
    "use strict";
    $('.minimal input').iCheck({
        checkboxClass: 'icheckbox_minimal',
        radioClass: 'iradio_minimal',
        increaseArea: '20%' // optional
    });

    $('.minimal-red input').iCheck({
        checkboxClass: 'icheckbox_minimal-red',
        radioClass: 'iradio_minimal-red',
        increaseArea: '20%' // optional
    });

    $('.minimal-green input').iCheck({
        checkboxClass: 'icheckbox_minimal-green',
        radioClass: 'iradio_minimal-green',
        increaseArea: '20%' // optional
    });

    $('.minimal-blue input').iCheck({
        checkboxClass: 'icheckbox_minimal-blue',
        radioClass: 'iradio_minimal-blue',
        increaseArea: '20%' // optional
    });

    $('.minimal-yellow input').iCheck({
        checkboxClass: 'icheckbox_minimal-yellow',
        radioClass: 'iradio_minimal-yellow',
        increaseArea: '20%' // optional
    });

    $('.minimal-purple input').iCheck({
        checkboxClass: 'icheckbox_minimal-purple',
        radioClass: 'iradio_minimal-purple',
        increaseArea: '20%' // optional
    });

    $('.square input').iCheck({
        checkboxClass: 'icheckbox_square',
        radioClass: 'iradio_square',
        increaseArea: '20%' // optional
    });

    $('.square-red input').iCheck({
        checkboxClass: 'icheckbox_square-red',
        radioClass: 'iradio_square-red',
        increaseArea: '20%' // optional
    });

    $('.square-green input').iCheck({
        checkboxClass: 'icheckbox_square-green',
        radioClass: 'iradio_square-green',
        increaseArea: '20%' // optional
    });

    $('.square-blue input').iCheck({
        checkboxClass: 'icheckbox_square-blue',
        radioClass: 'iradio_square-blue',
        increaseArea: '20%' // optional
    });

    $('.square-yellow input').iCheck({
        checkboxClass: 'icheckbox_square-yellow',
        radioClass: 'iradio_square-yellow',
        increaseArea: '20%' // optional
    });

    $('.square-purple input').iCheck({
        checkboxClass: 'icheckbox_square-purple',
        radioClass: 'iradio_square-purple',
        increaseArea: '20%' // optional
    });

    $('.flat-red input').iCheck({
        checkboxClass: 'icheckbox_flat-red',
        radioClass: 'iradio_flat-red'
    });

    $('.flat-grey input').iCheck({
        checkboxClass: 'icheckbox_flat-grey',
        radioClass: 'iradio_flat-grey'
    });

    $('.flat-green input').iCheck({
        checkboxClass: 'icheckbox_flat-green',
        radioClass: 'iradio_flat-green'
    });

    $('.flat-blue input').iCheck({
        checkboxClass: 'icheckbox_flat-blue',
        radioClass: 'iradio_flat-blue'
    });

    $('.flat-yellow input').iCheck({
        checkboxClass: 'icheckbox_flat-yellow',
        radioClass: 'iradio_flat-yellow'
    });

    $('.flat-purple input').iCheck({
        checkboxClass: 'icheckbox_flat-purple',
        radioClass: 'iradio_flat-purple'
    });
});





});