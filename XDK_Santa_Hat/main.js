/*jslint node:true, vars:true, bitwise:true, unparam:true */
/*jshint unused:true */
// Leave the above lines for propper jshinting

/**
 * Santa Hat Lights
 * Author: Shawn Hymel
 * Date: December 12, 2015
 *
 * Polls a data.sparkfun stream for updates. If any found, add to the
 * brightness value of the LEDs and clear the stream. Over time, slowly
 * decrease the brightness of the LEDs.
 *
 * Hardware:
 *   Connect LED(s) to PWM0 (GP12). Recommend transistor as amplifier.
 *
 * Released under the MIT License(http://opensource.org/licenses/MIT)
 */

// We need to use MRAA to control hardware and request for HTTP
var mraa = require("mraa");
var request = require('request');

// Save our keys for data.sparkfun
var phant = {
    server: "data.sparkfun.com",        // Base URL of the feed
    publicKey: "<PUBLIC KEY>",          // Public key, everyone can see this
    privateKey: "<PRIVATE KEY>",        // Private key, only you should know
    fields: {                           // Your feed's data fields
        "on": null,
    }
};

// Define a timeout period for the HTTP request
var reqTimeout = 2000;                  // milliseconds

// How often we poll our data.sparkfun stream
var pollPeriod = 3000;                  // milliseconds

// How often to decrease (or increase) LED brightness
var ledPeriod = 100;                    // milliseconds

// Amount to increase or decrease brightness by
var brightnessIncrement = 0.1;
var brightnessDecrement = 0.01;

// Global variables
var numEntries = 0;
var brightness = 0.0;

/******************************************************************************
 * PWM Setup
 *****************************************************************************/

// Enable PWM for our LEDs
var led = new mraa.Pwm(20);
led.enable(true);

// Set PWM to 1000 Hz
led.period(0.001);

// Initialize LEDs as off, but flash to show everything is ready
pwm(led, 0.0);
brightness = 0.2;

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

/******************************************************************************
 * data.sparkfun functions
 *****************************************************************************/

// Call this to get the number of entries in the stream
function getNumEntries() {
    
    console.log("Getting entries");
    
    // HTTP options to get stream entries on data.sparkfun
    var reqOptions = {
        url: "http://data.sparkfun.com/output/" + phant.publicKey + ".json",
        method: 'GET',
        timeout: reqTimeout,
    };
    
    // Make the HTTP requerst to get entries
    request(reqOptions, function(error, response, body) {

        // We only care if we get a successful response (at least 1 entry)
        if (error) {
            console.log("Problem getting entries: " + error);
        } else if (response.statusCode === 200) {

            // Figure out the number of entries
            var resp = JSON.parse(body);
            numEntries = resp.length;

            // Clear the stream
            clearStream();
        }
    });
}

// Clear the stream
function clearStream() {
    
    // HTTP options to clear the stream
    var clearOptions = {
        url: "http://data.sparkfun.com/input/" + phant.publicKey,
        method: 'DELETE',
        headers: {
            'Phant-Private-Key': phant.privateKey
        },
        timeout: reqTimeout,
    };
    
    // Send DELETE request
    request(clearOptions, function(error, response) {
        if (error) {
            console.log("Clear failed. " + error);
        } else {
            console.log("Cleared. Response: " + response.statusCode);
        }
    });
}

/******************************************************************************
 * Main
 *****************************************************************************/

// Poll the stream at a regular interval
setInterval(function() {
    getNumEntries();
}, pollPeriod);

// Main thread to control the LED brightness
setInterval(function() {
    
    // If we have entries, increase brightness
    if (numEntries > 0) {
        console.log("Entries = " + numEntries);
        brightness += numEntries * brightnessIncrement;
        if (brightness > 1.0) {
            brightness = 1.0;
        }
        numEntries = 0;
    }
    
    // Decrease brightness over time
    brightness -= brightnessDecrement;
    if (brightness < 0.0) {
        brightness = 0.0;
    }
    
    // Show brightness on LEDs
    pwm(led, brightness);
    
}, ledPeriod);