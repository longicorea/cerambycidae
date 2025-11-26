import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

// 허용된 관리자 이메일 목록
const ALLOWED_ADMINS = (process.env.ALLOWED_ADMIN_EMAILS || "").split(",").map(e => e.trim().toLowerCase());

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      // 허용된 이메일만 로그인 가능
      const email = user.email?.toLowerCase();
      if (!email) return false;

      // ALLOWED_ADMINS가 비어있으면 모든 사용자 허용 (개발용)
      if (ALLOWED_ADMINS.length === 0 || ALLOWED_ADMINS[0] === "") {
        return true;
      }

      return ALLOWED_ADMINS.includes(email);
    },
    async session({ session, token }) {
      // 세션에 사용자 정보 추가
      if (session.user && token.sub) {
        session.user.id = token.sub;
        session.user.isAdmin = true; // 로그인 성공한 사용자는 모두 관리자
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
})
