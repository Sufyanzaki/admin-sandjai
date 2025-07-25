import {NextAuthOptions} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth from "next-auth/next";
import {z} from "zod";
import { postOtp } from "@/app/auth/_api/postOtp";


const otpSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  otp: z.string().min(5, { message: "otp must be at least 5 characters" }),
});

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        otp: { label: "Otp", type: "text" }
      },
      async authorize(credentials) {
        try {
          const parsedCredentials = otpSchema.safeParse(credentials);
          if (!parsedCredentials.success) {
            throw new Error(JSON.stringify(parsedCredentials.error.flatten().fieldErrors));
          }

          const { email, otp } = parsedCredentials.data;

          const response = await postOtp({ email, otp });
          
console.log(response)

          if(!response) return null;

          return {
            id: response.user?.id || "1",
            name: response.user?.name || "User",
            email: response.user?.email || email,
            role: response.user?.role || "user",
            token: response.token,
          };
        } catch (error: any) {
          console.error('Authorization error:', error.message);
          throw new Error(error.message || "Invalid OTP");
        }
      }
    })
  ],
  pages: {
    signIn: "/auth/otp",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
        token.token = user.token;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.name = token.name as string;
      session.user.email = token.email as string;
      session.user.role = token.role as string;
      session.token = token.token as string;
      
      return session;
    },
  },

  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };