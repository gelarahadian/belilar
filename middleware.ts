import { auth } from "./auth";
import authConfig from "./auth.config";
import NextAuth from "next-auth";
// export const { auth: middleware } = NextAuth(authConfig);

export default auth((req) => {
  console.log("req.auth ===>", req.auth);

  if (!req.auth) {
    if (req.nextUrl.pathname.startsWith("/dashboard")) {
      const newUrl = new URL("sign-in", req.nextUrl.origin);
      return Response.redirect(newUrl);
    }
  } else {
    if (
      req.nextUrl.pathname.startsWith("/sign-in") ||
      req.nextUrl.pathname.startsWith("/sign-up")
    ) {
      const newUrl = new URL("/", req.nextUrl.origin);
      return Response.redirect(newUrl);
    }

    if (
      req.auth?.user.role === "admin" &&
      req.nextUrl.pathname === "/dashboard"
    ) {
      const newUrl = new URL("/dashboard/admin/tag", req.nextUrl.origin);
      return Response.redirect(newUrl);
    }

    if (
      req.auth?.user.role === "user" &&
      req.nextUrl.pathname === "/dashboard"
    ) {
      const newUrl = new URL("/dashboard/user/order", req.nextUrl.origin);
      return Response.redirect(newUrl);
    }
  }

  //   if (!req.auth && req.nextUrl.pathname !== "/login") {
  //     const newUrl = new URL("/login", req.nextUrl.origin);
  //     return Response.redirect(newUrl);
  //   }
});
