import { Inter } from "next/font/google";
// import "@styles/globals.css";
import Bottombar from "@/components/Navigation/Bottombar";
import Provider from "@components/providers/SessionProvider";
import { LocationProvider } from "@components/providers/LocationProvider";
import { CesiumViewerProvider } from "@/components/providers/CesiumViewerProvider";
import CesiumMapB from "@/components/Cesium/Cesium";

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
          <LocationProvider>
            <CesiumViewerProvider>
              <main className="">
                <div className="">{children}</div>
              </main>
              <Bottombar />
              <CesiumMapB />
            </CesiumViewerProvider>
          </LocationProvider>
        </Provider>
      </body>
    </html>
  );
}
