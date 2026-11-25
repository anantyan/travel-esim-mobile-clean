import { APP_CONFIG } from "@/core/config/app.config";
import { routeTree } from "@/core/router/routeTree.gen";
import { createRouter } from "@tanstack/react-router";

export const router = createRouter({
  routeTree,
  basepath: APP_CONFIG.basePath,
  defaultPreload: "intent",
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
