
"use client"

import ProtectedPage from "@/components/common/ProtectedPage";
import AddEmployeeForm from "@/components/admin/AddEmployeeForm";

export default function AddEmployeePage() {
  return (
    <ProtectedPage allowedRoles={['DH', 'IC Head']}>
      <div className="py-8">
        <AddEmployeeForm />
      </div>
    </ProtectedPage>
  );
}

    