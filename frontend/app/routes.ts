import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("login", "routes/login.tsx"),
  route("admin", "routes/admin.tsx"),
  route("admin/projects", "routes/admin.projects.tsx"),
  route("admin/clients", "routes/admin.clients.tsx"),
  route("admin/contacts", "routes/admin.contacts.tsx"),
  route("admin/subscriptions", "routes/admin.subscriptions.tsx"),
] satisfies RouteConfig;
