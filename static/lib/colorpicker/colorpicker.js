(function ($) {

var path = $("script[src*=colorpicker]").attr("src"); 
path = path.replace("colorpicker.js", ""); 

var defaults = {
    initialColor: null,
    palette: path+"palette-1.png"
};

function getCursorColor(e, canvas, canvasContext) {
    var canvasOffset = canvas.offset();
    var canvasX = Math.floor(e.pageX - canvasOffset.left);
    var canvasY = Math.floor(e.pageY - canvasOffset.top);
    var pixel = canvasContext.getImageData(canvasX, canvasY, 1, 1).data;

    return [pixel[0], pixel[1], pixel[2]];
};

function rgbToString(rgb) {
    return "rgb("+rgb[0]+", "+rgb[1]+", "+rgb[2]+")";
};

$.colorPicker = function(options) {
    options = $.extend({}, defaults, options);

    var canvas = $(options.picker);
    var preview = $(options.preview);

    // create canvas and context objects
    var ctx = canvas[0].getContext('2d');

    // draw palette
    var image = new Image();
    image.onload = function () {
        ctx.drawImage(image, 0, 0, image.width, image.height); // draw the image on the canvas
    }
    image.src = options.palette;

    
    var currentColor = options.initialColor;
    
    canvas.mousemove(function(e) { 
        var rgb = getCursorColor(e, canvas, ctx);
        preview.css("background", rgbToString(rgb));
    });

    canvas.mouseleave(function(e) { 
        if (currentColor) {
            preview.css("background", rgbToString(currentColor));
        }
    });
    
    canvas.click(function(e) { 
        var rgb = getCursorColor(e, canvas, ctx);
        currentColor = rgb;
        preview.css("background", rgbToString(rgb));
        options.change(rgb);
    });

    if (currentColor) {
        preview.css("background", rgbToString(currentColor));
        options.change(currentColor);
    }
};

})(jQuery);
