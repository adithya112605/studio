"use client"

import ProtectedPage from "@/components/common/ProtectedPage";
import NewTicketForm from "@/components/employee/NewTicketForm";

export default function NewTicketPage() {
  return (
    <ProtectedPage allowedRoles={['Employee']}>
      <div className="py-8">
        <NewTicketForm />
      </div>
    </ProtectedPage>
  );
}
