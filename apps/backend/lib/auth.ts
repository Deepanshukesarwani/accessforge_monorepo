import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { dash } from "@better-auth/infra";
import { MongoClient } from "mongodb";

const client = new MongoClient(`${process.env.DATABASE_URL}`);
await client.connect();
const db = client.db();
export const auth = betterAuth({
  database: mongodbAdapter(db),
  secret: process.env.BETTER_AUTH_SECRET,
  emailAndPassword: {
    enabled: true,
  },
  plugins: [dash()],
});