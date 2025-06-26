
"use client"

import ProtectedPage from "@/components/common/ProtectedPage";
import AddSupervisorForm from "@/components/admin/AddSupervisorForm";
import ScrollReveal from "@/components/common/ScrollReveal";

export default function AddHrPage() {
  return (
    // This page seems to be for IC Heads to add any kind of supervisor.
    <ProtectedPage allowedRoles={['IC Head']}> 
      <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
        <ScrollReveal animationInClass="animate-fadeInUp" once={false}>
          <AddSupervisorForm />
        </ScrollReveal>
      </div>
    </ProtectedPage>
  );
}
