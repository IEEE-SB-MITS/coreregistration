import CoreAnimation from "./components/CoreAnimation";
import Forms from "./components/forms";
import { ShootingStars } from '@/components/ui/shooting-stars'; 
import { StarsBackground } from '@/components/ui/stars-background';

export default function Home() {
  return (
    <div className="h-screen w-screen flex">
           {/* <ShootingStars/>
           <StarsBackground starDensity={0.001}/> */}
      <div className="w-1/2  justify-center items-center md:block hidden">
        <CoreAnimation />
      </div>
      <div className="md:w-1/2 w-full h-full flex justify-center items-center">
        <Forms />
      </div>
    </div>
  );
}
