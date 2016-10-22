(function(global) {

    "use strict";
    
    // The constructor.
    var RatingWidget = function(options) {
        this.minRating    = 0;
        this.maxRating    = options.maxRating || 5;
        this.size         = options.size      || 30; // In pixels.
        this.value        = options.inputElement.value = options.initialRating || 0; // This expression gets evaluated from right to left.

        this.elements              = {}; // Will hold the DOM elements that make up the widget.
        this.elements.inputElement = options.inputElement;
        this.svgEmpty              = options.svgEmpty  || '../dist/svg/star-empty.svg';
        this.svgFilled             = options.svgFilled || '../dist/svg/star-filled.svg';
        
        constructWidget(this);
        setEventListeners(this);
    };


    /* -------------------------- DOM Element Construction. -------------------------- */

    function constructWidget(self) {

        // Create a container <div> and make it wrap around our original <input> element.
        var container = document.createElement('div');
        container.className = 'rating-widget';

        // Make individual icons.
        for (var i = self.minRating; i < self.maxRating; i += 1) {
            var icon = document.createElement('span');
            icon.style.display = 'inline-block';
            icon.style.width = icon.style.height = self.size + 'px';

            icon.style.background = 'url(' + (i < self.value ? self.svgFilled : self.svgEmpty) + ')';
            icon.style.backgroundSize = 'contain';

            container.appendChild(icon);
        }

        self.elements.container = container;
        self.elements.inputElement.parentElement.insertBefore(container, self.elements.inputElement);
        container.appendChild(self.elements.inputElement);

        // Hide the original <input>.
        self.elements.inputElement.style.display = 'none';
    }


    /* ------------------------------- Public methods. ------------------------------- */

    RatingWidget.prototype.setRating = function(rating) {

        if (rating !== this.value && 
            rating >= this.minRating && 
            rating <= this.maxRating) {

            // Set the new value.
            this.elements.inputElement.value = rating;
            this.value = rating;

            adjustRatingDisplay(this, this.value);

        }
    };

    RatingWidget.prototype.getRating = function(rating) {
        return this.value;
    };


    /* ------------------------------ Event listeners. ------------------------------- */

    function setEventListeners(self) {
        var icons = self.elements.container.querySelectorAll('span');
        
        icons.forEach(function(icon) {
            
            icon.addEventListener('mouseover', function(event) {
                adjustRatingDisplay(self, getIndexOf(this, icons) + 1);
            });

            icon.addEventListener('mouseleave', function(event) {
                adjustRatingDisplay(self, self.value);
            });

            icon.addEventListener('click', function(event) {
                self.setRating(getIndexOf(this, icons) + 1);
            });
        
        });

        function getIndexOf(icon, icons) {
            for (var i = 0; i < icons.length; i += 1) {
                if (icons[i] === icon) {
                    return i;
                }
            }
            return -1;
        }
    }


    /* ----------------------------- Private functions. ------------------------------ */

    function adjustRatingDisplay(self, rating) {
        
        var icons = self.elements.container.querySelectorAll('span');

        for (var i = self.minRating; i < self.maxRating; i += 1) {

            icons[i].style.background = 'url(' + (i < rating ? self.svgFilled : self.svgEmpty) + ')';
            icons[i].style.backgroundSize = 'contain';
        
        }
    }


    /* ------------------- Constructor exposition to global scope. ------------------- */
    
    global.RatingWidget = RatingWidget;

})(window);