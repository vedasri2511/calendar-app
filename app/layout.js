export const metadata = {
  title: "Calendar App",
  description: "Interactive Calendar",
};

export default function RootLayout({ children }) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}