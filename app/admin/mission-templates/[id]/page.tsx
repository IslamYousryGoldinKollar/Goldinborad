"use client";

import { useParams } from "next/navigation";
import { PageSection } from "@/components/ui/page-section";

export default function MissionTemplatePage() {
  const params = useParams<{ id: string }>();
  return (
    <PageSection titleKey="adm.mission_templates.title">
      <div className="helper-text">{params?.id}</div>
    </PageSection>
  );
}
