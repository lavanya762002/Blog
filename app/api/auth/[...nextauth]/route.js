import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "email@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log(" Authorizing user with credentials:", credentials);

        const res = await fetch(`${process.env.NEXTAUTH_URL}/api/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
        });

        const data = await res.json();
        console.log(" Login API response:", data);

        if (!res.ok || !data.success) {
          throw new Error(data.error || "Invalid credentials");
        }

        return {
          id: data.user.id,
          email: data.user.email,
          username: data.user.username,
          role: data.user.role,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 1 day
  },
  callbacks: {
    async jwt({ token, user }) {
     // console.log("" JWT callback - before:", token);
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.username = user.username;
        token.role = user.role;
      }
      //console.log(" JWT callback - after:", token);
      return token;
    },
    async session({ session, token }) {
  
      session.user = {
        id: token.id,
        email: token.email,
        username: token.username,
        role: token.role,
      };
      console.log("Session callback - session.user:", session.user );
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
