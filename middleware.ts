import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Ürün sayfasını (ve ileride ekleyeceğin dashboard vb.) login zorunlu yapalım
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

