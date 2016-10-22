(function(global) {
    
    var RatingWidget = function(options) {
        this.maxRating = options.maxRating || 5;
        this.initial   = options.initialRating || 0;
    };

    global.RatingWidget = RatingWidget;

})(window);