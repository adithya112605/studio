"use client"

import ProtectedPage from "@/components/common/ProtectedPage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Filter } from "lucide-react";

export default function ReportsPage() {
  return (
    <ProtectedPage allowedRoles={['HR', 'Head HR']}>
      <div className="py-8">
        <Card className="w-full max-w-3xl mx-auto shadow-xl">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Generate Reports</CardTitle>
            <CardDescription>
              Create and download reports based on ticket data. 
              (This is a placeholder - full report generation and .xlsx download not implemented).
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Filters (Example)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Placeholder for filter controls like date range, status, project etc. */}
                <p className="text-sm p-3 bg-muted rounded-md">Date Range Filter Placeholder</p>
                <p className="text-sm p-3 bg-muted rounded-md">Status Filter Placeholder</p>
                <p className="text-sm p-3 bg-muted rounded-md">Project Filter Placeholder</p>
                <p className="text-sm p-3 bg-muted rounded-md">HR Filter Placeholder</p>
              </div>
               <Button className="mt-4" disabled>
                <Filter className="mr-2 h-4 w-4" /> Apply Filters (Not Active)
              </Button>
            </div>
            
            <div>
                <h3 className="font-semibold mb-2">Report Preview (Example Attributes)</h3>
                <p className="text-sm text-muted-foreground mb-2">
                    Reports will include fields like: PS_No, Name, Ticket ID, Query, Followup Query, Action Performed, Dates, Project, Grade, Gender, HR Details, Status, etc.
                </p>
                <div className="border rounded-md p-4 bg-background h-48 overflow-auto">
                    <p className="italic text-muted-foreground">Report data preview would appear here...</p>
                </div>
            </div>

            <Button className="w-full" disabled>
              <Download className="mr-2 h-4 w-4" /> Download Report (.xlsx) (Not Active)
            </Button>
          </CardContent>
        </Card>
      </div>
    </ProtectedPage>
  );
}
