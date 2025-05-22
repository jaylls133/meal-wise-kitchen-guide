
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-neutral-50 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 transition-colors duration-200">
      <Navigation />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}
