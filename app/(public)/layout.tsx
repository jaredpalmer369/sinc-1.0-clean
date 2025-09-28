// app/(public)/layout.tsx
export const dynamic = "force-dynamic";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  // No auth checks, no redirects here
  return <>{children}</>;
}
