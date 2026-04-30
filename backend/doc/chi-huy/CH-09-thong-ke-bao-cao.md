# CH-09 - Thống kê & Báo cáo

## Thông tin chung
- **Nhóm ngườ dùng:** Chỉ huy
- **Mã chức năng:** CH-09
- **Tên chức năng:** Thống kê & Báo cáo

## Mô tả
Xem biểu đồ và xuất báo cáo đa định dạng (Excel, PDF, Word).

## Module liên quan
- Report Module
- Chart Module
- Export Module
- Achievement Module
- Tuition Module

## Luồng hoạt động chi tiết

### 1. Thống kê học tập
1. Thống kê số lượng học viên, điểm trung bình.
2. Biểu đồ: cột, tròn, đường.
3. Báo cáo tổng hợp xuất theo mẫu.

### 2. Thống kê xếp loại Đảng viên, Đoàn viên
1. Thống kê xếp loại rèn luyện theo từng học kỳ và năm học.
2. Phân loại: Xuất sắc, Khá, Trung bình, Yếu.
3. Xếp loại Đảng viên: dựa trên `party_rating` trong `yearly_results`.
4. Xếp loại Đoàn viên: dựa trên `training_rating` trong `yearly_results`.
5. Báo cáo xuất theo mẫu Word/PDF.

### 3. Thống kê tình hình khen thưởng, kỷ luật toàn đơn vị
1. Tổng hợp từ `achievements` và `yearly_achievements`.
2. Thống kê theo năm, theo loại (khen thưởng Bộ, khen thưởng NN).
3. Phân loại: tiên tiến, thi đua, đề tài NCKH.

### 4. Theo dõi và báo cáo tình trạng học phí
1. Thống kê từ `tuition_fees`.
2. Phân loại: Đã thanh toán, Chưa thanh toán, Còn nợ.
3. Báo cáo công nợ theo học kỳ/năm học.
4. Xuất biên lai/báo cáo Word hoặc PDF.

## Giao diện & API
- `GET /api/commander/reports/academic` — Báo cáo học tập
- `GET /api/commander/reports/party-training` — Báo cáo xếp loại Đảng/Đoàn
- `GET /api/commander/reports/achievements` — Báo cáo khen thưởng
- `GET /api/commander/reports/tuition` — Báo cáo học phí
- `GET /api/commander/reports/export` — Xuất báo cáo (Excel/PDF/Word)

## Dữ liệu & Database
- Bảng: `yearly_results` (party_rating, training_rating), `achievements`, `yearly_achievements`, `tuition_fees`

## Lưu ý bảo mật / Quyền hạn
- Chỉ chỉ huy được phép xem báo cáo toàn đơn vị.
- Báo cáo xuất có watermark và số trang.
