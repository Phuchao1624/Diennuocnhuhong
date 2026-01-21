import React from 'react';
import { FEATURES } from '../constants';

const Features: React.FC = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-y border-dashed border-gray-200 dark:border-gray-700">
      {FEATURES.map((feature) => (
        <div key={feature.id} className="flex items-center gap-4 justify-center md:justify-start">
          <div className="text-primary p-3 bg-blue-50 dark:bg-blue-900/20 rounded-full">
            <span className="material-symbols-outlined text-[28px]">{feature.icon}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-[#111418] dark:text-white">{feature.title}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">{feature.description}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Features;