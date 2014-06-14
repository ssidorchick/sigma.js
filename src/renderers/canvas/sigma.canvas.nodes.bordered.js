;(function() {
  'use strict';

  sigma.utils.pkg('sigma.canvas.nodes');

  /**
   * The bordered node renderer. It renders the node as a simple disc with border.
   *
   * @param  {object}                   node     The node object.
   * @param  {CanvasRenderingContext2D} context  The canvas context.
   * @param  {configurable}             settings The settings function.
   */
  sigma.canvas.nodes.bordered = function(node, context, settings) {
    var prefix = settings('prefix') || '',
        x = node[prefix + 'x'],
        y = node[prefix + 'y'],
        size = node[prefix + 'size'];

    // Node border:
    if (settings('borderSize') > 0) {
      context.beginPath();
      context.fillStyle = settings('nodeBorderColor') === 'node' ?
        (node.color || settings('defaultNodeColor')) :
        settings('defaultNodeBorderColor');
      context.arc(
        x,
        y,
        size + settings('borderSize'),
        0,
        Math.PI * 2,
        true
      );
      context.closePath();
      context.fill();
    }

    context.fillStyle = node.color || settings('defaultNodeColor');
    context.beginPath();
    context.arc(
      x,
      y,
      size,
      0,
      Math.PI * 2,
      true
    );

    context.closePath();
    context.fill();
  };
})();
