import type * as React from "react";

export default function SignUpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden ">
        <div className="absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 h-[30vh] w-full bg-gradient-to-t from-blue-950/50 to-transparent"></div>

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="h-full w-full bg-[linear-gradient(to_right,#8884_1px,transparent_1px),linear-gradient(to_bottom,#8884_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        </div>
      </div>

      {children}

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-800 bg-black/50 py-4 backdrop-blur-sm">
        <div className="container mx-auto flex flex-col items-center justify-between space-y-2 px-4 text-sm text-gray-500 md:flex-row md:space-y-0">
          <div className="flex items-center space-x-4">
            <span>© 2025 TechSphere, Inc.</span>
            <span>•</span>
            <a href="#" className="hover:text-gray-400">
              Privacy
            </a>
            <span>•</span>
            <a href="#" className="hover:text-gray-400">
              Terms
            </a>
          </div>
          <div className="flex items-center space-x-4">
            <a href="#" className="hover:text-gray-400">
              Status
            </a>
            <span>•</span>
            <a href="#" className="hover:text-gray-400">
              Support
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
