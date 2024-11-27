import 'dotenv/config';
import { webcrypto } from "node:crypto";
import {userTable, sessionTable} from './src/db/schema'
import { db } from './src/db/client';
import { sql } from 'drizzle-orm/sql';


const users = await db.select({
    test: sql<string>`lower(${userTable.id})`
}).from(userTable);
console.log(users);