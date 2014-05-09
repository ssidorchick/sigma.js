;(function() {
  'use strict';

  if (typeof sigma === 'undefined')
    throw 'sigma is not declared';

  // Initialize packages:
  sigma.utils.pkg('sigma.canvas.labels.edges');

  /**
   * This label renderer will just display the label on the right of the edge.
   *
   * @param  {object}                   edge         The edge object.
   * @param  {object}                   source node  The edge source node.
   * @param  {object}                   target node  The edge target node.
   * @param  {CanvasRenderingContext2D} context      The canvas context.
   * @param  {configurable}             settings     The settings function.
   */
  sigma.canvas.labels.edges.def = function(edge, source, target, context, settings) {
    var fontSize,
        position,
        prefix = settings('prefix') || '',
        size = edge[prefix + 'size'];

    if (typeof edge.label !== 'string')
      return;

    fontSize = (settings('labelSize') === 'fixed') ?
      settings('defaultLabelSize') :
      settings('edgeLabelSizeRatio') * size;

    context.font = (settings('fontStyle') ? settings('fontStyle') + ' ' : '') +
      fontSize + 'px ' + settings('font');
    context.fillStyle = (settings('labelColor') === 'edge') ?
      (edge.color || settings('defaultEdgeColor')) :
      settings('defaultLabelColor');

    if (edge.type === 'curve' || edge.type === 'curvedArrow')
      position = getCurveRenderPosition(source, target, prefix, fontSize);
    else
      position = getStraightRenderPosition(source, target, prefix, fontSize);

    context.fillText(
      Number(edge.label).toFixed(settings('edgeLabelDecimals')),
      position.x,
      position.y
    );
  };

  var getCurveRenderPosition = function(source, target, prefix, fontSize) {
    var sX = source[prefix + 'x'],
        sY = source[prefix + 'y'],
        tX = target[prefix + 'x'],
        tY = target[prefix + 'y'],
        sSize = source[prefix + 'size'],
        x,
        y;

    if (source.id === target.id) {
      x = sX - 5 * Math.pow(sSize, 0.85) + fontSize;
      y = sY + 5 * Math.pow(sSize, 0.85) + fontSize;
    } else {
      // Quadratic Bezier curve points.
      var p = [
            { x: sX, y: sY },
            {
              x: (sX + tX) / 2 + (tY - sY) / 4,
              y: (sY + tY) / 2 + (sX - tX) / 4
            },
            { x: tX, y: tY }
          ],
          t = 0.5, // The relative middle value of a Quadratic Bezier curve.
          curveMidX = (1 - t) * (1 - t) * p[0].x + 2 * (1 - t) * t * p[1].x + t * t * p[2].x,
          curveMidY = (1 - t) * (1 - t) * p[0].y + 2 * (1 - t) * t * p[1].y + t * t * p[2].y,
          // Calculating offset from the middle of the curve.
          slopeMidControl = -(p[1].y - curveMidY) / (p[1].x - curveMidX);

      x = curveMidX + Math.abs((5 + fontSize / 4) / Math.sqrt(Math.pow(slopeMidControl, 2) + 1));
      y = curveMidY - Math.abs((slopeMidControl * (5 + fontSize / 4)) / Math.sqrt(Math.pow(slopeMidControl, 2) + 1));
    }

    return { x: x, y: y };
  };

  var getStraightRenderPosition = function(source, target, prefix, fontSize) {
    return {
      x: (source[prefix + 'x'] + target[prefix + 'x']) / 2 + fontSize / 3,
      y: (source[prefix + 'y'] + target[prefix + 'y']) / 2 - fontSize / 3
    };
  };
})();
