import { useEffect, useState, useRef } from "react";

interface TimerCircleProps {
  seconds: number;
  running: boolean;
  onComplete: () => void;
  onTick: (remainingTime: number) => void;
}

export function TimerCircle({ seconds, running, onComplete, onTick }: TimerCircleProps) {
  const [remainingTime, setRemainingTime] = useState(seconds);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!running) {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    timerRef.current = window.setInterval(() => {
      setRemainingTime((prev) => {
        const newTime = prev - 1;
        
        // Calculate progress as a percentage
        const newProgress = Math.floor((1 - newTime / seconds) * 100);
        setProgress(newProgress);
        
        onTick(newTime);
        
        if (newTime <= 0) {
          if (timerRef.current) {
            window.clearInterval(timerRef.current);
            timerRef.current = null;
          }
          onComplete();
          return 0;
        }
        return newTime;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [running, seconds, onComplete, onTick]);

  const formatTime = (secs: number) => {
    const minutes = Math.floor(secs / 60);
    const seconds = secs % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Round the progress to the nearest multiple of 10 for the CSS classes
  const roundedProgress = Math.floor(progress / 10) * 10;

  return (
    <div 
      className="timer-circle" 
      data-progress={roundedProgress}
      style={{
        width: '120px',
        height: '120px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      }}
    >
      <span className="text-3xl font-bold">{formatTime(remainingTime)}</span>
      
      <style jsx>{`
        .timer-circle::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          border: 8px solid #e0e0e0;
        }

        .timer-circle::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          border: 8px solid transparent;
          border-top-color: #2196F3;
          transform: rotate(-90deg);
          transition: all 0.2s linear;
        }

        .timer-circle[data-progress="0"]::after { transform: rotate(-90deg); }
        .timer-circle[data-progress="10"]::after { transform: rotate(-54deg); }
        .timer-circle[data-progress="20"]::after { transform: rotate(-18deg); }
        .timer-circle[data-progress="30"]::after { transform: rotate(18deg); }
        .timer-circle[data-progress="40"]::after { transform: rotate(54deg); }
        .timer-circle[data-progress="50"]::after { transform: rotate(90deg); }
        .timer-circle[data-progress="60"]::after { transform: rotate(126deg); }
        .timer-circle[data-progress="70"]::after { transform: rotate(162deg); }
        .timer-circle[data-progress="80"]::after { transform: rotate(198deg); }
        .timer-circle[data-progress="90"]::after { transform: rotate(234deg); }
        .timer-circle[data-progress="100"]::after { transform: rotate(270deg); }
      `}</style>
    </div>
  );
}
