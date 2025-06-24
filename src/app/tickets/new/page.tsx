
"use client"

import ProtectedPage from "@/components/common/ProtectedPage";
import NewTicketForm from "@/components/employee/NewTicketForm";
import ScrollReveal from "@/components/common/ScrollReveal";

export default function NewTicketPage() {
  return (
    <ProtectedPage allowedRoles={['Employee', 'IS', 'NS', 'DH', 'IC Head']}>
      <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
        <ScrollReveal animationInClass="animate-fadeInUp" once={false}>
          <NewTicketForm />
        </ScrollReveal>
      </div>
    </ProtectedPage>
  );
}
