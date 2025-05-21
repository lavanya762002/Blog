import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from '@/app/db';
 
export const authOptions = {
  adapter: MongoDBAdapter(clientPromise),
 
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
 
        const client = await clientPromise;
        const db = client.db("blog");
        const user =  await db.collection('users').find({"name" : credentials.username}).toArray();
 
        if (
          credentials.username === user[0].name &&
          credentials.password === user[0].password
        ) {
          return user[0];
        }
        return null;
      },
    }),
  ],
 
  session: {
    strategy: "jwt",
  },
 
  callbacks: {
    async jwt({ token, user }) {
 
      if (user) {
        token.id = user._id;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
 
    async session({ session, token }) {

        console.log(session);
        console.log(token);
 
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
      }
      return session;
    },
  },
 
  secret: process.env.NEXTAUTH_SECRET,
};
 
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };