import CoreAnimation from "./components/CoreAnimation";
import Forms from "./components/forms";

export default function Home() {
  return (
    <div className="h-screen w-screen flex">
      <div className="w-1/2 h-full flex justify-center items-center">
        <CoreAnimation />
      </div>
      <div className="w-1/2 h-full flex justify-center items-center">
        <Forms />
      </div>
    </div>
  );
}
