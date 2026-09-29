import { UsuarioEditClient } from "./usuario-edit-client";

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

export default async function WireframeEditarUsuarioPage({ params }: PageProps) {
  const resolvedParams = await params;
  return <UsuarioEditClient id={resolvedParams.id} />;
}

