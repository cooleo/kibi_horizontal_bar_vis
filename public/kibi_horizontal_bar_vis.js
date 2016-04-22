define(function (require) {
  // we need to load the css ourselves
  require('plugins/kibi_horizontal_bar_vis/kibi_horizontal_bar_vis.less');

  require('angular-nvd3');

  require('angularjs-nvd3-directives');

  // we also need to load the controller and used by the template
  require('plugins/kibi_horizontal_bar_vis/kibi_horizontal_bar_vis_controller');

  // register the provider with the visTypes registry
  require('ui/registry/vis_types').register(HorizontalBarVisProvider);

  function HorizontalBarVisProvider(Private) {
    var TemplateVisType = Private(require('ui/template_vis_type/TemplateVisType'));
    var Schemas = Private(require('ui/Vis/Schemas'));

    // return the visType object, which kibana will use to display and configure new
    // Vis object of this type.
    return new TemplateVisType({
      name: 'horizontalBar',
      title: 'Horizontal Bar chart',
      description: 'The goto chart for oh-so-many needs. Great for time and non-time data. Stacked or grouped, ' +
                    'exact numbers or percentages. If you are not sure which chart your need, you could do worse than to start here.',
      icon: 'fa-bars',
      template: require('plugins/kibi_horizontal_bar_vis/kibi_horizontal_bar_vis.html'),
       params: {
        defaults: {
          addLegend: true,
          addTooltip: true,              
          addControl: true,    
          addValues: true,
        },
        scales: ['linear', 'log', 'square root'],
        modes: ['stacked', 'percentage', 'grouped'],
        editor: require('plugins/kibi_horizontal_bar_vis/kibi_horizontal_bar_vis_params.html')
      },
      schemas: new Schemas([
        {
          group: 'metrics',
          name: 'metric',
          title: 'Y-Axis',
          min: 1,
          aggFilter: '!std_dev',
          defaults: [
            { schema: 'metric', type: 'count' }
          ]
        },
        {
          group: 'buckets',
          name: 'segment',
          title: 'X-Axis',
          min: 0,
          max: 1,
          aggFilter: '!geohash_grid'
        },
        {
          group: 'buckets',
          name: 'group',
          title: 'Split Bars',
          min: 0,
          max: 1,
          aggFilter: '!geohash_grid'
        },
        {
          group: 'buckets',
          name: 'split',
          title: 'Split Chart',
          min: 0,
          max: 1,
          aggFilter: '!geohash_grid'
        }
      ])
    });
  }

  // export the provider so that the visType can be required with Private()
  return HorizontalBarVisProvider;
});
