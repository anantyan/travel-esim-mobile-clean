import { MobileAppShell } from "@/commons/components/shell/MobileAppShell";
import { Outlet, createRootRoute } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  return (
    <MobileAppShell>
      <Outlet />
    </MobileAppShell>
  );
}
