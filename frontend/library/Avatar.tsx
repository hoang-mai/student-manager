"use client";

import React from "react";
import { HiOutlineUser } from "react-icons/hi";
import Image from "next/image";

export interface AvatarProps {
  src?: string | null;
  alt?: string;
  size?: number | string;
  className?: string;
  iconSize?: number;
}

/**
 * Component hiển thị ảnh đại diện hoặc icon mặc định.
 * Được thiết kế theo phong cách "Tactical Transparency" với bo góc đặc trưng.
 *
 * @param src - Đường dẫn ảnh đại diện (URL). Nếu null hoặc undefined sẽ hiện icon mặc định.
 * @param alt - Văn bản thay thế cho ảnh đại diện.
 * @param size - Kích thước của container (ví dụ: "3rem" hoặc 44). Mặc định là 2.75rem (w-11).
 * @param className - Các class Tailwind bổ sung cho container bên ngoài.
 * @param iconSize - Kích thước của icon người dùng mặc định.
 */
const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = "Avatar",
  size = "2.75rem",
  className = "",
  iconSize = 22,
}) => {
  return (
    <div
      className={`rounded-2xl bg-white p-0.5 shrink-0 shadow-sm overflow-hidden ${className}`}
      style={{ width: size, height: size }}
    >
      <div className="w-full h-full rounded-[14px] flex items-center justify-center text-primary-700 bg-primary-50 overflow-hidden">
        {src ? (
          <Image
            src={src}
            alt={alt}
            width={50}
            height={50}
            className="w-full h-full object-cover rounded-[14px]"
          />
        ) : (
          <HiOutlineUser size={iconSize} />
        )}
      </div>
    </div>
  );
};

export default Avatar;
