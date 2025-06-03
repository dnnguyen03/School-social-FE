import React from "react";
import { Search } from "lucide-react";

export default function SearchInput({ value, onChange }) {
  return (
    <div className="relative mb-4">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        placeholder="Tìm kiếm"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-10 pr-3 py-2 border bg-gray-200 rounded-md focus:outline focus:outline-1 focus:outline-gray-400"
      />
    </div>
  );
}
