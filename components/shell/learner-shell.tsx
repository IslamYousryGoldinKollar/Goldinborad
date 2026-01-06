import { TopBar } from "@/components/ui/topbar";
import { LearnerNav } from "@/components/navigation/learner-nav";

export function LearnerShell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <TopBar />
      <main className="layout-grid" style={{ flex: 1 }}>
        {children}
      </main>
      <LearnerNav />
    </div>
  );
}
