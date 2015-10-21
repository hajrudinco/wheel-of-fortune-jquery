(function ( $ ) {

    function WheelOfFortune (element, options) {
        this.$el = $(element);
        this.options = options;
        this._generate();
    };

    WheelOfFortune.prototype = {
        _generate: function() {
            var self = this;

            var canvas = self.canvas = document.createElement('canvas');
            var context = self.ctx = canvas.getContext('2d');

            self.$el.children().remove();

            self.$wheel = $(canvas).css({
                "position": 'absolute',
                "width": '100%',
                "height": '100%',
                "z-index": 100
            });

            self.$pointer = $("<div></div>").css({
                "position": "absolute"
            });

            self.$el.append(self.$wheel);
            self.$el.append(self.$pointer);

            self._setRequestAnimFrame();
            self._init();
            self._drawTriangles();
        },
        _drawTriangles: function() {
            var self = this;

            self._clear();

            var context = self.ctx;
            var options = self.options;
            var radius = self.radius;

            var centerX = 0;
            var centerY = 0;

            var count = options.elements.length;

            var startAngle = 0;
            var stepAngle = 2 * Math.PI / count;

            var endAngle = 0;

            var colors = options.colors;
            var colorIndex = 0;

            for(i = 0; i < count; i++) {
                endAngle = startAngle + stepAngle;
                self._drawTriangle(centerX, centerY, radius, startAngle, endAngle, colors[colorIndex]);
                startAngle = endAngle;

                colorIndex = (colorIndex == colors.length - 1) ? 0 : colorIndex + 1;
            }

            self._drawElements();

        },
        _drawTriangle: function(centerX, centerY, radius, startAngle, endAngle, color) {
            var context = this.ctx;
            context.beginPath();
            context.moveTo(centerX, centerY);
            context.arc(centerX, centerY, radius, startAngle, endAngle, false);
            context.lineTo(centerX, centerY);
            context.closePath();
            context.fillStyle = color;
            context.fill();
        },
        _drawElements: function() {
            var self = this;
            var context = self.ctx;
            var options = self.options;

            var elements = options.elements;
            var count = elements.length;

            context.save();

            var innerAngle = 2 * Math.PI / count;
            var angle = (Math.PI - innerAngle) / 2;
            var h = Math.sin(angle) * (self.radius - options.fontSize);
            var x = Math.sin(angle) * h;
            var y = Math.cos(angle) * h;

            for(i = 0; i < count; i++) {
                context.translate(x, y);
                context.rotate(-angle);
                context.textAlign = 'center';
                context.fillStyle = options.fontColor;
                context.font = options.fontSize + "px " + options.fontFamily;
                context.fillText(elements[i], 0, options.fontSize / 2);

                context.rotate(angle);
                context.translate(-x, -y);
                context.rotate(innerAngle);
            }

            context.restore();
        },
        _init: function() {
            var self = this;
            var context = self.ctx;
            var canvas = self.canvas;

            var options = self.options;

            var count = options.elements.length;
            var stepAngle = 2 * Math.PI / count;

            self.stopAtIndex = options.stopAtIndex || Math.floor(Math.random() * (count + 1));
            self.distanceTraveled = 0;
            self.pathLength =
                (options.numberOfRotations * 2 * Math.PI) - (stepAngle / 2) - (stepAngle * self.stopAtIndex);
            self.currentSpeed = self.rotationSpeed = options.rotationSpeed * Math.PI / 180;
            self.minimalSpeed = options.minimalSpeed * Math.PI / 180;

            var innerWidth = self.$wheel.innerWidth();
            var innerHeight = self.$wheel.innerHeight();
            self.radius = (innerWidth < innerHeight) ? innerWidth / 2 : innerHeight / 2;

            canvas.setAttribute('width', innerWidth);
            canvas.setAttribute('height', innerHeight);

            context.translate(canvas.width / 2, canvas.height / 2);

            self.$pointer.css({
                "background-color": options.pointerColor,
                "width": options.pointerWidth + "px",
                "height": options.pointerHeight,
                "left": (innerWidth / 2 + self.radius - options.pointerWheelOverlap) + "px",
                "top": ((innerHeight - options.pointerHeight) / 2) + "px",
                "z-index": 200
            });

            self._clear();
        },
        _clear: function() {
            var self = this;
            var context = self.ctx;
            var canvas = self.canvas;

            context.clearRect(-canvas.width, -canvas.height, canvas.width * 2, canvas.height * 2);
        },
        _setRequestAnimFrame: function() {
            var self = this;

            self.requestAnimFrame = (function(callback) {
                return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame ||
                        window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
                            function(callback) {
                                window.setTimeout(callback, 1000 / 60);
                            };
            })();
        },
        _rotate: function(previousTime, previousAngle) {
            var self = this;
            var canvas = self.canvas;
            var context = self.ctx;
            var options = self.options;
            var rotationSpeed = self.currentSpeed;

            if(!options.constantSpeed && self.currentSpeed > self.minimalSpeed) {
                var treshold = options.brakeTreshold;
                var traveledPercentage = (self.distanceTraveled / self.pathLength);

                rotationSpeed = self.currentSpeed =
                    (traveledPercentage < treshold) ?
                        self.rotationSpeed :
                        (1 - (traveledPercentage - treshold) * (1 / (1 - treshold))) * self.rotationSpeed;
            }

            var currentTime = (new Date()).getTime();
            var timeDelta = currentTime - previousTime;
            var rotationAngle =  (rotationSpeed * timeDelta / 1000);

            self.distanceTraveled += rotationAngle;

            if(self.distanceTraveled >= self.pathLength) {
                rotationAngle -= (self.distanceTraveled - self.pathLength);
                context.rotate(rotationAngle);
                self._drawTriangles();
                options.onFinished(options.elements[self.stopAtIndex]);
                return;
            }

            context.rotate(rotationAngle);

            self._drawTriangles();

            self.requestAnimFrame.call(window, function() {
                self._rotate(currentTime, rotationAngle);
            });
        },
        spin: function() {
            var self = this;
            var startTime = (new Date()).getTime();
            self._rotate(startTime, 0);
        },
        destroy: function() {
            var self = this;

            self.$el.children().remove();
            self.$el.removeData('wheelOfFortune');
        },
        reset: function() {
            var self = this;
            var wheelOfFortune;

            self._generate();
        }
    };

    $.fn.wheelOfFortune = function(options) {
        function get() {
            var wheelOfFortune = $.data(this, 'wheelOfFortune');

            if (!wheelOfFortune) {
                wheelOfFortune = new WheelOfFortune(this, $.extend({}, options));
                $.data(this, 'wheelOfFortune', wheelOfFortune);
            }

            return wheelOfFortune;
        };

        var runCommand = function() {
            var wheelOfFortune = $.data(this, 'wheelOfFortune');
            wheelOfFortune[options]();
        }

        if (typeof options === 'string') {
            this.each(runCommand);
            return;
        }

        options = options || {};
        options = $.extend({}, $.fn.wheelOfFortune.defaults, options);
        return this.each(get);
    };

    $.fn.wheelOfFortune.defaults = {
        /**
         * Elements for circle
         * @type {Array}
         */
        elements: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        /**
         * Stop at this element's index
         * If undefined, stops at random index
         * @type {Number} [zero based index]
         */
        stopAtIndex: null,
        /**
         * Background colors of i-th triangle,
         * circles if count > length(colors)
         * @type {Array} [of colors]
         */
        colors: ["#3A8E98", "#FFFFFF"],
        /**
         * Starting rotation speed in [deg/s]
         * @type {Number} [deg/s]
         */
        rotationSpeed: 360,
        /**
         * Max rotation numbers
         * @type {Number} [full circles]
         */
        numberOfRotations: 3,
        /**
         * Rotates at the same speed whole time if true
         * If false, speed decreases before stopping
         * @type {Boolean}
         */
        constantSpeed: false,
        /**
         * Percentage (distanceTraveled / pathLength) after speed begins to decrease
         * @type {Decimal} [0 - 1]
         */
        brakeTreshold: 0.5,
        /**
         * Minimal speed
         * @type {Number} [deg]
         */
        minimalSpeed: 10,
        /**
         * CSS - font size specification
         * @type {Number} [px]
         */
        fontSize: 60,
        /**
         * CSS - font family
         * @type {String}
         */
        fontFamily: 'Arial',
        /**
         * CSS - font color
         * @type {String}
         */
        fontColor: '#000',
        /**
         * Color of pointer
         * @type {String}
         */
        pointerColor: '#000',
        /**
         * Pointer width
         * @type {Number} [px]
         */
        pointerWidth: 60,
        /**
         * Pointer height
         * @type {Number} [px]
         */
        pointerHeight: 20,
        /**
         * Overlap of pointer over wheel image
         * @type {Number} [px]
         */
        pointerWheelOverlap: 20,
        /**
         * Function executed after rotation has finished
         */
        onFinished: function(selectedValue) {}
    };

} ( jQuery ));