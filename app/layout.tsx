import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <link rel="icon" href="/images/ZQX_logo.svg" type="image/svg+xml" />
        <link rel="shortcut icon" href="/images/ZQX_logo.svg" />
      </head>
      <body className="relative min-h-screen">{children}</body>
    </html>
  );
}
