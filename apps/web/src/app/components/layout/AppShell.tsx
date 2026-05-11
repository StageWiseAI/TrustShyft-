import { NavLink, Outlet } from "react-router-dom";
import { PHASE_1_NAV } from "@trustshyft/shared";
import { cn } from "@/lib/utils";

export function AppShell() {
  return (
    <div className="min-h-screen flex">
      <aside className="w-60 border-r border-slate-200 bg-white p-4">
        <div className="text-xl font-semibold mb-6">TrustShyft</div>
        <nav className="flex flex-col gap-1">
          {PHASE_1_NAV.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "px-3 py-2 rounded-md text-sm",
                  isActive
                    ? "bg-slate-900 text-white"
                    : "text-slate-700 hover:bg-slate-100",
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
