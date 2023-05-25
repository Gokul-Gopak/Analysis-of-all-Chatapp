# Analysis

This project provides a web-based comparison between three different cryptographic algorithms: RSA, McEliece, and Kyber. It allows users to enter a plaintext message and see the analysis results for each algorithm.

**Prerequisites**

Before running the project, make sure you have the following dependencies installed:
- Node.js: The project requires Node.js to run the server and handle the HTTP requests.
- Express: Express is a web framework for Node.js that simplifies the process of building web applications.
- node-forge: node-forge is a cryptographic library for Node.js that provides RSA key generation, encryption, and decryption functionalities.
- crypto: The built-in crypto module in Node.js provides cryptographic functionality, including symmetric encryption and decryption.
- crystals-kyber: crystals-kyber is a JavaScript implementation of the Kyber cryptographic algorithm.

**Installation**

To install the dependencies, run the following command:
`npm install`

**Usage**

- To start the server, use the following command:
`npm start`
- This will start the server on port 8080. 
- You can access the application by opening your browser and navigating to http://localhost:8080.

- The web application allows you to compare the performance of RSA, McEliece, and Kyber algorithms by entering a plaintext message. 
- After entering the message and clicking the "Submit" button, the application will perform the analysis and display the results in a table.

- The table includes the following information for each algorithm:
  - Decrypted message: The decrypted message using the corresponding algorithm.
  - KeyGen time: The time taken to generate the cryptographic keys.
  - Encryption time: The time taken to encrypt the message.
  - Decryption time: The time taken to decrypt the message.
  - Memory consumed: The amount of memory consumed by the algorithm.

**Files**

The project consists of the following files:
- index.html: The HTML file that defines the structure of the web application.
- server.js: The server file that handles HTTP requests and performs the analysis.
- results.js: The file that contains the analysis functions for each algorithm.

**Contribution**


Feel free to customize the documentation as per your project requirements and add any additional sections if needed.
