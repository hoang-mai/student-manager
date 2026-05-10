import { useEffect } from "react";

interface UseInfiniteScrollProps {
  /** Hàm callback để tải thêm dữ liệu */
  callback: () => void;
  /** Điều kiện để cho phép tải tiếp (ví dụ: hasNextPage từ react-query) */
  hasNextPage?: boolean;
  /** Trạng thái đang tải dữ liệu để tránh gọi trùng lặp */
  isFetching?: boolean;
  /** Khoảng cách từ đáy màn hình để bắt đầu kích hoạt callback (mặc định: 100px) */
  threshold?: number;
}

/**
 * Custom hook để xử lý việc tải thêm dữ liệu khi cuộn xuống cuối trang
 */
export const useInfiniteScroll = ({
  callback,
  hasNextPage,
  isFetching,
  threshold = 100,
}: UseInfiniteScrollProps) => {
  useEffect(() => {
    const handleScroll = () => {
      // Chiều cao toàn bộ nội dung của trang
      const scrollHeight = document.documentElement.scrollHeight;
      // Vị trí hiện tại của thanh cuộn
      const scrollTop = document.documentElement.scrollTop;
      // Chiều cao vùng nhìn thấy của trình duyệt
      const clientHeight = document.documentElement.clientHeight;

      // Kiểm tra nếu người dùng đã cuộn đến ngưỡng (threshold) ở cuối trang
      if (scrollTop + clientHeight >= scrollHeight - threshold) {
        if (hasNextPage && !isFetching) {
          callback();
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [callback, hasNextPage, isFetching, threshold]);
};
