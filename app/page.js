import { StarsBackground } from "@/components/ui/stars-background";
import CoreAnimation from "./components/CoreAnimation";
import Forms from "./components/forms";
import { ShootingStars } from "@/components/ui/shooting-stars";
export default function Home() {
  return (
    <div className="h-screen  w-screen flex">
      <div className="w-1/2 h-full justify-center items-center md:block hidden">
        <CoreAnimation />
    <ShootingStars />
    <StarsBackground  starDensity={0.003}/>
      </div>
      <div className="md:w-1/2 w-full h-full flex z-40 bg-black rounded-3xl  justify-center items-center">
        <Forms />
      </div>
    </div>
  );
}
