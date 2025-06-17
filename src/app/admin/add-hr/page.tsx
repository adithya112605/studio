"use client"

import ProtectedPage from "@/components/common/ProtectedPage";
import AddHrForm from "@/components/admin/AddHrForm";

export default function AddHrPage() {
  return (
    <ProtectedPage allowedRoles={['Head HR']}> {/* Typically only Head HR or Super Admin */}
      <div className="py-8">
        <AddHrForm />
      </div>
    </ProtectedPage>
  );
}
