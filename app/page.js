import Forms from "./components/Forms";
import Hero from "./components/Hero";

export default function Home() {
  return (
    <div className='w-screen min-h-screen flex'>
      <div className='hidden md:block w-1/2'>
        <Hero />
      </div>
      <Forms />
    </div>
  )
}
