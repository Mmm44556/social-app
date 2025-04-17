export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="col-span-6 max-lg:col-span-5 max-lg:pt-10 max-lg:pb-16">
      {children}
    </div>
  );
}
