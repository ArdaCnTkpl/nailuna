import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Public routes: auth ve marketing/legal (Stripe: site şifresiz erişilebilir olmalı)
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/pricing",
  "/privacy",
  "/terms",
  "/contact",
  "/commerce-disclosure",
]);

// Sadece /urun korumalı; yukarıdakiler herkese açık
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

