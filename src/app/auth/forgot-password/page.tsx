import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center py-12">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Forgot Password</CardTitle>
          <CardDescription>
            Enter your PSN. If it exists in our system, instructions to reset your password will be processed.
            (This is a placeholder page - functionality not implemented).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="psn-forgot">PSN (8-digit ID)</Label>
            <Input id="psn-forgot" placeholder="E.g., EMP00001" />
          </div>
          <Button className="w-full" disabled>Send Reset Instructions (Not Active)</Button>
        </CardContent>
        <CardContent className="text-sm text-center">
          <Link href="/auth/signin">
            <Button variant="link">Back to Sign In</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
