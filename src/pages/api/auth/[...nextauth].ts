import { fauna } from "@/services/fauna";
import { query as q } from "faunadb";
import { AuthOptions, Account, Profile, User } from "next-auth";
import NextAuth from "next-auth/next";
import GithubProvider from "next-auth/providers/github";

interface SignInParams {
  user: User;
  account: Account | null;
  profile?: Profile;
  email?: { verificationRequest?: boolean };
  credentials?: Record<string, any>;
}

export const authOptions: AuthOptions = {
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID ?? "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
      authorization: {
        params: {
          scope: "read:user",
        },
      },
    }),
    // ...add more providers here
  ],
  callbacks: {
    async signIn(params: SignInParams) {
      const { user, account, profile } = params;

      const { email } = user;

      try {
        await fauna.query(
          q.If(
            q.Not(
              q.Exists(
                q.Match(
                  q.Index("user_by_email"),
                  q.Casefold(email ?? "") // use empty string as default value if email is null or undefined
                )
              )
            ),
            q.Create(q.Collection("users"), { data: { email } }),
            q.Get(
              q.Match(
                q.Index("user_by_email"),
                q.Casefold(email ?? "") // use empty string as default value if email is null or undefined
              )
            )
          )
        );

        return true;
      } catch (err) {
        return false;
      }
    },
  },
};

export default NextAuth(authOptions);
