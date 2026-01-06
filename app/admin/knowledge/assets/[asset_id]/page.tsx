"use client";

import { useParams } from "next/navigation";
import { PageSection } from "@/components/ui/page-section";
export default function AssetEditorPage() {
  const params = useParams<{ asset_id: string }>();
  return (
    <PageSection titleKey="adm.asset_editor.title">
      <div className="helper-text">{params?.asset_id}</div>
    </PageSection>
  );
}
