import Dexie, { EntityTable } from 'dexie';

export type TotpAlgorithm = 'SHA1' | 'SHA224' | 'SHA256' | 'SHA384'
    | 'SHA512' | 'SHA3-224' | 'SHA3-256' | 'SHA3-384' | 'SHA3-512'
;

export const totpAlgorithms: TotpAlgorithm[] = [
    'SHA1', 'SHA224', 'SHA256', 'SHA384', 'SHA512',
    'SHA3-224', 'SHA3-256', 'SHA3-384', 'SHA3-512'
];

export interface Code {
    id: number;
    algorithm: TotpAlgorithm;
    digits: number;
    name: string;
    period: number;
    secret: string;
}

const db = new Dexie('Codes') as Dexie & {
    codes: EntityTable<Code, 'id'>;
};

db.version(1).stores({
    codes: '++id,name,secret,algorithm,digits,period'
});

export async function add(code: Omit<Code, 'id'>): Promise<number> {
    return await db.codes.add(code);
}

export async function edit(code: Code): Promise<void> {
    await db.codes.put(code);
}

export async function getAll(): Promise<Code[]> {
    return await db.codes.toArray();
}

export async function get(id: number): Promise<Code | undefined> {
    return await db.codes.get(id);
}

export async function remove(id: number): Promise<void> {
    await db.codes.delete(id);
}
