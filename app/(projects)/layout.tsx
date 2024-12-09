import { auth } from "@/auth";
import { SideNav, MobileSideNav } from "@/components/side-nav";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="flex gap-10">
      {/* Desktop Sidebar - Hidden on mobile */}
      <div className="hidden md:block">
        <SideNav user={session.user} />
      </div>

      {/* Mobile Sidebar Toggle - Visible on mobile */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <MobileSideNav user={session.user} />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-16 mt-0 md:mt-0">
        {children}
      </main>
    </div>
  );
}
