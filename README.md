# wheel-of-fortune-jquery
jQuery wheel of fortune plugin

# working demo
http://dss.ba/wheel-of-fortune-jquery/demo.html

#create
```javascript
$(".wheel").wheelOfFortune({
    optionName: value,
    ...
    ...
    ...
    onFinished: function() {
        console.log("Finished...");
    }
});
```

#methods
```javascript
$(".wheel").wheelOfFortune('method_name');
```
methods:
 - spin
 - reset
 - destroy
 
#default options
```javascript
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
onFinished: function() {}
```
