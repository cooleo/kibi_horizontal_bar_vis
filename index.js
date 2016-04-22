module.exports = function (kibana) {
  return new kibana.Plugin({
    name: 'kibi_horizontal_bar_vis',
    require: ['kibana', 'elasticsearch'],
    uiExports: {
      visTypes: [
        'plugins/kibi_horizontal_bar_vis/kibi_horizontal_bar_vis'
      ]
    }
  });
};

