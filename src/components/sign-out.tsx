"use client"

import { useState } from "react"
import { signOut } from "next-auth/react"
import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export function SignOutButton() {
    const [showConfirmDialog, setShowConfirmDialog] = useState(false)

    const handleSignOut = () => {
        setShowConfirmDialog(false)
        signOut({ callbackUrl: "/" })
    }

    return (
        <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
            <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm" className="w-full justify-start text-left font-normal" onClick={(e) => { e.preventDefault(); setShowConfirmDialog(true) }}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure you want to sign out?</AlertDialogTitle>
                    <AlertDialogDescription>You'll need to sign in again to access your calendar events.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setShowConfirmDialog(false)}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleSignOut}>Sign out</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

