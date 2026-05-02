import React from "react";
import NavigationRail from "@/components/NavigationRail";
import MobileNavigation from "@/components/MobileNavigation";
import Header from "@/components/Header";
import { getCurrentUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import { Toaster } from "@/components/ui/toaster";

export const dynamic = "force-dynamic";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const currentUser = await getCurrentUser();
  console.log("Layout: Current User retrieved:", currentUser ? "Yes" : "No, redirecting");

  if (!currentUser) return redirect("/api/auth/clear-session");

  return (
    <main className="flex h-screen">
      <NavigationRail />

      <section className="flex h-full flex-1 flex-col">
        <MobileNavigation {...currentUser} />
        <Header />
        <div className="main-content">{children}</div>
      </section>

      <Toaster />
    </main>
  );
};

export default Layout;

