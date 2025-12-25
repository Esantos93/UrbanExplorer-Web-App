// src/views/searchResultsSuspenseView.jsx
import React, { useEffect, useState } from "react";

export function SearchResultsSuspenseView() {
  return (
    <div className="global-px py-8 sm:py-10">
      <h2 className="font-semibold tracking-tight text-2xl sm:text-3xl mb-4">
        Search Results
      </h2>
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="w-24 h-24 mb-4 rounded-full bg-gray-100 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
        </div>
        <h3 className="text-lg font-semibold mb-1">Searching...</h3>
      </div>
    </div>
  );
}