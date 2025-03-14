import React, { useState, useEffect, useRef } from "react";
// import { storeStatusUpdates } from "@constants/dummies";
import Image from "next/image";

const StatusViewer = ({ storeStatusUpdates, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);
  const duration = 5000;

  if (!storeStatusUpdates || !storeStatusUpdates.status) {
    return <div>No status updates available</div>;
  }

  const currentStatus = storeStatusUpdates.status[currentIndex];
  if (!currentStatus) {
    return <div>Loading status...</div>;
  }

  // Close modal if the last status finishes
  useEffect(() => {
    if (currentIndex === storeStatusUpdates.status.length - 1 && !paused) {
      timerRef.current = setTimeout(() => {
        onClose(); // Call the parent-provided onClose function
      }, duration);
    } else if (!paused) {
      timerRef.current = setTimeout(() => {
        setCurrentIndex((prevIndex) => prevIndex + 1);
      }, duration);
    }

    return () => clearTimeout(timerRef.current);
  }, [currentIndex, paused]);

  // Manual navigation handlers
  const goToNext = () => {
    if (currentIndex < storeStatusUpdates.status.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      onClose(); // Close modal if next is clicked on the last index
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  return (
    <div
      className="w-full h-full bg-dark-3 relative text-light-1"
      onMouseDown={() => setPaused(true)}
      onMouseUp={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      <div className="relative w-full h-full flex justify-center items-center">
        <div className="absolute top-0 left-0 bg-black/30 flex flex-col justify-end p-5 text-white">
          <div className="flex items-center mb-2">
            <Image
              src={
                storeStatusUpdates.image ||
                "https://randomuser.me/api/portraits/men/3.jpg"
              }
              alt={storeStatusUpdates.name}
              className="w-10 h-10 rounded-full mr-3"
              width={40}
              height={40}
            />
            <div className="font-bold text-lg">{storeStatusUpdates.name}</div>
          </div>
        </div>
        {currentStatus.media ? (
          <div className="flex flex-col gap-6 items-center justify-center w-full h-full">
            <div className="relative w-full h-[60%]">
              <Image
                src={currentStatus.media}
                alt={currentStatus.content}
                layout="fill"
                objectFit="contain"
              />
            </div>
            <p className="text-lg leading-relaxed break-words whitespace-pre-wrap">
              {currentStatus.content}
            </p>
          </div>
        ) : (
          <div className="w-full h-full flex justify-center items-center text-white text-xl p-5 bg-black/80 break-words whitespace-pre-wrap">
            {currentStatus.content}
          </div>
        )}
      </div>
      <div className="absolute top-2 w-full flex space-x-1 px-4">
        {storeStatusUpdates.status.map((_, index) => (
          <div
            key={index}
            className="flex-1 h-1 bg-gray-500 rounded overflow-hidden"
          >
            {index === currentIndex && (
              <div
                className="h-full bg-white animate-progress"
                style={{ animationDuration: `${duration}ms` }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatusViewer;
