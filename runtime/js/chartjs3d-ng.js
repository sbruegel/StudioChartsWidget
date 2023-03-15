/* begin copyright text
 *
 * Copyright © 2016 PTC Inc., Its Subsidiary Companies, and /or its Partners. All Rights Reserved.
 *
 * end copyright text
 */
if ( typeof module !== 'undefined' && typeof exports !== 'undefined' && module.exports === exports ) {

  module.exports = 'chartjs3d-ng';

}

( function() {

  'use strict';

  function convertCsvToArray( list, repeatCount ) {

    let result = list.split( "," ).map( ( el ) => el.trim() );

    if ( result.length == 1 && repeatCount ) {

      result = Array( repeatCount ).fill( list.trim() );

    }

    return result;

  }

  function convertColorCsvToArray ( list, repeatCount ) {

    let result;

    //if we get the values as one demensional array
    if( list.charAt( 0 ) == '[' ) {
      list = list.slice( 1,-1 );
    }

    // if 2d array is formated with spaces between the arrays like [ [],[]] trim helps against errors
    list = list.trim();

    //second check if it is a two demensional array
    if( list.charAt( 0 ) == '[' ) {

      list = list.slice( 1,-1 );

      if(list.includes( "]" )) {

      	result = list.split( /\]\s*,\s*\[/).map(( el ) => el.split(",").map(function(secEl) { secEl = secEl.trim(); if(secEl.charAt( 0 ) === "\"" || secEl.charAt( 0 ) === "\'") { secEl = secEl.slice( 1,-1 );} return secEl } ));
      
      } else {

        result = list.split( /\s*,\s*/ ).map( function( secEl ) { secEl = secEl.trim(); if(secEl.charAt( 0 ) === "\"" || secEl.charAt( 0 ) === "\'" ) { secEl = secEl.slice( 1,-1 );} return secEl } );
        result = Array(repeatCount).fill(result);

      }

    } else {

      result = list.split( /\s*,\s*/ ).map( function( secEl ) { secEl = secEl.trim(); if( secEl.charAt( 0 ) === "\"" || secEl.charAt( 0 ) === "\'" ) { secEl = secEl.slice( 1,-1 ); } return secEl } );

    }

    //repeat color for all if just one argument
    if ( result.length == 1 && repeatCount && result[ 0 ][ 0 ] === undefined ) {

      result = Array( repeatCount ).fill( result );

    }

    return result;

  }


  function acjsChart( tml3dRenderer, $timeout ) {

    var defaultFontColor = "rgb(241, 241, 241)";

    // Have to change this to a function because if its a JSON the var will just save the path to the object. As result a bug appier if muliple widget with same chartType get same Configuration also in isolated scopes :/
    var chartDefaultConfigs = function( chartType ) {

      let config;

      switch( chartType.toString() ) {

        case "timeseries":
          config = {
            type: 'line',
            data: {},
            options: {
              responsive: false,
              legend: {
                labels: {
                  fontColor: defaultFontColor
                }
              },
              scales: {
                xAxes: [{
                  display: true,
                  type: 'time',
                  time: {
                    displayFormats: {
                      second: ""
                    }
                  },
                  ticks: {
                    fontColor: defaultFontColor
                  },
                  gridLines: {
                    color: 'rgb(210, 210, 210)'
                  }
                }],
                yAxes: [{
                  display: true,
                  ticks: {
                    fontColor: defaultFontColor
                  },
                  gridLines: {
                    color: 'rgb(210, 210, 210)'
                  }
                }]
              }
            }
          };
          break;

        case "bar":
          config = {
            type: 'bar',
            data: {},
            options: {
              responsive: false,
              scales: {
                xAxes: [{
                  type: "category",

                  // Specific to Bar Controller
                  categoryPercentage: 0.8,
                  barPercentage: 0.9,

                  // grid line settings
                  gridLines: {
                    offsetGridLines: true,
                  }
                }],
                yAxes: [{
                  type: "linear",
                  ticks: {
                    min: 0
                  }
                }]
              }
            },
          };
          break;

        case "doughnut":
          config = {
            type: 'doughnut',
            data: {},
            options: {}
          };
          break;

        case "pie":
          config = {
            type: 'pie',
            data: {},
            options: {}
          };
          break;

        case "radar":
          config = {
            type: 'radar',
            data: {},
            options: {}
          };
          break;

        case "polarArea":
          config = {
            type: 'polarArea',
            data: {},
            options: {
              scale: {
                type: 'radialLinear',
                angleLines: {
                  display: false
                },
                gridLines: {
                  circular: true
                },
                pointLabels: {
                  display: false
                },
                ticks: {
                  beginAtZero: true
                }
              }
            }
          };
          break;

        case "bubble":
          config = {
            type: 'bubble',
            data: {},
            options: {
              scales: {
                xAxes: [{
                  type: 'linear', // bubble should probably use a linear scale by default
                  position: 'bottom',
                  id: 'x-axis-0' // need an ID so datasets can reference the scale
                }],
                yAxes: [{
                  type: 'linear',
                  position: 'left',
                  id: 'y-axis-0'
                }]
              }
            }
          };
          break;

        case "horizontalBar":
          config = {
            type: 'horizontalBar',
            data: {},
            options: {
              scales: {
                xAxes: [{
                  type: "linear",
                  ticks: {
                    min: 0
                  }
                }],
                yAxes: [{
                  type: "category",

                  // Specific to Bar Controller
                  categoryPercentage: 0.8,
                  barPercentage: 0.9,

                  // grid line settings
                  gridLines: {
                    offsetGridLines: true,
                    display: false
                  }
                }]
              }
            }
          };
          break;
      }

      return config;

    }

    let setConfigData = function( chartType, rows, labelsField, valuesFields, colors, labels, fills, fillColors, showLines, lineTensions, border ) {
      var valuesFieldsArray = convertCsvToArray( valuesFields );
      var labelsArray = convertCsvToArray( labels );
      var colorsArray = convertColorCsvToArray( colors, valuesFieldsArray.length );
      var fillsArray = convertCsvToArray( fills, valuesFieldsArray.length );
      var fillColorsArray = convertColorCsvToArray( fillColors, valuesFieldsArray.length );
      var showLinesArray = convertCsvToArray( showLines, valuesFieldsArray.length );
      var lineTensionsArray = convertCsvToArray( lineTensions, valuesFieldsArray.length );
      var borderWidthArray = convertCsvToArray( border, valuesFieldsArray.length );

      var data = {
        labels: [],
        datasets: []
      };

      // bubble chart is working a bit different so we used the labelField not to label but as second cordinate for the bubbles
      if( chartType != 'bubble' ) {

        //x-axis
        for ( let i = 0; i < rows.length; i++ ) {

          data.labels.push( rows[ i ][ labelsField ] );

        }

      }
      // valuesFields = dataset
      for ( let j = 0; j < valuesFieldsArray.length; j++ ) {

        var dataset = {
          data: [],
          label: labelsArray[ j ],
          backgroundColor: fillColorsArray[ j ],
          borderWidth: borderWidthArray[ j ],
          borderColor: colorsArray[ j ],
          fill: fillsArray[ j ] == 'false' ? false : fillsArray[ j ], // see http://www.chartjs.org/docs/latest/charts/area.html
          lineTension: parseFloat(lineTensionsArray[ j ]),
          showLine: showLinesArray[ j ] == 'true'
        };

        if( chartType != 'bubble' ) {

          //fill up data array for specific dataset
          for ( let i = 0; i < rows.length; i++ ) {

            dataset.data.push( rows[ i ][ valuesFieldsArray[ j ] ] );

          }

        } else {

          // bubble chart needs coordinates and radius
          for ( let i = 0; i < rows.length; i++ ) {

            dataset.data.push( {
              y: rows[ i ][ valuesFieldsArray[ j ] ],
              x: rows[ i ][ labelsField ],
              r: rows[ i ][ valuesFieldsArray[ j ] ]
            } );

          }

        }

        data.datasets.push( dataset );

      }

      this.data = data;

    };

    var newChartConfig = function ( tml, chartType, scope, timeFormat, title, scaleLabelX, scaleLabelY, backgroundColor, stacked, height ) {
      //if (mainFontColor)
      //  defaultFontColor = mainFontColor;

      var config = chartDefaultConfigs(chartType);

      if (chartType === "timeseries") {

        config.options.scales.xAxes[0].time.displayFormats.second = timeFormat;

      }

      if (tml) {

        // Configuration for 3D drawing remove some features and add important plugins
        config.animation = { duration: 0 };
        config.options.responsive = false;

        config.plugins = [ {
          // this is where the magic happens where we are transferring the chart onto the 3d Image by converting the created canvas to a base64 encoded png.
          // because chart.js is using async functions to draw a chart we need the afterRender function to know if it is finnished.
          afterRender: ( chart ) => {

            tml3dRenderer.setTexture( scope.imageId, chart.canvas.toDataURL() );
            
          }

        } ];

      } else {
        // Configuration for 2D drawing so we can add some nice to have features like animations etc.
        config.animation = { duration: 1000 };
        config.options.responsive = true;

        if( height ) {
          config.options.maintainAspectRatio = false;
        }

        config.options.hover = { mode: "label" };
        config.plugins = [];
      }

      if ( backgroundColor ) {

        config.plugins.push( {

          beforeDraw: ( chart ) => {

            var ctx = chart.canvas.getContext( "2d" );

            var colorComponents = backgroundColor.split( ',' );

            // we have an alpha parameter
            if ( colorComponents[ 3 ] ) {

              ctx.globalAlpha = parseFloat( colorComponents[ 3 ].trim() );

            }

            ctx.fillStyle = backgroundColor;

            // be care full to use char.canvas.* because the elements return diffrent values on diffrent devices, despite static size!
            ctx.fillRect( 0, 0, chart.canvas.width, chart.canvas.height );
            ctx.globalAlpha = 1;
            ctx.restore();

          }

        } )
      }

      if ( title ) {

        config.options.title = {
          display: true,
          text: title,
          fontColor: defaultFontColor
        };

      }

      // only for cartesian axes used by (timeseries, line, bar, and bubble charts)
      if ( scaleLabelX && ( chartType === 'timeseries' || chartType === 'bar' || chartType === 'bubble' || chartType === 'horizontalBar' || chartType === 'line' ) ) {

        config.options.scales.xAxes[0].scaleLabel = {
          display: true,
          labelString: scaleLabelX,
          fontColor: defaultFontColor
        };

      }

      if ( scaleLabelY && ( chartType === 'timeseries' || chartType === 'bar' || chartType === 'bubble' || chartType === 'horizontalBar' || chartType === 'line' ) ) {

        config.options.scales.yAxes[ 0 ].scaleLabel = {
          display: true,
          labelString: scaleLabelY,
          fontColor: defaultFontColor
        };

      }

      // bar and horizontalBar feature
      if( stacked == 'true' && ( chartType === 'bar' || chartType === 'horizontalBar' ) ) {

        config.options.scales.xAxes[ 0 ].stacked = true;
				config.options.scales.yAxes[ 0 ].stacked = true;

      }

      /*if(displayGrid) {
        config.scales.xAxes.gridLines.display = displayGrid
        config.scales.yAxes.gridLines.display = displayGrid
      }*/
      config.setData = setConfigData;

      return config;

    };

    return {
      restrict: 'EA',
      scope: {
        tml: '@',
        chartType: '@',
        data: '=',
        labelsField: '@',
        valuesFields: '@',
        timeFormat: '@',
        colors: '@',
        labels: '@',
        fills: '@',
        fillColors: '@',
        showLines: '@',
        lineTensions: '@',
        title: '@',
        scaleLabelX: '@',
        scaleLabelY: '@',
        backgroundColor: '@',
        stacked: '@',
        imageId: "@",
        height: "@",
        canvasWidth: "@",
        canvasHeight: "@",
        border: "@",
        autoUpdate: '@',
        delegate: '='
      },
      link: function( scope, element, attr ) {

        if ( attr.tml ) {

          var canvas = scope._canvas = document.createElement( "canvas" );
          canvas.width = scope.canvasWidth;
          canvas.height = scope.canvasHeight;

        } else {

          var canvas = scope._canvas = element.find( "canvas" )[0];

        }
        
        scope._chartConfig = newChartConfig( scope.tml, scope.chartType, scope, scope.timeFormat, scope.title, scope.scaleLabelX, scope.scaleLabelY, scope.backgroundColor, scope.stacked, scope.height );
        scope._chart = new Chart( canvas.getContext( "2d" ), scope._chartConfig );

        var updateChart = () => {

          var data = scope.data;

          if ( data && data.length && scope.labelsField && scope.valuesFields ) {

            scope._chartConfig.setData( scope.chartType, data, scope.labelsField, scope.valuesFields, scope.colors, scope.labels, scope.fills, scope.fillColors, scope.showLines, scope.lineTensions, scope.border );
            scope._chart.update();

          }

        };

        var group = [ 'labelsField', 'valuesFields' ];

        if ( scope.autoUpdate === 'true' ) {
          
          if( scope.data.lastUpdated ) {

            group.push( 'data.lastUpdated' );

          } else {

            group.push( 'data' ); //needed if nested Infotable is bound to widget because there is no lastUpdated prop in a row of first Infotable

          }

        }

        scope.$watchGroup( group, function( value ) {

          // if the data last updated is defined
          if ( value[ 2 ] ) {

            updateChart();

          }

        });

        scope.$watch( 'delegate', function( delegate ) {

          if ( delegate ) {

            delegate.updateChart = updateChart;

          }

        });

      }
    };
  }

  var acjsModule = angular.module( 'chartjs3d-ng', [] );

  acjsModule.directive( 'acjsChart', [ 'tml3dRenderer', '$timeout', acjsChart ] );

} () );
