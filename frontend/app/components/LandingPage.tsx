import type { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";

interface LandingPageProps {
  children: ReactNode;
}

export default function LandingPage({ children }: LandingPageProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}
