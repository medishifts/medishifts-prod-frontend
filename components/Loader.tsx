// components/Loader.tsx
import Image from "next/image";
import React from "react";

const Loader: React.FC = () => {
  return (
    <div className="flex items-center justify-center animate-spin">
      <Image src="/icons/load.png" alt="loader" width={50} height={50} />
    </div>
  );
};

export default Loader;
