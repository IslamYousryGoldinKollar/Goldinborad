import { AdminNav } from "@/components/navigation/admin-nav";
import { TopBar } from "@/components/ui/topbar";

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-shell">
      <AdminNav />
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <TopBar />
        <main className="admin-content">{children}</main>
      </div>
    </div>
  );
}
