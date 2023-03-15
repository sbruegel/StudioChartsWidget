/* begin copyright text
 *
 * Copyright © 2016 PTC Inc., Its Subsidiary Companies, and /or its Partners. All Rights Reserved.
 *
 * end copyright text
 */
 (function() {
   /*function showSpecificProps(neededType, props){
     return props.type === neededType;
   }*/
  function charts() {
    var properties = [
      {
        name: 'class',
        label: 'ves-basic-web-widgets-extension:Class',
        datatype: 'string',
        //default: '',
        isBindingTarget: true
      },
      {
        name: 'padding',
        label: 'ves-basic-web-widgets-extension:Padding',
        datatype: 'string',
        default: ''
      },
      {
        name: 'margin',
        label: 'ves-basic-web-widgets-extension:Margin',
        datatype: 'string',
        default: ''
      },
      {
        name: 'visible',
        label: 'Visible',
        datatype: 'boolean',
        default: true,
        isBindingTarget: true
      },
      {
        name: 'width',
        label: 'Width',
        datatype: 'string',
        default: ''
      },
      {
        name: 'height',
        label: 'Height',
        datatype: 'string',
        default: ''
      }
    ];

    properties = ChartExtension.getAllChartProerties().concat(properties);
    properties[17].default = 'rgba(255,255,255,1)'; //replace backgroundColor because its not necessary in 2D
    return {

      elementTag: 'charts',

      label: 'Chart',

      category: 'basic-html',

      groups: ['Charts'],

      properties: properties,

      columns: [],

      onAddDataBinding: function (data, ctrl, widgetInstance, $scope) {
        if (data.sourceType === 'data' && data.toProperty === 'data') {
          if (data.sourceScope) {
            if(data.sourceScope.service)
              widgetInstance.columns = angular.copy(data.sourceScope.service.metadata.Outputs.fieldDefinitions);
            else if (data.sourceScope.field) {
              widgetInstance.columns = angular.copy(data.sourceScope.field.dataShape.fieldDefinitions);
            }
          }
          else {
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
          //ctrl.properties.valuesFieldsColumns.value = [];
          //ctrl.me.setProp("valuesFieldsColumns", []);
        }
      },

      dependencies: {
        files: ['js/moment.min.js', 'js/Chart.min.js', 'js/chartjs3d-ng.js'],
        angularModules: ['chartjs3d-ng']
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

      designTemplate: function () {
        return '<div class="chart-placeholder {{me.class}}" style="width:{{me.width}}; height:{{me.height}}; padding: {{me.padding}};  margin: {{me.margin}};">' +
            '<p class="chart-placeholder-text">{{me.type.charAt(0).toUpperCase() + me.type.slice(1)}} Chart</p></div>';
      },

      runtimeTemplate: function (props) {
        var tmpl = '<div twx-visible>' +
            '<div class="chart-placeholder {{me.class}}" style="width:{{me.width}}; height:{{me.height}}; padding: {{me.padding}};" ng-if="!me.data.length">' +
              '<p class="chart-placeholder-text">Data is not loaded yet.</p>' +
            '</div>' +
            '<div ng-if="me.data.length" ' +
              'style="width:{{me.width}}; height:{{me.height}}; padding: {{me.padding}}; margin: {{me.margin}};"' +
              'acjs-chart ' +
              'image-id="' + props.widgetId + '" ' +
              'auto-update="' + props.autoUpdate + '" ' +
              'chart-type="{{me.type}}" ' +
              'data="me.data" ' +
              'labels-field="{{me.labelField}}" ' +
              'values-fields="{{me.valuesFields}}"' +
              'time-format="{{me.timeFormat}}"' +
              'colors="' + props.colors + '"' +
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
              'height="{{me.height}}" ' +
              'border="{{me.borderWidth}}" ' +
              'delegate="delegate" ' +
              'twx-native-events>' +
              '<canvas id=' + props.widgetId + ' style="position:relative; width:{{me.width}}; height:{{me.height}};"></canvas>' +
            '</div>' +
          '</div>';
        return tmpl;
      }
    };
  }
  twxAppBuilder.widget('charts', charts);
}());
