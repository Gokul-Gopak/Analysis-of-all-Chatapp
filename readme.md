#  index.html
This is the HTML file that serves as the user interface for the application. It contains a form where the user can enter a plaintext message and submit it for analysis. The result of the analysis will be displayed in a table below the form.

The HTML file consists of the following elements:

<form>: The form element that contains an input field for the message and a submit button.
<table>: The table element where the analysis results will be displayed.
JavaScript code: The JavaScript code is responsible for handling the form submission and making an AJAX request to the server.
Server (server.js)
This is the server-side code that handles the incoming requests and performs the analysis based on the selected algorithms (RSA, McEliece, Kyber).

The server code consists of the following parts:

Importing required modules: The code imports the necessary modules such as Express, the results module (containing the analysis functions), and others.
Middleware setup: Express middleware is set up to handle form data and serve static files from the "public" directory.
Route handling:
'/' route: The root route serves the index.html file.
'/analyse' route (POST method): This route is responsible for handling the form submission. It extracts the message from the request body and performs the analysis using the analysis functions from the results module. The analysis results are then sent back as an HTML response.
Server initialization: The server is started and listens on the specified port.
Analysis Functions (results.js)
This file contains the analysis functions for each algorithm (RSA, McEliece, Kyber).

The analysis functions perform the following tasks:

RSA Analysis: It generates an RSA key pair, encrypts an AES encryption key using the RSA public key, and performs decryption using the RSA private key. It also measures the time taken for key generation, encryption, and decryption.
McEliece Analysis: It generates a McEliece key pair, encrypts an AES encryption key using the McEliece public key, and performs decryption using the McEliece private key. It also measures the time taken for key generation, encryption, and decryption.
Kyber Analysis: It generates a Kyber key pair, encrypts an AES encryption key using the Kyber public key, and performs decryption using the Kyber private key. It also measures the time taken for key generation, encryption, and decryption.
The analysis functions return an object containing the analysis results.

Summary
The provided code represents a web application that allows users to enter a plaintext message and perform an analysis of three encryption algorithms (RSA, McEliece, Kyber). The server-side code handles the form submission, performs the analysis using the provided algorithms, and sends back the results to the client. The client-side code handles the form submission using AJAX and updates the HTML with the received analysis results.

Please note that the code you provided has some incomplete parts and dependencies (such as the missing parts of the Kyber analysis function and required module imports). You may need to complete those parts and install the necessary modules to run the application successfully.
