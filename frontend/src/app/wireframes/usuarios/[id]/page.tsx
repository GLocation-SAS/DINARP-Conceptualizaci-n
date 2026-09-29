import { UsuarioDetailClient } from "./usuario-detail-client";

export function generateStaticParams() {
  return [
    { id: "USR-001" },
    { id: "USR-002" },
    { id: "USR-003" },
    { id: "USR-004" },
    { id: "USR-005" },
    { id: "maria-cuenca" },
  ];
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function WireframeDetalleUsuarioPage({ params }: PageProps) {
  const resolvedParams = await params;
  return <UsuarioDetailClient id={resolvedParams.id} />;
}

