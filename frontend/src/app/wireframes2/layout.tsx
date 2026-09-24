import type { Metadata } from "next";
import { Wireframes2ThemeReset } from "./components/wireframes2-theme-reset";

export const metadata: Metadata = {
  title: "SURI Interoperabilidad | DINARP",
  description: "Plataforma de Interoperabilidad DINARP.",
};

interface WireframesLayoutProps {
  children: React.ReactNode;
}

export default function WireframesLayout({ children }: WireframesLayoutProps) {
  return (
    <Wireframes2ThemeReset>
      <div className="min-h-screen bg-background text-foreground font-sans antialiased">
        {children}
      </div>
    </Wireframes2ThemeReset>
  );
}
