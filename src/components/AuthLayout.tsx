import React from "react";

interface AuthLayoutProps {
  leftContent: React.ReactNode;
  rightContent: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  leftContent,
  rightContent,
}) => {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left side - Blue gradient */}
      <div className="flex-1 bg-brand-dark relative overflow-hidden min-h-[40vh] lg:min-h-screen">
        {/* Decorative shapes */}
        <div className="absolute top-10 md:top-20 right-10 md:right-20 transform rotate-45">
          <div className="w-12 h-12 md:w-16 md:h-16 bg-white opacity-10 rounded-lg"></div>
        </div>
        <div className="absolute top-20 md:top-40 left-10 md:left-20 transform rotate-45">
          <div className="w-8 h-8 md:w-12 md:h-12 bg-white opacity-20 rounded-lg"></div>
        </div>
        <div className="absolute bottom-20 md:bottom-40 right-20 md:right-40 transform rotate-45">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-white opacity-5 rounded-lg"></div>
        </div>
        <div className="absolute bottom-10 md:bottom-20 left-10 md:left-20">
          <div className="w-24 h-24 md:w-32 md:h-32 bg-white opacity-5 rounded-full"></div>
        </div>
        <div className="absolute top-1/2 right-5 md:right-10 transform -translate-y-1/2 rotate-45">
          <div className="w-6 h-6 md:w-8 md:h-8 bg-white opacity-30 rounded-lg"></div>
        </div>

        <div className="relative z-10 h-full flex items-center justify-center p-6 md:p-8">
          {leftContent}
        </div>
      </div>

      {/* Right side - White content */}
      <div className="flex-1 bg-white flex items-center justify-center p-6 md:p-8 min-h-[60vh] lg:min-h-screen">
        <div className="w-full max-w-md">{rightContent}</div>
      </div>
    </div>
  );
};

export default AuthLayout;
