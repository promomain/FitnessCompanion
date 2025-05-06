import { useState } from "react";

interface CounterProps {
  max: number;
  label?: string;
  onChange: (value: number) => void;
}

export function Counter({ max, label, onChange }: CounterProps) {
  const [count, setCount] = useState(0);

  const increment = () => {
    if (count < max) {
      const newCount = count + 1;
      setCount(newCount);
      onChange(newCount);
    }
  };

  const decrement = () => {
    if (count > 0) {
      const newCount = count - 1;
      setCount(newCount);
      onChange(newCount);
    }
  };

  return (
    <div className="text-center">
      {label && <p className="text-lg font-semibold mb-2">{label}</p>}
      <div className="counter bg-gray-100 rounded-full px-6 py-4 flex items-center">
        <button 
          type="button"
          className="material-icons text-primary text-2xl"
          onClick={decrement}
        >
          remove
        </button>
        <span className="text-3xl font-bold mx-6">{count}</span>
        <span className="text-xl mx-1">/</span>
        <span className="text-xl mx-1">{max}</span>
        <button 
          type="button"
          className="material-icons text-primary text-2xl"
          onClick={increment}
        >
          add
        </button>
      </div>
    </div>
  );
}
