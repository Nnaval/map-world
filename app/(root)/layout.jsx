import { Inter } from "next/font/google";
import "@styles/globals.css";
import ButtomNav from "@components/ButtomNav";
import Provider from "@components/providers/SessionProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "FUTO-VERSE",
  description: "Shaping the future of Campus Navigation and Business Promotion",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider>
          <main className="bg-light">
            <div className="">{children}</div>
            <ButtomNav />
          </main>
        </Provider>
      </body>
    </html>
  );
}
