import { PublisherDashboard } from "@/components/PublisherDashboard";

export const routes = [
  // ... existing routes ...
  {
    path: "integration-timer",
    element: <IntegrationDemo />,
    name: "Integration Timer"
  },
  {
    path: "publisher-dashboard",
    element: <PublisherDashboard />,
    name: "Publisher Dashboard",
    description: "View your publisher dashboard and analytics"
  },
  // ... existing routes ...
]; 