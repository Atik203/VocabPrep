"use client";

import { UserDropdown } from "@/components/layout/user-dropdown";
import { ModeToggle } from "@/components/theme/mode-toggle";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAppSelector } from "@/redux/hooks";
import { motion } from "framer-motion";
import { BookMarked, BookOpen, Home, Menu, Plus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type JSX } from "react";

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Words", href: "/words", icon: BookMarked },
  { name: "Practice", href: "/practice", icon: BookOpen },
];

export function SiteHeader(): JSX.Element {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60"
    >
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center space-x-2 font-bold text-xl tracking-tight group cursor-pointer"
        >
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="flex h-10 w-10 items-center justify-center rounded-xl glass-card"
          >
            <BookOpen className="h-5 w-5 text-primary" />
          </motion.div>
          <span className="gradient-text hidden sm:inline-block">
            EnglishPrep
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navigation.map((item, index) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={item.href}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    className="gap-2 cursor-pointer"
                  >
                    <Icon className="h-4 w-4" />
                    {item.name}
                  </Button>
                </Link>
              </motion.div>
            );
          })}
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2">
          {!isAuthenticated ? (
            <Link href="/login" className="hidden md:inline-flex">
              <Button variant="default" size="sm" className="cursor-pointer">
                Login
              </Button>
            </Link>
          ) : (
            <div className="hidden md:flex">
              <UserDropdown />
            </div>
          )}
          <ModeToggle />

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="cursor-pointer">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <SheetHeader>
                <SheetTitle className="text-left">Menu</SheetTitle>
              </SheetHeader>
              <nav className="mt-6 flex flex-col space-y-2">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                    >
                      <Button
                        variant={isActive ? "default" : "ghost"}
                        className="w-full justify-start gap-2 cursor-pointer"
                      >
                        <Icon className="h-4 w-4" />
                        {item.name}
                      </Button>
                    </Link>
                  );
                })}
                {!isAuthenticated && (
                  <Link href="/login" onClick={() => setIsOpen(false)}>
                    <Button variant="default" className="w-full cursor-pointer">
                      Login
                    </Button>
                  </Link>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  );
}
