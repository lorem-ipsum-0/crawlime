export default function Template({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <main className="container min-h-screen py-6">{children}</main>;
}
