import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { dash } from "@better-auth/infra";
import { organization } from "better-auth/plugins";
import { MongoClient } from "mongodb";

const client = new MongoClient(`${process.env.DATABASE_URL}`);
await client.connect();
const db = client.db();

export const auth = betterAuth({
  // BETTER_AUTH_URL must be the app base URL — no trailing slash, no /api/auth suffix.
  // e.g. https://accessforge-monorepo.onrender.com
  baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:5000",

  trustedOrigins: (process.env.CORS_ORIGIN ?? "http://localhost:3000").split(","),

  database: mongodbAdapter(db),
  secret: process.env.BETTER_AUTH_SECRET,

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },

  socialProviders: {
    google: {
      clientId: process.env.CLIENT_ID as string,
      clientSecret: process.env.CLIENT_SECRET as string,
    },
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "employee",
        // input: true allows the client to pass role during sign-up.
        // In a stricter setup, set this to false and assign roles server-side.
        input: true,
      },
    },
  },

  plugins: [
    dash(),
    organization({
      allowUserToCreateOrganization: true,
    }),
  ],
});

export type AuthUser = (typeof auth.$Infer.Session)["user"];
export type AuthSession = typeof auth.$Infer.Session;
