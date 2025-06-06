import { ERROR_MESSAGES } from './validation';

// Encryption key (should be stored securely in production)
const ENCRYPTION_KEY = 'your-secret-key';
const SALT = 'your-salt';

// Convert string to Uint8Array
const stringToUint8Array = (str: string): Uint8Array => {
    return new TextEncoder().encode(str);
};

// Convert Uint8Array to string
const uint8ArrayToString = (arr: Uint8Array): string => {
    return new TextDecoder().decode(arr);
};

// Generate encryption key from password
const getKey = async (): Promise<CryptoKey> => {
    const keyMaterial = await window.crypto.subtle.importKey(
        'raw',
        stringToUint8Array(ENCRYPTION_KEY),
        { name: 'PBKDF2' },
        false,
        ['deriveKey']
    );

    return window.crypto.subtle.deriveKey(
        {
            name: 'PBKDF2',
            salt: stringToUint8Array(SALT),
            iterations: 100000,
            hash: 'SHA-256'
        },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt', 'decrypt']
    );
};

// Encrypt data
const encrypt = async (data: string): Promise<string> => {
    try {
        const key = await getKey();
        const iv = window.crypto.getRandomValues(new Uint8Array(12));
        const encryptedData = await window.crypto.subtle.encrypt(
            {
                name: 'AES-GCM',
                iv
            },
            key,
            stringToUint8Array(data)
        );

        // Combine IV and encrypted data
        const combined = new Uint8Array(iv.length + encryptedData.byteLength);
        combined.set(iv);
        combined.set(new Uint8Array(encryptedData), iv.length);

        // Convert to base64 for storage
        return btoa(String.fromCharCode(...combined));
    } catch (error) {
        console.error('Encryption failed:', error);
        throw new Error(ERROR_MESSAGES.SERVER_ERROR);
    }
};

// Decrypt data
const decrypt = async (encryptedData: string): Promise<string> => {
    try {
        const key = await getKey();
        const combined = new Uint8Array(
            atob(encryptedData)
                .split('')
                .map((c) => c.charCodeAt(0))
        );

        // Extract IV and encrypted data
        const iv = combined.slice(0, 12);
        const data = combined.slice(12);

        const decryptedData = await window.crypto.subtle.decrypt(
            {
                name: 'AES-GCM',
                iv
            },
            key,
            data
        );

        return uint8ArrayToString(new Uint8Array(decryptedData));
    } catch (error) {
        console.error('Decryption failed:', error);
        throw new Error(ERROR_MESSAGES.SERVER_ERROR);
    }
};

export const secureStorage = {
    setItem: async (key: string, value: string): Promise<void> => {
        try {
            const encryptedValue = await encrypt(value);
            localStorage.setItem(key, encryptedValue);
        } catch (error) {
            console.error('Failed to set item:', error);
            throw new Error(ERROR_MESSAGES.SERVER_ERROR);
        }
    },

    getItem: async (key: string): Promise<string | null> => {
        try {
            const encryptedValue = localStorage.getItem(key);
            if (!encryptedValue) return null;
            return await decrypt(encryptedValue);
        } catch (error) {
            console.error('Failed to get item:', error);
            throw new Error(ERROR_MESSAGES.SERVER_ERROR);
        }
    },

    removeItem: (key: string): void => {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error('Failed to remove item:', error);
            throw new Error(ERROR_MESSAGES.SERVER_ERROR);
        }
    },

    clear: (): void => {
        try {
            localStorage.clear();
        } catch (error) {
            console.error('Failed to clear storage:', error);
            throw new Error(ERROR_MESSAGES.SERVER_ERROR);
        }
    }
}; 