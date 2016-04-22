define(function (require) {
  // get the kibana/metric_vis module, and make sure that it requires the "kibana" module if it
  // didn't already
  // var module = require('ui/modules').get('kibana/kibi_horizontal_bar_vis', ['kibana','nvd3ChartDirectives']);
  var module = require('ui/modules').get('kibana/kibi_horizontal_bar_vis', ['kibana', 'nvd3']);
  var d3 = require('d3');
  var _ = require('lodash');

  module.controller('KbnHorizontalBarVisController', function ($scope, $element, $rootScope, Private) {

    var tabifyAggResponse = Private(require('ui/agg_response/tabify/tabify'));
    var config;
    var margin, width, height;

    // declare data
    var tableGroups = null;
    var _updateDimensions = function () {
      var delta = 18;
      var w = $element.parent().width();
      var h = $element.parent().height();
      if (w) {
        if (w > delta) {
          w -= delta;
        }
        width = w;
      }
      if (h) {
        if (h > delta) {
          h -= delta;
        }
        height = h;
      }
    };

    var off = $rootScope.$on('change:vis', function () {

      _updateDimensions();
      $scope.processTableGroups(tableGroups);
      _updateConfig();

    });

    $scope.$on('$destroy', off);


    $scope.processTableGroups = function (tableGroups) {
      $scope.data = [];
      tableGroups.tables.forEach(function (table) {
        var rows = table.rows;
        var cols = table.columns;
        for (var i = 1; i < cols.length; i++) {
          var group = {};
          var groupKey = '';
          if (cols[i].aggConfig.params.field != null) {
            groupKey = cols[i].aggConfig.params.field.displayName;
          } else {
            groupKey = cols[i].aggConfig.type.name;
          }
          group['key'] = groupKey;
          var values = [];
          _.each(rows, function (row) {
            var item = {};
            item.label = row[0];
            item.value = row[i];
            values.push(item);
          });
          group.values = values;
          $scope.data.push(group);
        }
      });
    };

    // set default config
    var _initConfig = function () {

      config = {
        margin: 50,
        w: width - margin,
        h: height - margin,
        showAxesLabels: true,
        showAxes: true,
        showLegend: true,
        showControls: true,
        showValues: true,
        showTooltips: true,
        showStacked: false,
        showGrouped: true
      };
    }

    var _updateConfig = function () {
      config.showLegend = $scope.vis.params.addLegend;
      config.showTooltips = $scope.vis.params.addTooltip;
      config.showControls = $scope.vis.params.addControl;
      config.w = width;
      config.h = height;
      config.showValues = $scope.vis.params.addValues;

      $scope.options = {
        chart: {
          type: 'multiBarHorizontalChart',
          x: function (d) {
            return d.label;
          },
          y: function (d) {
            return d.value;
          },
          width: config.w - config.margin,
          height: config.h - config.margin,
          margin: {
            top: 20,
            left: 100,
            bottom: 50
          },
          showControls: config.showControls,
          showValues: config.showValues,
          // stacked: false,
          // grouped: true,
          showLegend: config.showLegend,
          tooltips: config.showTooltips,
          duration: 500,
          xAxis: {
            showMaxMin: false
          },
          yAxis: {
            axisLabel: 'Values',
            tickFormat: function (d) {
              return d3.format(',.2f')(d);
            }
          },
          dispatch: {
            elementClick: function (e) {
              console.log('click')
            },
            elementMouseover: function (e) {
              console.log('mouseover')
            },
            elementMouseout: function (e) {
              console.log('mouseout')
            },
            renderEnd: function (e) {
              console.log('renderEnd')
            }
          },
          legend: {
            dispatch: {
              legendClick: function (e) {
                // console.log("legend click");
                // _updateConfig();
              }
            }
          }
        }
      };
    };

    $scope.$watch('esResponse', function (resp) {
      _initConfig();
      if (resp) {
        tableGroups = tabifyAggResponse($scope.vis, resp);
        _updateDimensions();
        $scope.processTableGroups(tableGroups);
        _updateConfig();
      }
    });
  });
});
