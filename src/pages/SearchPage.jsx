import React from "react";
import { Search, MoreVertical } from "lucide-react";

const suggestedUsers = [
  {
    id: 1,
    name: "Nấm 🎶",
    username: "hetinmal",
    bio: "hahahahahahahahahaha",
    followers: "52 người theo dõi",
  },
  {
    id: 2,
    name: "Thu Mabu",
    username: "mabu.thu",
    bio: "Kết Bạn làm quen vs mình nhé",
    followers: "943 người theo dõi",
  },
  {
    id: 3,
    name: "Tính Trần",
    username: "shinhbabi",
    bio: "A healthy booty starts w a healthy mind A healthy booty starts w a healthy mindA healthy booty starts w a healthy mind A healthy booty starts w a healthy mindA healthy booty starts w a healthy mindA healthy booty starts w a healthy mindvA healthy booty starts w a healthy mindA healthy booty starts w a healthy mindA healthy booty starts w a healthy mind",
    followers: "35,4K người theo dõi",
  },
  {
    id: 4,
    name: "Bên Bến Cò Gi Vui",
    username: "benbencogivui",
    bio: "Pho Lâu Đi, Tôi Sẽ Mang Niềm Vui Đến Cho Bạn",
    followers: "34,1K người theo dõi",
  },
  {
    id: 5,
    name: "Hóng Hót Đường Phố",
    username: "honghotduongpho",
    bio: "Trang Cập Nhật Tin Tức Mới Nhất Nhanh Nhất",
    followers: "3.127 người theo dõi",
  },
];

export default function SearchPage() {
  return (
    <div className="max-w-screen-sm min-h-full mx-auto bg-white shadow-md rounded-lg p-4 mt-8 outline outline-1 outline-gray-300">
      <div className="flex justify-center items-center mb-4">
        <h2 className="text-lg font-semibold">Tìm kiếm</h2>
      </div>
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Tìm kiếm"
          className="w-full pl-10 pr-3 py-2 border bg-gray-200 rounded-md focus:outline focus:outline-1 focus:outline-gray-400"
        />
      </div>
      <div>
        <h3 className="text-sm text-gray-500 mb-2">Gợi ý theo dõi</h3>
        {suggestedUsers.map((user) => (
          <div
            key={user.id}
            className="flex items-center justify-between border-b py-3"
          >
            <div className="flex items-start space-x-3 w-full">
              <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
              <div className="flex-1 min-w-0 pr-2">
                <p className="font-semibold text-base truncate">{user.name}</p>
                <p className="text-gray-500 text-base break-words whitespace-normal">
                  {user.bio}
                </p>
                <p className="text-gray-400 text-base">{user.followers}</p>
              </div>
            </div>
            <button className="bg-black text-white text-sm px-4 py-1 rounded-md flex-shrink-0">
              Theo dõi
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
