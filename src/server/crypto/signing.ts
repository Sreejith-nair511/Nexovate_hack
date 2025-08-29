import * as nacl from 'tweetnacl';
import * as naclUtil from 'tweetnacl-util';
import * as crypto from 'crypto-js';
import { promises as fs } from 'fs';
import path from 'path';

export interface KeyPair {
  publicKey: string;
  privateKey: string;
}

export interface SignedPayload {
  payload: any;
  payloadHash: string;
  signature: string;
  signerPublicKey: string;
  timestamp: number;
}

// Ensure data directory exists
const DATA_DIR = path.join(process.cwd(), 'data', 'keys');

async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (error) {
    // Directory might already exist
  }
}

/**
 * Generate a new keypair for an organization
 */
export async function generateKeypairForOrg(orgId: string): Promise<KeyPair> {
  await ensureDataDir();
  
  const keyPair = nacl.sign.keyPair();
  const publicKey = naclUtil.encodeBase64(keyPair.publicKey);
  const privateKey = naclUtil.encodeBase64(keyPair.secretKey);
  
  // Store keys in development (in production, use secure key management)
  const keyData = {
    orgId,
    publicKey,
    privateKey,
    createdAt: new Date().toISOString()
  };
  
  const keyPath = path.join(DATA_DIR, `${orgId}.json`);
  await fs.writeFile(keyPath, JSON.stringify(keyData, null, 2));
  
  return { publicKey, privateKey };
}

/**
 * Load keypair for an organization
 */
export async function loadKeypairForOrg(orgId: string): Promise<KeyPair | null> {
  try {
    const keyPath = path.join(DATA_DIR, `${orgId}.json`);
    const keyData = JSON.parse(await fs.readFile(keyPath, 'utf-8'));
    return {
      publicKey: keyData.publicKey,
      privateKey: keyData.privateKey
    };
  } catch (error) {
    return null;
  }
}

/**
 * Get or create keypair for an organization
 */
export async function getOrCreateKeypair(orgId: string): Promise<KeyPair> {
  let keyPair = await loadKeypairForOrg(orgId);
  if (!keyPair) {
    keyPair = await generateKeypairForOrg(orgId);
  }
  return keyPair;
}

/**
 * Create canonical JSON representation for consistent hashing
 */
export function createCanonicalPayload(payload: any): string {
  // Sort keys recursively for consistent hashing
  const sortKeys = (obj: any): any => {
    if (obj === null || typeof obj !== 'object') return obj;
    if (Array.isArray(obj)) return obj.map(sortKeys);
    
    return Object.keys(obj)
      .sort()
      .reduce((result: any, key: string) => {
        result[key] = sortKeys(obj[key]);
        return result;
      }, {});
  };
  
  return JSON.stringify(sortKeys(payload));
}

/**
 * Compute SHA-256 hash of payload
 */
export function computePayloadHash(payload: any): string {
  const canonical = createCanonicalPayload(payload);
  return crypto.SHA256(canonical).toString();
}

/**
 * Sign a payload with private key
 */
export function signPayload(privateKey: string, payload: any): SignedPayload {
  const payloadHash = computePayloadHash(payload);
  const timestamp = Date.now();
  
  // Create message to sign (hash + timestamp for replay protection)
  const message = `${payloadHash}:${timestamp}`;
  const messageBytes = naclUtil.decodeUTF8(message);
  
  const privateKeyBytes = naclUtil.decodeBase64(privateKey);
  const signature = nacl.sign.detached(messageBytes, privateKeyBytes);
  
  return {
    payload,
    payloadHash,
    signature: naclUtil.encodeBase64(signature),
    signerPublicKey: naclUtil.encodeBase64(privateKeyBytes.slice(32)), // Extract public key
    timestamp
  };
}

/**
 * Verify signature of a signed payload
 */
export function verifySignature(
  publicKey: string, 
  payload: any, 
  signature: string, 
  timestamp: number
): boolean {
  try {
    const expectedHash = computePayloadHash(payload);
    const message = `${expectedHash}:${timestamp}`;
    const messageBytes = naclUtil.decodeUTF8(message);
    
    const publicKeyBytes = naclUtil.decodeBase64(publicKey);
    const signatureBytes = naclUtil.decodeBase64(signature);
    
    return nacl.sign.detached.verify(messageBytes, signatureBytes, publicKeyBytes);
  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
}

/**
 * Verify a complete signed payload
 */
export function verifySignedPayload(signedPayload: SignedPayload): boolean {
  const { payload, payloadHash, signature, signerPublicKey, timestamp } = signedPayload;
  
  // Verify payload hash
  const expectedHash = computePayloadHash(payload);
  if (expectedHash !== payloadHash) {
    return false;
  }
  
  // Verify signature
  return verifySignature(signerPublicKey, payload, signature, timestamp);
}

/**
 * Get all organization public keys (for verification)
 */
export async function getAllOrgPublicKeys(): Promise<Record<string, string>> {
  await ensureDataDir();
  
  try {
    const files = await fs.readdir(DATA_DIR);
    const publicKeys: Record<string, string> = {};
    
    for (const file of files) {
      if (file.endsWith('.json')) {
        const orgId = file.replace('.json', '');
        const keyData = JSON.parse(await fs.readFile(path.join(DATA_DIR, file), 'utf-8'));
        publicKeys[orgId] = keyData.publicKey;
      }
    }
    
    return publicKeys;
  } catch (error) {
    return {};
  }
}
