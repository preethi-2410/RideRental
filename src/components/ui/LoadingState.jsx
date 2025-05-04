import React from 'react';

const LoadingState = ({ type = 'card', count = 3 }) => {
  const renderCardSkeleton = () => (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl overflow-hidden border border-white/5 animate-pulse">
      <div className="h-52 bg-white/5"></div>
      <div className="p-4 space-y-4">
        <div className="h-6 bg-white/5 rounded-lg w-3/4"></div>
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-10 bg-white/5 rounded-lg"></div>
          ))}
        </div>
        <div className="flex justify-between items-center pt-2 border-t border-white/5">
          <div className="h-8 bg-white/5 rounded-lg w-1/4"></div>
          <div className="h-10 bg-white/5 rounded-lg w-1/3"></div>
        </div>
      </div>
    </div>
  );

  const renderDetailsSkeleton = () => (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl overflow-hidden border border-white/5 animate-pulse p-6">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-2/3">
          <div className="h-96 bg-white/5 rounded-xl"></div>
          <div className="mt-6 space-y-4">
            <div className="h-8 bg-white/5 rounded-lg w-1/2"></div>
            <div className="h-24 bg-white/5 rounded-lg"></div>
          </div>
        </div>
        <div className="w-full md:w-1/3 space-y-6">
          <div className="h-12 bg-white/5 rounded-lg"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-10 bg-white/5 rounded-lg"></div>
            ))}
          </div>
          <div className="h-14 bg-white/5 rounded-lg"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="grid gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <React.Fragment key={i}>
          {type === 'card' ? renderCardSkeleton() : renderDetailsSkeleton()}
        </React.Fragment>
      ))}
    </div>
  );
};

export default LoadingState;
