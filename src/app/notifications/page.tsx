
"use client"

import ProtectedPage from "@/components/common/ProtectedPage";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BellRing, Archive } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import React, { useState } from "react";

// Mock notifications structure
interface MockNotification {
  id: number;
  title: string;
  message: string;
  date: string;
  read: boolean;
}

const initialMockNotifications: MockNotification[] = [
  { id: 1, title: "Ticket TKT002 Status Update", message: "Your ticket 'My salary for last month...' has been updated to 'In Progress'.", date: "2024-05-03", read: false },
  { id: 2, title: "New AI Suggestion Available", message: "AI has provided resolution suggestions for ticket TKT001.", date: "2024-05-02", read: true },
  { id: 3, title: "Password Change Reminder", message: "Consider updating your password for enhanced security.", date: "2024-05-01", read: true },
];


export default function NotificationsPage() {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<MockNotification[]>(initialMockNotifications);

  const handleMarkAllAsRead = () => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notif => ({ ...notif, read: true }))
    );
    toast({
      title: "Notifications Updated",
      description: "All notifications marked as read (Client-side demo).",
    });
  };

  return (
    <ProtectedPage>
      <div className="py-8">
        <Card className="w-full max-w-2xl mx-auto shadow-xl">
          <CardHeader>
            <div className="flex justify-between items-center">
                <CardTitle className="font-headline text-2xl">Notifications</CardTitle>
                <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}> 
                  <Archive className="mr-2 h-4 w-4" /> Mark all as read
                </Button>
            </div>
            <CardDescription>
              Updates on your tickets and other important system messages.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {notifications.length > 0 ? notifications.map(notif => (
              <div key={notif.id} className={`p-4 rounded-md border ${notif.read ? 'bg-muted/50 opacity-70' : 'bg-card'}`}>
                <div className="flex items-start space-x-3">
                    <BellRing className={`mt-1 h-5 w-5 ${notif.read ? 'text-muted-foreground' : 'text-primary'}`} />
                    <div>
                        <h4 className={`font-semibold ${notif.read ? '' : 'text-foreground'}`}>{notif.title}</h4>
                        <p className="text-sm text-muted-foreground">{notif.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">{notif.date}</p>
                    </div>
                </div>
              </div>  
            )) : (
                <p className="text-muted-foreground text-center py-4">No new notifications.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </ProtectedPage>
  );
}
