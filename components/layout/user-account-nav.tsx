"use client";

import Link from "next/link";
import { Gamepad2, LayoutDashboard, LogOut } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UserAvatar from "@/components/shared/user-avatar";
import { SessionUser } from "@/types";
import { logout } from "@/actions/session";

import { Button } from "../ui/button";

interface UserAccountNavProps extends React.HTMLAttributes<HTMLDivElement> {
  user: SessionUser;
}

export function UserAccountNav({ user }: UserAccountNavProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar uuid={user.uuid} size={40} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            <p className="font-medium">{user.username}</p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard" className="flex items-center space-x-2.5">
            <LayoutDashboard className="h-4 w-4" />
            <p className="text-sm">Dashboard</p>
          </Link>
        </DropdownMenuItem>
        {/* <DropdownMenuItem asChild>
          <Link href="/dashboard2" className="flex items-center space-x-2.5">
            <LayoutDashboard className="h-4 w-4" />
            <p className="text-sm">Another layout</p>
          </Link>
        </DropdownMenuItem> */}
        <DropdownMenuItem asChild>
          <Link
            href="/dashboard/play"
            className="flex items-center space-x-2.5"
          >
            <Gamepad2 className="h-4 w-4" />
            <p className="text-sm">Play</p>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          // onSelect={(event) => {
          //   event.preventDefault();
          //   logout();
          // }}
        >
          <form action={logout}>
            <Button type="submit">
              <LogOut className="h-4 w-4 mr-4" />
              <p className="text-sm">Log out </p>
            </Button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
