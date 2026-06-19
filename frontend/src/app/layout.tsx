import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";

import { getAllEvents, getAllTeams } from "../api/header";
import SiteLayout from "../layouts/siteLayout";
import Navbar from "../pagesContent/navbar";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "Statbotics",
  description: "Modernizing FRC Data Analytics",
  openGraph: {
    title: "Statbotics",
    description: "Modernizing FRC Data Analytics",
    type: "website",
    url: "https://www.statbotics.io",
    images: [
      {
        url: "https://www.statbotics.io/og_spline.png",
        width: 1200,
        height: 630,
      },
    ],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [teams, events] = await Promise.all([getAllTeams(), getAllEvents()]);

  return (
    <html lang="en">
      <body>
        <Script
          id="google"
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-JD14NTTG5M"
          strategy="afterInteractive"
        />
        <Script
          id="gtag"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-JD14NTTG5M', { page_path: window.location.pathname });
            `,
          }}
        />
        <div className="min-h-screen flex flex-col bg-white text-gray-800">
          <Navbar teams={teams} events={events} />
          <SiteLayout>{children}</SiteLayout>
          <footer className="w-full border-t border-gray-300 text-gray-600 text-center pt-3 pb-2">
            <div className="h-4 sm:h-5 lg:h-6 flex justify-center items-center gap-1 text-xs sm:text-sm lg:text-base">
              Powered by{" "}
              <Link
                href="https://www.thebluealliance.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                The Blue Alliance
              </Link>
              <Link
                href="https://www.thebluealliance.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="relative h-4 sm:h-5 lg:h-6 w-4 sm:w-5 lg:w-6 mx-1"
              >
                <Image src="/tba.png" alt="TBA" unoptimized fill className="object-contain" />
              </Link>
              | Sponsored by{" "}
              <Link
                href="https://wcproducts.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="relative ml-1 h-4 w-10 sm:h-5 sm:w-12 lg:h-6 lg:w-16"
              >
                <Image src="/wcp.png" alt="WCP" unoptimized fill className="object-contain" />
              </Link>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
