var PictureIt = {

    images: [],
    imagesPerPage: 180,
    imagesPerColor: 180,
    step: 50,

    init: function() {
        console.log('App loaded');

        this.setColor([128,0,50]);

        $.colorPicker({
            picker: "#picker",
            preview: ".colorpicker-preview",
            initialColor: [_.rand(255), _.rand(255), _.rand(255)],
            change: function(rgb) {
                PictureIt.setColor(rgb);
            }
        });
    },

    setImages: function(urls) {
        var container = $('#images');
        container.empty();
        _.each(urls, function(url) {
            var image = $('<img>').attr('src', url);
            container.append(image);
        });
    },

    setColor: function(color) {
        console.log('Loading images with color ', color);
        this.getImages(color);
        //this.setImages(this.images);
    },

    getImages: function(color) {
        var colors = [],
            i;
            //baseUrl = ['http://placehold.it/100x100/', '/fffff&text=%20'];
        for (i = 0; i < this.imagesPerPage/this.imagesPerColor; i++) {
            // Randomize some colors
            var component = this.rand(0,2);
            color[component] += this.rand(-Math.min(this.step, color[component]),
                                          Math.min(this.step, Math.abs(color[component] - 255)));
            colors.push([color[0], color[1], color[2]]);
        }

        var data = {'colors': colors, 'count': this.imagesPerColor};
        var self = this;
        $.ajax({
          type: "POST",
          url: '/search',
          data: JSON.stringify(data),
          success: function(resp) { self.setImages(resp.images); },
          contentType: 'application/json'
        });
        return colors;
    },

    toHex: function(component) {
            var hex = component.toString(16);
            return hex.length === 1 ? "0" + hex : hex;
    },

    rgbToHex: function(color) {
        return this.toHex(color[0]) + this.toHex(color[1]) + this.toHex(color[2]);
    },

    rand: function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
};

PictureIt.init();
