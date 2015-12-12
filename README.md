Edison Santa Hat
==================================================

Project for controlling LEDs attached to a Santa Hat.

Create a stream at [data.sparkfun.com](https://data.sparkfun.com/). Copy the public and private keys into <PUBLIC KEY> and <PRIVATE KEY> in *XDK_Santa_Hat/main.js* and *Web_Button/index.html*.

Run the code in XDK_Santa_Hat on the Edison (recommend using the Intel XDK). On a separate computer, run the Test Server in Web_Button with Node:

    node testServer.js
    
Open a browser and navigate to <YOUR IP ADDRESS>:8888 and press the button. The button posts an entry to the data.sparkfun stream, and the Edison polls the stream for new entries. If it finds any, it briefly turns the LEDs on, which slowly dim over time.

License Information
-------------------

Please review the LICENSE.md file for license information. 

Distributed as-is; no warranty is given.