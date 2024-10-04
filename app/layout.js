import localFont from "next/font/local";
import "./globals.css";
import Image from "next/image";
import logo from '../public/logo.png'
import cr from '../public/cr.png';
import c1 from '../public/c1.png';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Registration",
  description: "Registration For CORE",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} bg-black max-h-screen overflow-hidden antialiased flex items-end justify-center`}>
        
        {children}
        <Image 
        src={cr} 
        width={200} 
        height={19} 
        objectFit="contain" 
        alt="Copyright" 
      className='bottom-10 md:block hidden fixed'
        priority 

      />
      </body>
    </html>
  );
}
