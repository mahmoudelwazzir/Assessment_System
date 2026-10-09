"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (sectionId: string) => {
    setIsMobileMenuOpen(false);
    if (pathname === "/landing" || pathname === "/") {
      // If on landing page, scroll to section
      const element = document.getElementById(sectionId);
      element?.scrollIntoView({ behavior: "smooth" });
    } else {
      // If on another page (like login), navigate to landing page with hash
      router.push(`/#${sectionId}`);
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        isScrolled
          ? "bg-gray-950/80 backdrop-blur-xl border-b border-gray-800"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-3 group text-left"
          >
            <div className="h-9 w-9 rounded-xl bg-white p-1 flex items-center justify-center shadow-md">
              <img
                src="/elsewedy-logo.png"
                alt="Elsewedy Electrometer Logo"
                className="h-full w-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-tight text-white group-hover:text-red-400 transition-colors">
                ELSEWEDY
              </span>
              <span className="text-[10px] font-medium tracking-widest text-slate-400 uppercase">
                Assessment System
              </span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => handleNavClick("features")}
              className="text-sm text-slate-300 hover:text-white transition-colors"
            >
              Features
            </button>
            <button
              onClick={() => handleNavClick("Workflow")}
              className="text-sm text-slate-300 hover:text-white transition-colors"
            >
              Workflow
            </button>
          </div>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <Button
              size="sm"
              onClick={() => router.push("/login")}
              className="hidden md:inline-flex rounded-xl bg-[#c8102e] hover:bg-[#a00d24] text-white font-semibold shadow-md shadow-red-900/20 px-4"
            >
              Sign In
            </Button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-800 bg-gray-950/95 backdrop-blur-xl">
            <div className="px-6 py-4 space-y-3">
              <button
                onClick={() => handleNavClick("features")}
                className="block w-full text-left py-2 text-sm text-gray-400 hover:text-white transition-colors"
              >
                Features
              </button>
              <button
                onClick={() => handleNavClick("Workflow")}
                className="block w-full text-left py-2 text-sm text-gray-400 hover:text-white transition-colors"
              >
                Workflow
              </button>
              <Button
                size="sm"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  router.push("/login");
                }}
                className="w-full rounded-xl bg-[#c8102e] hover:bg-[#a00d24] text-white font-semibold"
              >
                Sign In
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
