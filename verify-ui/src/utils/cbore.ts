import { decode } from "cbor-web";

function mapToObject(map: Map<any, any>): any {
  const obj: Record<string, any> = {};
  map.forEach((value, key) => {
    const k = typeof key === "string" ? key : String(key);
    obj[k] = value instanceof Map ? mapToObject(value) : value;
  });
  return obj;
}

export function decodeIssuerSignedNameSpaces(
  document: any
): Record<string, any> {
  const result: Record<string, any> = {};
  const entries = document?.issuerSigned?.nameSpaces?.["org.iso.18013.5.1"];

  if (!Array.isArray(entries)) {
    console.warn("No valid ISO 18013 namespace found");
    return result;
  }

  console.log(`🔍 Found ${entries.length} CBOR-tagged entries`);

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];

    if (entry?.tag !== 24 || !(entry.value instanceof Uint8Array)) {
      console.warn(`⛔️ Skipping invalid entry at index ${i}:`, entry);
      continue;
    }

    try {
      const decoded = decode(entry.value);

      const obj = decoded instanceof Map ? mapToObject(decoded) : decoded;
      if (obj.elementIdentifier && obj.elementValue !== undefined) {
        result[obj.elementIdentifier] = obj.elementValue;
      }

      console.log(`✅ Decoded CBOR @ index ${i}:`, obj);
    } catch (err) {
      console.error(`❌ CBOR decode failed at index ${i}:`, err);
    }
  }

  return result;
}
