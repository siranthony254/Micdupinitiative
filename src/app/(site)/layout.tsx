import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CookieConsent } from "@/components/cookie-consent";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SiteHeader />

      <main className="flex-1">
        {children}
      </main>

      <SiteFooter />

      <CookieConsent />
    </>
  );
}
