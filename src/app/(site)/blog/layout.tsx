import { AuthProvider } from "@/contexts/auth-context";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthProvider>{children}</AuthProvider>;
}
