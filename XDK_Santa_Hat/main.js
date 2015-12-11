/*jslint node:true, vars:true, bitwise:true, unparam:true */
/*jshint unused:true */
// Leave the above lines for propper jshinting

// Because MRAA
var mraa = require("mraa");

// Enable PWM for our LEDs
var led = new mraa.Pwm(20);
led.enable(true);

// Set PWM to 1000 Hz
led.period(0.001);

// Our main
var brightness = 0.0;
var dir = 1;
setInterval( function() {
    pwm(led, brightness);
    brightness += dir * 0.02;
    if (brightness >= 1.0) {
        dir = -1;
    } else if (brightness <= 0.0) {
        dir = 1;
    }
}, 20);

// PWM needs a "fix" that turns off the LED on a value of 0.0
function pwm(pin, val) {
    if (val === 0.0) {
        pin.write(0.0);
        pin.enable(false);
    } else {
        pin.enable(true);
        pin.write(val);
    }
}