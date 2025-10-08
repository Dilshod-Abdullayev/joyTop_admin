import { AuthGuard } from "@/components/auth/AuthGuard";
import { Layout } from "@/components/layout/Layout";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <Layout>{children}</Layout>
    </AuthGuard>
  );
}
