
"use client"

import ProtectedPage from "@/components/common/ProtectedPage";
import AddSupervisorForm from "@/components/admin/AddSupervisorForm";

export default function AddSupervisorPage() {
  return (
    <ProtectedPage allowedRoles={['IC Head']}> 
      <div className="py-8">
        <AddSupervisorForm />
      </div>
    </ProtectedPage>
  );
}
