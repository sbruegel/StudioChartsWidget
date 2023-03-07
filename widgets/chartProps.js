// Contains all properties which are reuse by both widgets 2D and 3D one to just change one source

var ChartExtension = (function ( me ) {

    me.getAllChartProerties = function() {
      return [{
      name: 'type',
      label: 'Chart Type (Timeseries, Doughnut etc.)',
      datatype: 'select',
      editor: 'select',
      options: [
        {label: 'Timeseries', value: "timeseries"},
        {label: 'Doughnut', value: "doughnut"},
        {label: 'Pie', value: "pie"},
        {label: 'Bar', value: "bar"},
        {label: 'Horizontal Bar', value: "horizontalBar"},
        {label: 'Polar Area', value: "polarArea"},
        {label: 'Bubble', value: "bubble"},
        {label: 'Radar', value: "radar"}
      ],
      default: 'timeseries',
      isBindingTarget: false,
      sortOrder: 1
    },
    {
      name: 'data',
      label: 'ves-basic-web-widgets-extension:Data',
      datatype: 'infotable',
      isBindingTarget: true,
      sortOrder: 1
    },
    {
      name: 'autoUpdate',
      label: 'ves-basic-web-widgets-extension:Auto Update',
      datatype: 'boolean',
      default: true,
      isVisible: true,
      sortOrder: 2
    },
    {
      name: 'labelField',
      label: 'ves-basic-web-widgets-extension:X-axis Field',
      datatype: 'string',
      editor: 'select',
      applyFieldsFromDataSource: 'data',
      default: '',
      sortOrder: 3,
      isBindingTarget: true

    },
    {
      name: 'timeFormat',
      label: 'ves-basic-web-widgets-extension:Timestamp formatting',
      datatype: 'string',
      default: 'MM D YYYY HH:mm:ss',
      sortOrder: 4,
      isVisible: function(props){return props.type === 'timeseries'}
    },
    {
      name: 'valuesFields',
      label: 'ves-basic-web-widgets-extension:Y-axis Fields array filled by tick order',
      datatype: 'string',
      default: '',
      sortOrder: 5,
      isBindingTarget: true

    },
    {
      name: 'valuesFieldsColumns',
      label: 'ves-basic-web-widgets-extension:Y-axis Fields array filled by tick order',
      datatype: 'columns',
      default: [],
      sortOrder: 5,
      getCachedMetadata: function(ctrl) {
        var srcEl = ctrl.widget.element().find('twx-databind[to-property="data"][from-expression]');
        if (srcEl && srcEl.length > 0) {
          var srcPath = srcEl.attr('from-expression');
          var scope = top.angular.element(top.document.querySelector('[source-path="' + srcPath + '"]')).data('scope');
          if (scope && !scope.service) {
            scope = scope.$parent;
          }
          
          console.log("Property Found", ctrl, scope);
          if (scope && scope.service) {
            var metadata = scope.service.metadata;
            ctrl.widget.me.columns = angular.copy(metadata.Outputs.fieldDefinitions);
            ctrl.widget.me.source = {
              baseType: srcEl.attr('base-type'),
              sourceItemName: srcEl.attr('source-item-name'),
              sourceName: srcEl.attr('source-name')
            };
          }
          if(scope && scope.field) {
            var field = scope.field;
            ctrl.widget.me.columns = angular.copy(field.dataShape.fieldDefinitions);
            ctrl.widget.me.source = {
              baseType: srcEl.attr('base-type'),
              sourceItemName: srcEl.attr('source-item-name'),
              sourceName: srcEl.attr('source-name')
            };
          }
        }
      },
      getColumns: function (ctrl) {
        if (!ctrl.widget.me.columns) {
          this.getCachedMetadata(ctrl);
        }
        return ctrl.widget.me.columns;
      },

      getColumnCount: function (ctrl) {
        return Object.keys(this.getColumns(ctrl) || {}).length;
      },

      toggleSelectAll: function (ctrl) {
        var columns = this.getColumns(ctrl);
        var propContext = this;
        var columnsToAdd = [];

        Object.keys(columns).forEach(function (key) {
          if (!propContext.doesColumnExist(columns[key], ctrl)) {
            columnsToAdd.push(columns[key]);
          }
        });

        if (columnsToAdd.length > 0) {
          var newItems = [];
          for (var i = 0, l = columnsToAdd.length; i < l; i++) {
            newItems.push(propContext.addColumn(columnsToAdd[i], ctrl));
          }
        }
        else {
          Object.keys(columns).forEach(function (key) {
            propContext.removeColumn(columns[key], ctrl);
          });
        }
      },

      doesColumnExist: function (column, ctrl) {
        let dataProp = ctrl.widget.me.valuesFields;
        //let dataProp = ctrl.widget.getProp("valuesFields");
        /*let col = false;
        for(let i = 0; i < dataProp.length; i++)
          if(dataProp[i] == column.name)
            col = true;*/

        return dataProp.includes(column.name);
      },

      getSelectedCount: function (ctrl) {
        var columns = this.getColumns(ctrl);
        var propContext = this;
        var count = 0;

        if (columns) {
          Object.keys(columns).forEach(function (key) {
            if (propContext.doesColumnExist(columns[key], ctrl)) {
              count++;
            }
          });
        }
        //console.log('selected count', count);
        return count;
      },

      areAllSelected: function (ctrl) {
        let dataProp = this.parseStringToArray(ctrl.widget.me.valuesFields);
        return this.getColumnCount(ctrl) === dataProp.length;
        //return this.getColumnCount(ctrl) === this.value.length;
      },

      getSource: function (ctrl) {
        if (!ctrl.widget.me.source) {
          this.getCachedMetadata(ctrl);
        }
        return ctrl.widget.me.source;
      },

      _addColumn: function (props) {
        console.log(props)
      },

      addColumn: function (column, ctrl) {
        let newValue = ctrl.widget.me.valuesFields;
        if(newValue == '' || newValue == undefined)
          newValue = column.name;
        else
          newValue = newValue + "," + column.name;
        ctrl.widget.setProp("valuesFields", newValue);
      },

      parseStringToArray: function(arr) {
        if(arr === undefined || arr === "")
          return [];
        else
          return arr.split(/\s*,\s*/).map(function(secEl) { secEl = secEl.trim(); if(secEl.charAt(0) === "\"" || secEl.charAt(0) === "\'") { secEl = secEl.slice(1,-1);} return secEl } );
      },

      removeColumn: function (column, ctrl) {
        let arr = ctrl.widget.me.valuesFields;
        console.log(arr);
        arr = this.parseStringToArray(arr);
        for( let i = 0; i < arr.length; i++){
          if ( arr[i] === column.name) {
            arr.splice(i, 1);
          }
        }
        ctrl.widget.setProp("valuesFields", arr.toString());
      },

      toggleColumn: function (column, ctrl) {
        if (this.doesColumnExist(column, ctrl)) {
          this.removeColumn(column, ctrl);
        }
        else {
          this.addColumn(column, ctrl);
        }
      }
    },
    {
      name: 'stacked',
      label: 'ves-basic-web-widgets-extension:Stack Datasets',
      datatype: 'boolean',
      default: false,
      sortOrder: 6,
      isVisible: function(props){return props.type === 'bar' || props.type === 'horizontalBar'}
    },
    {
      name: 'labels',
      label: 'ves-basic-web-widgets-extension:Labels of each dataset (comma separated)',
      datatype: 'string',
      sortOrder: 6,
      isBindingTarget: true
    },
    {
      name: 'fillColors',
      label: 'ves-basic-web-widgets-extension:Colors of each dataset fill (comma separated)',
      datatype: 'string',
      sortOrder: 7
    },
    {
      name: 'colors',
      label: 'ves-basic-web-widgets-extension:Border/Line colors of each dataset (comma separated)',
      datatype: 'string',
      sortOrder: 8
    },
    {
      name: 'fills',
      label: 'ves-basic-web-widgets-extension:Fills (comma separated, see http://www.chartjs.org/docs/latest/charts/area.html)',
      datatype: 'string',
      sortOrder: 8,
      isVisible: function(props){return props.type === 'timeseries' || props.type === 'line' || props.type === 'radar'}
    },
    {
      name: 'showLines',
      label: 'ves-basic-web-widgets-extension:ShowLines for each(comma separated)',
      datatype: 'string',
      default: 'true',
      sortOrder: 9,
      isVisible: function(props){return props.type === 'timeseries' || props.type === 'line'}
    },
    {
      name: 'lineTensions',
      label: 'ves-basic-web-widgets-extension:Interpolations (comma separated)',
      datatype: 'string',
      default: '0.3',
      sortOrder: 10,
      isVisible: function(props){return props.type === 'timeseries' || props.type === 'line'}
    },
    {
      name: 'title',
      label: 'ves-basic-web-widgets-extension:Chart Title',
      datatype: 'string',
      sortOrder: 11,
      isBindingTarget: true

    },
    {
      name: 'scaleLabelX',
      label: 'ves-basic-web-widgets-extension:X Axis Label',
      datatype: 'string',
      default: '',
      sortOrder: 12,
      isBindingTarget: true,
      isVisible: function(props){return props.type === 'timeseries' || props.type === 'line' || props.type === 'bar' || props.type === 'horizontalBar' || props.type === 'bubble'}
    },
    {
      name: 'scaleLabelY',
      label: 'ves-basic-web-widgets-extension:Y Axis Label',
      datatype: 'string',
      default: 'Values',
      sortOrder: 13,
      isBindingTarget: true,
      isVisible: function(props){return props.type === 'timeseries' || props.type === 'line' || props.type === 'bar' || props.type === 'horizontalBar' || props.type === 'bubble'}
    },
    {
      name: 'backgroundColor',
      label: 'ves-basic-web-widgets-extension:Background Color (RGBA ONLY)',
      datatype: 'string',
      default: 'rgba(0, 0, 0, 0.3)',
      sortOrder: 14
    },
    {
      name: 'borderWidth',
      label: 'ves-basic-web-widgets-extension:Border/Line Width',
      datatype: 'string',
      default: '2',
      sortOrder: 9
    },
    {
      name: 'canvasheight',
      label: 'Canvas Height',
      datatype: 'number',
      default: 1000,
      isBindingTarget: true,
      alwaysWriteAttribute: true
    },
    {
      name: 'canvaswidth',
      label: 'Canvas Width',
      datatype: 'number',
      default: 1000,
      isBindingTarget: true,
      alwaysWriteAttribute: true
    },
    {
      name: 'optionsConfig',
      label: 'Options Config',
      datatype: 'custom_ui',
      buttonLabel: 'Configure',
      title: 'Options Config',
      template: function (props, ctrl) {
        console.log(props, ctrl);
        // ng-model="ctrl.widgetProperty.value" ng-model-options="ctrl.getNgModelOptions(ctrl.widgetProperty)" twx-droppable-input="true" value-datatype="color" twx-color-input=""
        //return '<p>Select Colors</p><cjs-new-chart-configurator ctrl="{{ctrl.me.columns}}"></cjs-chart-configurator>';
        return '<p>Select Colors</p><div><input ng-model="ctrl.me.columns" ng-repeat="dataset in ctrl.me.columns" type="color"></input></div>';
      }
    }];
  };

  return me;

  }( ChartExtension || {} ));
