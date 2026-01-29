import { ReactNode } from "react";
import { AppSidebar } from "./AppSidebar";
import { SidebarProvider, useSidebarContext } from "./SidebarContext";
import { cn } from "@/lib/utils";

interface MainLayoutProps {
  children: ReactNode;
}

function MainContent({ children }: { children: ReactNode }) {
  const { collapsed } = useSidebarContext();
  
  return (
    <main 
      className={cn(
        "flex-1 overflow-auto transition-all duration-300",
        collapsed ? "lg:ml-[72px]" : "lg:ml-[256px]",
        "ml-0" // mobile: no margin (sidebar overlays)
      )}
    >
      {children}
    </main>
  );
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <MainContent>{children}</MainContent>
      </div>
    </SidebarProvider>
  );
}
