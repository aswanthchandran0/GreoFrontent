import { toast } from "react-toastify";

export  function base64ToArrayBuffer(base64:string):ArrayBuffer{
  const binaryString = window.atob(base64)
  const len = binaryString.length
  const bytes = new Uint8Array(len)
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }
  return bytes.buffer
}
export async function encryptMessage(message: string, publicKey: CryptoKey): Promise<ArrayBuffer> {
  const encodedMessage = new TextEncoder().encode(message);
  const encryptedMessage = await window.crypto.subtle.encrypt(
    {
      name: "RSA-OAEP"
    },
    publicKey,
    encodedMessage
  );
  return encryptedMessage;
}


export async function decryptMessage(encryptedMessage: ArrayBuffer, privateKey: CryptoKey): Promise<string> {
  const decryptedMessage = await window.crypto.subtle.decrypt(
    {
      name: "RSA-OAEP"
    },
    privateKey,
    encryptedMessage
  );

  const decodedMessage = new TextDecoder().decode(decryptedMessage);
  toast.success(`Decrypted message: ${decodedMessage}`)
  console.log('Decrypted message:', decodedMessage); // Log the decrypted message
  return decodedMessage;
}
