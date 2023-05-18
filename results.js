const rsaAnalysis = (message) => {
    const forge = require('node-forge');
    const crypto = require('crypto');
    const { performance } = require('perf_hooks');

    
    var startKeyTime = performance.now();
    // Generate a new RSA key pair
    const keypair = forge.pki.rsa.generateKeyPair({ bits: 4096 });
    var endKeyTime = performance.now();
    const rsaRanTime = endKeyTime - startKeyTime;


    var startKeyTime = performance.now();
    //Create encryption key and iv
    const encryptionKey = crypto.randomBytes(32);
    const encryptionKeyString = encryptionKey.toString('hex');
    const iv = crypto.randomBytes(16);
    var endKeyTime = performance.now();
    const aesRanTime = endKeyTime - startKeyTime;
    console.log("Encryption key aes : ",encryptionKey);


    // Get the size of the public key in bytes
    const publicKeyBytes = forge.pki.publicKeyToPem(keypair.publicKey).length;
    
    // Get the size of the private key in bytes
    const privateKeyBytes = forge.pki.privateKeyToPem(keypair.privateKey).length;
    
    console.log("Private Key size : " ,privateKeyBytes);
    console.log("Public key size : " ,publicKeyBytes);
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    // AES Encryption
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(encryptionKey), iv);
    let aes_encrypted = cipher.update(message, 'utf8', 'base64');
    aes_encrypted += cipher.final('base64');

    // RSA Encryption of AES encrypted text
    var startKeyTime = performance.now();
    const encrypted = keypair.publicKey.encrypt(encryptionKeyString);
    var endKeyTime = performance.now();
    const rsaEncTime = endKeyTime - startKeyTime;

    // RSA Decryption of RSA encrypted text
    var startKeyTime = performance.now();  
    const decryptedString = keypair.privateKey.decrypt(encrypted);
    const decrypted = Buffer.from(decryptedString, 'hex');
    var endKeyTime = performance.now();
    const rsaDecTime = endKeyTime - startKeyTime;
  
    // AES Decryption of RSA Decrypted text
    var startKeyTime = performance.now();
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(decrypted), iv);
    let aes_decrypted = decipher.update(aes_encrypted, 'base64', 'utf8');
    aes_decrypted += decipher.final('utf8');
    var endKeyTime = performance.now();
    const aesDecTime = endKeyTime - startKeyTime;
  

    // Log the AES decrypted text and the time taken by each step
    // console.log('\nDecrypted message: ' + aes_decrypted);

    // console.log(`RSA key generation time: ${rsaRanTime}ms`);

    // console.log(`RSA encryption time: ${rsaEncTime}ms`);
    // console.log(`RSA decryption time: ${rsaDecTime}ms`);

    return { aes_decrypted, aesRanTime, rsaRanTime, rsaEncTime, rsaDecTime, aesDecTime };
};



const mcelieceAnalysis = (message) => {

    var mceliece = require("./mceliece");

    const crypto = require('crypto');

    // Generate a 32-byte AES key
    const encryptionKey = crypto.randomBytes(32);
    const iv = crypto.randomBytes(16);

    // Start measuring keygen time
    const keygenStartTime = performance.now();

    // Generate a McEliece key pair
    const keyPair = mceliece.keyPair();

    // Stop measuring keygen time
    const keygenEndTime = performance.now();
    const keygenTime = keygenEndTime - keygenStartTime;

    // Encrypt the message using the AES key
    const cipher = crypto.createCipheriv('aes-256-cbc', encryptionKey, iv);
    let aesEncrypted = cipher.update(message, 'utf8', 'base64');
    aesEncrypted += cipher.final('base64');

    // Start measuring encryption time
    const encryptionStartTime = performance.now();
    
    // Encrypt the AES key using McEliece
    const aesKeyArray = new Uint8Array(encryptionKey);
    const encryptedAesKey = mceliece.encrypt(aesKeyArray, keyPair.publicKey);
    // Stop measuring encryption time
    const encryptionEndTime = performance.now();
    const encryptionTime = encryptionEndTime - encryptionStartTime;

    // Start measuring decryption time
    const decryptionStartTime = performance.now();

    // Decrypt the AES key using McEliece
    const decryptedAesKeyArray = mceliece.decrypt(encryptedAesKey, keyPair.privateKey);
    const decryptedAesKey = Buffer.from(decryptedAesKeyArray).toString('hex');

    // Stop measuring decryption time
    const decryptionEndTime = performance.now();
    const decryptionTime = decryptionEndTime - decryptionStartTime;

    // Decrypt the message using the decrypted AES key
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(decryptedAesKey, 'hex'), iv);
    let aesDecrypted = decipher.update(aesEncrypted, 'base64', 'utf8');
    aesDecrypted += decipher.final('utf8');



    console.log('Mceliece decrypted message: ' + aesDecrypted);
    console.log('keygen time: ' + keygenTime + 'ms');
    console.log('encryption time: ' + encryptionTime + 'ms');
    console.log('decryption time: ' + decryptionTime + 'ms');

    return { aesDecrypted, keygenTime, encryptionTime, decryptionTime };
};

const kyberAnalysis = (message) => {
    const crypto = require('crypto');
    const kyber = require('crystals-kyber');

    // Start measuring keygen time
    const keygenStartTime = performance.now();

    // To generate a public and private key pair (pk, sk)Kyber
    const pk_sk = kyber.KeyGen768();
    const pk = pk_sk[0];
    const sk = pk_sk[1];

    // Stop measuring keygen time
    const keygenEndTime = performance.now();
    const keygenTime = keygenEndTime - keygenStartTime;

    // Start measuring encryption time
    const encryptionStartTime = performance.now();

    // To generate a random 256 bit symmetric key (ss) and its encapsulation (c)
    const c_ss = kyber.Encrypt768(pk);
    const c = c_ss[0];
    const ss1 = c_ss[1];
    // Stop measuring encryption time
    const encryptionEndTime = performance.now();
    const encryptionTime = encryptionEndTime - encryptionStartTime;

    const iv = crypto.randomBytes(16); // 128-bit initialization vector

    // Generate a new initialization vector for each message
    const newIv = crypto.randomBytes(16);

    // Encrypt the message with the symmetric key and the new initialization vector
    const cipher = crypto.createCipheriv('aes-256-cbc', ss1, newIv);
    let encrypted = cipher.update(message, 'utf8', 'base64');
    encrypted += cipher.final('base64');

    // Start measuring decryption time
    const decryptionStartTime = performance.now();

    // Generate a new symmetric key using the encapsulation and the private key
    const ss2 = kyber.Decrypt768(c, sk);

    // Stop measuring decryption time
    const decryptionEndTime = performance.now();
    const decryptionTime = decryptionEndTime - decryptionStartTime;
    
    // Decrypt the message with the new symmetric key and the new initialization vector
    const decryptedCipher = crypto.createDecipheriv('aes-256-cbc', ss2, newIv);
    let decrypted = decryptedCipher.update(encrypted, 'base64', 'utf8');
    decrypted += decryptedCipher.final('utf8');



    console.log('decrypted message: ' + decrypted);
    console.log('keygen time: ' + keygenTime + 'ms');
    console.log('encryption time: ' + encryptionTime + 'ms');
    console.log('decryption time: ' + decryptionTime + 'ms');

    return { decrypted, keygenTime, encryptionTime, decryptionTime };
}

module.exports = { rsaAnalysis, mcelieceAnalysis, kyberAnalysis };

