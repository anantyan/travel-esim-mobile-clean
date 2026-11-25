import { HelloWorldStage } from "@/presentation/features/hello-world/HelloWorldStage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: IndexPage,
});

function IndexPage() {
  return <HelloWorldStage />;
}
