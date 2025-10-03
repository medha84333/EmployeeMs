
import React from "react";

import { LogOut, LogIn, } from 'lucide-react';
import { Button } from '../ui/Button';
import Image from "next/image";
// Update the import path to the correct location of Avatar components
import { Avatar, AvatarFallback, AvatarImage } from '../ui/Avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/DropdownMenu';

/**
 * TypeScript interface for Header props
 */
interface HeaderProps {
  userName?: string;
  userEmail?: string;
  userAvatar?: string;
  onLogout?: () => void;
  onNavigateHome?: () => void;
  onNavigateLogin?: () => void;
}

export function Header({
  userName,
  userEmail,
  userAvatar,
  onLogout,
  onNavigateHome,
  onNavigateLogin,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card ">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            {/* <Users className="h-6 w-6 text-primary" /> */}
            <Image
              src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
              alt="Employee Management Logo"
              width={32}
              height={32}
              className="h-8 w-auto"
            />
            <h1 className="text-primary">Employee MS</h1>
          </div>
          
          <nav className="hidden md:flex items-center gap-1 ">
            {userName && onNavigateHome && (
              <Button variant="ghost" onClick={onNavigateHome} className="gap-2">
                {/* <Home className="h-4 w-4" /> */}
                Home
              </Button>
            )}
            {/* {!userName && onNavigateLogin && (
              <Button variant="ghost" onClick={onNavigateLogin} className="gap-2">
                <LogIn className="h-4 w-4" />
                Login
              </Button>
            )} */}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          {!userName && onNavigateLogin && (
            <Button variant="ghost" onClick={onNavigateLogin} className="gap-2">
              <LogIn className="h-4 w-4" />
              Login
            </Button>
          )}
          {userName && onLogout && (
            <>
              <Button 
                variant="ghost" 
                onClick={onLogout} 
                className="hidden md:flex items-center gap-2 text-destructive hover:text-destructive"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 h-auto py-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={userAvatar} alt={userName} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {userName?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:inline">{userName}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="flex items-center gap-3 py-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={userAvatar} alt={userName} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {userName?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span>{userName}</span>
                      {userEmail && (
                        <span className="text-muted-foreground">{userEmail}</span>
                      )}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onLogout} className="text-destructive cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
