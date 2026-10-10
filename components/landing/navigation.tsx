"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Menu, X, ArrowRight, ShieldCheck } from "lucide-react";

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
    if (pathname === "/") {
      const element = document.getElementById(sectionId);
      element?.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push(`/#${sectionId}`);
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#080809]/90 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/20"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand Identity */}
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-3.5 group text-left cursor-pointer"
          >
            <div className="h-10 w-10 rounded-2xl bg-white p-1.5 flex items-center justify-center shadow-md shadow-black/30 border border-white/20 transition-transform group-hover:scale-105">
              <Image
                src="/elsewedy-logo.png"
                alt="Elsewedy Logo"
                width={36}
                height={36}
                className="h-full w-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-extrabold tracking-tight text-white group-hover:text-[#ff4d6a] transition-colors leading-tight">
                ELSEWEDY
              </span>
              <span className="text-[10px] font-semibold tracking-widest text-neutral-400 uppercase">
                Assessment System
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => handleNavClick("features")}
              className="text-xs font-semibold uppercase tracking-wider text-neutral-300 hover:text-white transition-colors cursor-pointer"
            >
              Features
            </button>
            <button
              onClick={() => handleNavClick("workflow")}
              className="text-xs font-semibold uppercase tracking-wider text-neutral-300 hover:text-white transition-colors cursor-pointer"
            >
              Workflow
            </button>
            <button
              onClick={() => handleNavClick("stats")}
              className="text-xs font-semibold uppercase tracking-wider text-neutral-300 hover:text-white transition-colors cursor-pointer"
            >
              Metrics
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Button
              size="sm"
              onClick={() => router.push("/login")}
              className="hidden md:inline-flex rounded-xl bg-[#c8102e] hover:bg-[#a00d24] text-white font-semibold text-xs tracking-wide shadow-lg shadow-red-900/30 px-5 h-10 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Access Portal</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl border border-white/10 text-neutral-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-white/10 bg-[#0e0e13]/98 backdrop-blur-2xl rounded-b-2xl shadow-2xl p-6 space-y-4 animate-in">
            <div className="space-y-2">
              <button
                onClick={() => handleNavClick("features")}
                className="block w-full text-left py-2.5 px-3 rounded-xl text-sm font-medium text-neutral-300 hover:text-white hover:bg-white/5 transition-colors"
              >
                Features
              </button>
              <button
                onClick={() => handleNavClick("workflow")}
                className="block w-full text-left py-2.5 px-3 rounded-xl text-sm font-medium text-neutral-300 hover:text-white hover:bg-white/5 transition-colors"
              >
                Workflow
              </button>
              <button
                onClick={() => handleNavClick("stats")}
                className="block w-full text-left py-2.5 px-3 rounded-xl text-sm font-medium text-neutral-300 hover:text-white hover:bg-white/5 transition-colors"
              >
                Metrics
              </button>
            </div>
            <Button
              size="sm"
              onClick={() => {
                setIsMobileMenuOpen(false);
                router.push("/login");
              }}
              className="w-full rounded-xl bg-[#c8102e] hover:bg-[#a00d24] text-white font-semibold h-11"
            >
              Access Portal
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
}

