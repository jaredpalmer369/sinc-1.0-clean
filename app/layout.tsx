// app/layout.tsx
export const dynamic = "force-dynamic";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // IMPORTANT: no redirects or auth checks here
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
