import type { Metadata } from "next";
import { WireframeThemeProvider } from "./components/wireframe-theme-provider";

export const metadata: Metadata = {
  title: "Wireframes | DINARP",
  description: "Entorno de prototipado y wireframes con tema neutral.",
};

interface WireframesLayoutProps {
  children: React.ReactNode;
}

export default function WireframesLayout({ children }: WireframesLayoutProps) {
  return <WireframeThemeProvider>{children}</WireframeThemeProvider>;
}
