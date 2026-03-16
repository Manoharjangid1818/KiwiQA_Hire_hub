import { Link } from "wouter";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-white/95 backdrop-blur-md dark:bg-slate-950/95">
      <div className="container mx-auto px-4 md:px-6 h-16 flex items-center">
        <Link href="/" className="flex items-center">
          <img 
            src="/kiwiqa-logo.png" 
            alt="KiwiQA Logo" 
            className="h-10 w-auto object-contain"
          />
        </Link>
      </div>
    </nav>
  );
}
