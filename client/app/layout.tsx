import "./globals.css";

export const metadata = {
  title: "Rex Galaxy Academy",
  description: "Institute of IT and AI Training",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}