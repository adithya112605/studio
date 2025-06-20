
"use client"

import ProtectedPage from "@/components/common/ProtectedPage";
import AddEmployeeForm from "@/components/admin/AddEmployeeForm";
import ScrollReveal from "@/components/common/ScrollReveal";

export default function AddEmployeePage() {
  return (
    <ProtectedPage allowedRoles={['DH', 'IC Head']}>
      <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
        <ScrollReveal animationInClass="animate-fadeInUp" once={false}>
          <AddEmployeeForm />
        </ScrollReveal>
      </div>
    </ProtectedPage>
  );
}
