import type { User, Session } from "./db/schema";
import { webcrypto } from 'node:crypto';
import {db} from './db/client';
import { userTable, sessionTable } from './db/schema';
import { eq } from "drizzle-orm";

export function generateSessionToken(): string {
    return webcrypto.randomUUID();
}

export async function createSession(token: string, userId: number): Promise<Session> {
   const sessionId =  await webcrypto.subtle.digest('SHA-256', new TextEncoder().encode(token));
   const session: Session = {
    id: Buffer.from(sessionId).toString('hex'),
    userId,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
};
await db.insert(sessionTable).values(session)
    return session;
}

export async function validateSessionToken(token: string): Promise<SessionValidationResult> {
	const sessionId =  await webcrypto.subtle.digest('SHA-256', new TextEncoder().encode(token));
    const sessionIDHex =  Buffer.from(sessionId).toString('hex');

    const result = await db.select({
        session: sessionTable,
        user: userTable
    })
    .from(sessionTable)
        .innerJoin(userTable, eq(sessionTable.userId, userTable.id))
    .where(eq(sessionTable.id, sessionIDHex));
    if(result.length <1){
        return {session: null, user: null}
    }
    const { user, session} = result[0];
    if(Date.now() >= session.expiresAt.getTime()){
        await db.delete(sessionTable).where(eq(sessionTable.id, sessionIDHex));
        return {session: null, user: null}
    }
    const halfMonth =  1000 * 60 * 60 * 24 * 15
    if( Date.now() >= session.expiresAt.getTime() - halfMonth){
        session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
        await db.update(sessionTable).set(
            {
                expiresAt: session.expiresAt
            }
        ).where(eq(sessionTable.id, sessionIDHex));
    }

    return {
        session, user
    }

}

export async function invalidateSession(sessionId: string): Promise<void> {
	await db.delete(sessionTable).where(eq(sessionTable.id, sessionId));
}

export type SessionValidationResult =
	| { session: Session; user: User }
	| { session: null; user: null };