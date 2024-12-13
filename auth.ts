import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { getUser } from "./app/controllers/users";


export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  trustHost: true,
  providers: [
    Credentials({
     
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      authorize: async (credentials) => {
      
          const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(2) })
          .safeParse(credentials);
        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);
          if (!user) return null;
          const passwordsMatch = bcrypt.compareSync(password, user.password);
          if (passwordsMatch) return user;
        }
              
        // console.error("Invalid credentials");
        throw new Error("Invalid credentials");
        // return null;
        
      },
    }),
  ],
});


