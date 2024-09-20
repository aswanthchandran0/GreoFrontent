import { toast } from "react-toastify"

export async function generateKeyPair() {
  const keyPair = await window.crypto.subtle.generateKey({
    name: 'RSA-OAEP',
    modulusLength: 2048,
    publicExponent: new Uint8Array([1, 0, 1]),
    hash: 'SHA-256'
  },
    true,
    ['encrypt', 'decrypt']
  )


  return keyPair
}

export async function storePrivateKey(privateKey: CryptoKey) {
  const exportedPrivateKey = await window.crypto.subtle.exportKey('pkcs8', privateKey)

  const dbRequest = window.indexedDB.open('userKeyDB', 1)

  dbRequest.onupgradeneeded = (event) => {
    const db = (event.target as IDBOpenDBRequest).result
    db.createObjectStore('keys', { keyPath: 'id' })
    console.log('Database upgrade: Object store created');
  }

  dbRequest.onsuccess = () => {
    const db = dbRequest.result
    const transaction = db.transaction('keys', 'readwrite')
    const store = transaction.objectStore('keys')
    store.put({ id: 'privateKey', key: exportedPrivateKey })
  }

  dbRequest.onerror = (error) => {
    console.error('Error opening IndexedDB:', error);
    toast.error(`error opening indexedDB ${error}`)

  }
}

export async function exportPublicKey(publicKey: CryptoKey): Promise<string> {
  const exportedPublicKey = await window.crypto.subtle.exportKey('spki', publicKey)
  const publicKeyPem = convertArrayBufferToPem(exportedPublicKey, 'PUBLIC KEY')
  return publicKeyPem
}

function convertArrayBufferToPem(buffer: ArrayBuffer, label: string): string {
  const base64String = window.btoa(String.fromCharCode(...new Uint8Array(buffer)))
  const pemString = `-----BEGIN ${label}-----\n${base64String}\n-----END ${label}-----`
  return pemString
}



export async function removePrivateKey() {
  const dbRequest = window.indexedDB.open('userKeyDB', 1)

  dbRequest.onupgradeneeded = (event) => {
    const db = (event.target as IDBOpenDBRequest).result
    if (db.objectStoreNames.contains('keys')) {
      db.deleteObjectStore('keys')
    }
  }

  dbRequest.onsuccess = () => {
    const db = dbRequest.result
    const transaction = db.transaction('keys', 'readwrite')
    const store = transaction.objectStore('keys')
    store.delete('privateKey')
  }

  dbRequest.onerror = () => {
    console.error('Error removing private key from IndexedDB')
  }
}


// IndexedDB utility for retrieving private key
export const getPrivateKey = async (): Promise<ArrayBuffer | null> => {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open("userKeyDB", 1);

    request.onerror = (event) => {
      console.error("IndexedDB error:", event);
      reject(null);
    };

    request.onsuccess = (event) => {
      const db = request.result;
      const transaction = db.transaction(["keys"], "readonly");
      const objectStore = transaction.objectStore("keys");
      const keyRequest = objectStore.get("privateKey");

      keyRequest.onerror = (event) => {
        console.error("Error fetching private key:", event);
        reject(null);
      };

      keyRequest.onsuccess = (event) => {
        if (!keyRequest.result) {
          console.error("Private key not found in IndexedDB");
          resolve(null);
        } else {
          resolve(keyRequest.result.key); // Ensure we're fetching the 'key' from the stored object
        }
      };
    };

    request.onupgradeneeded = (event) => {
      const db = request.result;
      if (!db.objectStoreNames.contains("keys")) {
        db.createObjectStore("keys", { keyPath: "id" });
      }
    };
  });
};


export async function importPublicKeyFromPem(pem: string): Promise<CryptoKey> {

  if (typeof pem !== 'string') {
    throw new TypeError("Expected pem to be a string");
  }
  const pemHeader = "-----BEGIN PUBLIC KEY-----";
  const pemFooter = "-----END PUBLIC KEY-----";
  const pemContents = pem.substring(pemHeader.length, pem.length - pemFooter.length);
  const binaryDerString = window.atob(pemContents)
  const binaryDer = str2ab(binaryDerString);

  return window.crypto.subtle.importKey(
    "spki",
    binaryDer,
    {
      name: "RSA-OAEP",
      hash: "SHA-256",
    },
    true,
    ["encrypt"]
  );
}




function str2ab(str: string): ArrayBuffer {
  const buf = new ArrayBuffer(str.length);
  const bufView = new Uint8Array(buf);
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}


export async function importPrivateKeyFromPem(pem: string): Promise<CryptoKey> {
  const pemHeader = "-----BEGIN PRIVATE KEY-----";
  const pemFooter = "-----END PRIVATE KEY-----";
  const pemContents = pem.substring(pemHeader.length, pem.length - pemFooter.length);
  const binaryDerString = window.atob(pemContents);
  const binaryDer = str2ab(binaryDerString);

  return window.crypto.subtle.importKey(
    "pkcs8",
    binaryDer,
    {
      name: "RSA-OAEP",
      hash: "SHA-256",
    },
    true,
    ["decrypt"]
  );
}

export async function importPrivateKeyFromArrayBuffer(arrayBuffer: ArrayBuffer): Promise<CryptoKey> {
  return window.crypto.subtle.importKey(
    "pkcs8",
    arrayBuffer,
    {
      name: "RSA-OAEP",
      hash: "SHA-256",
    },
    true,
    ["decrypt"]
  );
}