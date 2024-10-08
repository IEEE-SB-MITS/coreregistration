import Forms from "./components/Forms";
import Hero from "./components/Hero";
import { ShootingStars } from '@/components/ui/shooting-stars';
import { StarsBackground } from '@/components/ui/stars-background';

export default function Home() {
  return (
    <div className='w-screen min-h-screen flex'>
      <div className='hidden md:block w-1/2'>
        <Hero />
    <ShootingStars starWidth={20}  starHeight={4} /> 
    <StarsBackground  starDensity ="0.0005"/> 
      </div>
      <Forms />
    </div>
  )
}
