import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Sadece /urun korumalı. Anasayfa (/), /sign-in, /sign-up, /terms, /privacy vb. herkese açık
// (Stripe: "Website must be accessible and not password-protected" gereksinimi)
const isProtectedRoute = createRouteMatcher(["/urun(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Clerk dokümanlarındaki önerilen matcher
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};

