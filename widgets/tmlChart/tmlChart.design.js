/* begin copyright text
 *
 * Copyright © 2016 PTC Inc., Its Subsidiary Companies, and /or its Partners. All Rights Reserved.
 *
 * end copyright text
 */
function twx3dTimeSeriesChart() {
  var properties = [
    {
      name: 'src',
      label: 'ves-ar-extension:Resource',
      datatype: 'string',
      default: '/extensions/images/sample_image.png',
      isVisible: false
    }
  ];
  properties = ChartExtension.getAllChartProerties().concat(properties);

  var setdefault = Twx3dCommon.getWidthProperty();
  setdefault.default = "0.1";
  properties.push(setdefault);
  setdefault = Twx3dCommon.getHeightProperty();
  //setdefault.default = "0.1";
  properties.push(setdefault);
  properties.push(Twx3dCommon.getPivotProperty());


  var overlay = Twx3dCommon.arrayToMap(properties);
  overlay.experimentalOneSided = Twx3dCommon.getOneSidedProperty();
  overlay.placeholder_img = Twx3dCommon.getPlaceHolderImgProperty('/extensions/images/sample_image.png');

  var props = Twx3dCommon.new3dProps(overlay);

  var runtimeTemplate = Twx3dCommon.buildRuntimeTemplate('twx-dt-image', props);
  return {
    elementTag: 'tml-3d-chart',

    label: '3D Chart',

    category: 'ar',

    supports3D: true,

    groups: ['Charts'],

    properties: props,

    columns: [],

    onAddDataBinding: function (data, ctrl, widgetInstance, $scope) {
      if (data.sourceType === 'data' && data.toProperty === 'data') {
        if (data.sourceScope) {
          if(data.sourceScope.service)
            widgetInstance.columns = angular.copy(data.sourceScope.service.metadata.Outputs.fieldDefinitions);
          else if(data.sourceScope.field)
            widgetInstance.columns = angular.copy(data.sourceScope.field.dataShape.fieldDefinitions);
          console.log(data.sourceScope.service.metadata.Outputs.fieldDefinitions);
        } else {
          var dataProp = _.find(ctrl.properties, {name: 'valuesFieldsColumns'});
          dataProp.getCachedMetadata({widget: ctrl});
        }
        widgetInstance.source = data;
      }
    },

    onRemoveDataBinding: function (id, ctrl, widgetInstance, $scope) {
      var srcEl = ctrl.element().find('twx-databind[to-property="data"][from-expression]');
      if (!srcEl || srcEl.length <= 0) {
        // remove the following properties if nothing else is bound to the "data" property
        delete ctrl.me.source;
        delete ctrl.me.columns;
        ctrl.properties.valuesFields.value = '';
        //ctrl.me.setProp("valuesFieldsColumns", []);
      }
    },

    services: [
      {
        name: 'updateChart',
        label: 'ves-basic-web-widgets-extension:Update Chart'
      }
    ],

    events: [
      {
        name: 'click',
        label: 'ves-basic-web-widgets-extension:Click'
      }
    ],

    dependencies: {
      files: ['js/moment.min.js', 'js/Chart.min.js', 'js/chartjs3d-ng.js', 'images/LoadingChart.png'],
      angularModules: ['chartjs3d-ng']
    },

    designTemplate: function () {
      return runtimeTemplate;
    },

    runtimeTemplate: function (props) {
      var template2d =
        '<div ng-hide ng-if="me.data.length" ' +
        'acjs-chart ' +
        'image-id="' + props.widgetId + '" ' +
        'canvas-height="' + props.canvasheight + '" ' +
        'canvas-width="' + props.canvaswidth + '" ' +
        'auto-update="' + props.autoUpdate + '" ' +
        'tml="true"' +
        'chart-type="{{me.type}}" ' +
        'data="me.data" ' +
        'labels-field="{{me.labelField}}" ' +
        'values-fields="{{me.valuesFields}}"' +
        'time-format="{{me.timeFormat}}"' +
        'colors="{{me.colors}}"' +
        'labels="{{me.labels}}"' +
        'fills="{{me.fills}}"' +
        'fill-colors="{{me.fillColors}}"' +
        'show-lines="{{me.showLines}}"' +
        'line-tensions="{{me.lineTensions}}"' +
        'title="{{me.title}}" ' +
        'scale-label-x="{{me.scaleLabelX}}" ' +
        'scale-label-y="{{me.scaleLabelY}}" ' +
        'background-color="{{me.backgroundColor}}" ' +
        'stacked="{{me.stacked}}" ' +
        'border="{{me.borderWidth}}" ' +
        'twx-native-events>' +
        '</div>';
      var template3d = runtimeTemplate.replace("#widgetId#", props.widgetId).replace('src="{{me.src}}"', 'src="extensions/images/LoadingChart.png"');
      return template2d + template3d;
    }
  };
}

twxAppBuilder.widget('twx3dTimeSeriesChart', twx3dTimeSeriesChart);
