import dynamic from 'next/dynamic'
import { Analytics } from '@vercel/analytics/react';

const DynamicLinks = dynamic(() => import('../../components/DynamicLinks'), { ssr: false })

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="mx-auto flex flex-col min-h-screen">
      <header className="sticky top-0 z-40 bg-white">
        <div className="h-16 border-b border-b-slate-200 py-4">
          <nav className="ml-4 pl-6">
            <a href="#" className="hover:text-slate-600 cursor-pointer">
              Home
            </a>
          </nav>
        </div>
      </header>
      <main className="flex-grow overflow-auto">
        {children}
      </main>
      <footer className="mt-auto p-4 text-center">
        Powered by GPT-4o and LangChainAI | Built by <DynamicLinks />
      </footer>
    </div>
  );
};

export default HomeLayout;