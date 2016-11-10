var box = function(game, options) {
  let bmd = game.add.bitmapData(options.length,options.width);

  bmd.ctx.beginPath();
  bmd.ctx.rect(0,0,options.length,options.width);
  bmd.ctx.fillStyle = options.color;
  bmd.ctx.fill();

  return bmd;
};

export default box;
