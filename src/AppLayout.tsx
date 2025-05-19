import React from 'react';
import Footer from './components/shared/Footer';

/**
 * Layout component that wraps the application content and adds a footer
 */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="flex-grow-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}