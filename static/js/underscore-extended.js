_.mixin({
    sum: function(list) {
        return  _.reduce(list, function(sum, item) {
            return sum+item;
        }, 0);
    },

    round: function(number, decimals) {
        return Math.round(number*Math.pow(10,decimals))/Math.pow(10,decimals);
    },

    isDefined: function(obj) {
        return this.isUndefined(obj) === false;
    },

    rand: function(from, to) {
        if (_.isUndefined(to)) {
            to = from;
            from = 0;
        }
        return Math.floor(Math.random() * (to - from + 1) + from);
    }
});