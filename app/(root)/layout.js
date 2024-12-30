import { Inter } from "next/font/google";
import "@styles/globals.css";
import ButtomNav from "@components/ButtomNav";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "FUTO-VERSE",
  description: "Shaping the future of Campus Navigation and Business Promotion",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* <Provider>
          <LocationProvider>
            <CesiumViewerProvider> */}
        <main className="bg-light">
          <div className="">{children}</div>
          <ButtomNav />
        </main>
        {/* <Bottombar />
              <CesiumMapB />
            </CesiumViewerProvider>
          </LocationProvider>
        </Provider> */}
      </body>
    </html>
  );
}
