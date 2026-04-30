# Tài liệu mô tả chức năng hệ thống

Thư mục này chứa tài liệu chi tiết cho từng tính năng của hệ thống, được tổ chức theo nhóm ngườ dùng.

## Cấu trúc thư mục

```
doc/
├── README.md                          # File này
├── DATABASE.md                        # Thiết kế database (21 bảng)
├── hoc-vien/                          # Chức năng dành cho Học viên
│   ├── HV-01-dang-nhap-quan-ly-tai-khoan.md
│   ├── HV-02-quan-ly-thong-tin-ca-nhan.md
│   ├── HV-03-xem-ket-qua-hoc-tap.md
│   ├── HV-04-de-xuat-ket-qua-hoc-tap.md
│   ├── HV-05-theo-doi-trang-thai-de-xuat.md
│   ├── HV-06-quan-ly-lich-hoc.md
│   ├── HV-07-xem-lich-cat-com-tu-dong.md
│   ├── HV-08-xem-thanh-tich-va-hoc-phi.md
│   └── HV-09-thong-bao.md
├── chi-huy/                           # Chức năng dành cho Chỉ huy
│   ├── CH-01-quan-ly-tai-khoan-hoc-vien.md
│   ├── CH-02-quan-ly-co-so-dao-tao.md
│   ├── CH-03-quan-ly-ho-so-hoc-vien.md
│   ├── CH-04-phe-duyet-de-xuat.md
│   ├── CH-05-quan-ly-thanh-tich.md
│   ├── CH-06-quan-ly-lich-hoc-cat-com.md
│   ├── CH-07-quan-ly-hoc-phi.md
│   ├── CH-08-quan-ly-hoc-ky.md
│   ├── CH-09-thong-ke-bao-cao.md
│   ├── CH-10-phan-cong-lich-truc.md
│   └── CH-11-tien-ich-ho-tro.md
└── quan-tri-vien/                     # Chức năng dành cho Quản trị viên
    ├── QTV-01-phan-quyen-nguoi-dung.md
    └── QTV-02-quan-tri-tai-khoan-toan-he-thong.md
```

## Danh sách chức năng

### Học viên
| Mã | Tên chức năng | Mô tả |
|:---|:---|:---|
| HV-01 | Đăng nhập & quản lý tài khoản | Đăng nhập, đổi mật khẩu, JWT token, bcrypt |
| HV-02 | Quản lý thông tin cá nhân | Xem và tự cập nhật hồ sơ, thông tin quân nhân |
| HV-03 | Xem kết quả học tập | Bảng điểm chi tiết, GPA/CPA, biểu đồ tiến bộ |
| HV-04 | Đề xuất kết quả học tập | Tạo yêu cầu thêm/sửa/xóa điểm + upload minh chứng |
| HV-05 | Theo dõi trạng thái đề xuất | Xem trạng thái: Chờ duyệt / Đã duyệt / Từ chối |
| HV-06 | Quản lý lịch học | Xem TKB, thêm môn tự chọn, kiểm tra trùng lịch |
| HV-07 | Xem lịch cắt cơm tự động | Tự động sinh lịch ăn từ TKB, điều chỉnh thủ công |
| HV-08 | Xem thành tích và học phí | Khen thưởng, giải thưởng, trạng thái đóng học phí |
| HV-09 | Thông báo | Nhận thông báo tự động: điểm, đề xuất, cắt cơm |

### Chỉ huy
| Mã | Tên chức năng | Mô tả |
|:---|:---|:---|
| CH-01 | Quản lý tài khoản học viên | Tạo hàng loạt, gán quyền, khóa, reset mật khẩu |
| CH-02 | Quản lý cơ sở đào tạo | CRUD trường ĐH, chuyên ngành, phân lớp |
| CH-03 | Quản lý hồ sơ học viên | Nhập/sửa/xóa/tìm kiếm, xuất Excel |
| CH-04 | Phê duyệt đề xuất | Duyệt/từ chối yêu cầu cập nhật điểm, tự động tính lại CPA |
| CH-05 | Quản lý thành tích | Khen thưởng, đề tài NCKH, đánh giá rèn luyện |
| CH-06 | Quản lý lịch học & cắt cơm | Điều chỉnh ca học, tự động ghi danh cắt cơm, xuất Excel |
| CH-07 | Quản lý học phí | Gán học phí, cập nhật thanh toán, xuất biên lai Word/PDF |
| CH-08 | Quản lý học kỳ | Tạo học kỳ, thiết lập mốc thờ gian (đăng ký, thi, nhập điểm) |
| CH-09 | Thống kê & Báo cáo | Xếp loại Đảng/Đoàn, khen thưởng, học phí, biểu đồ |
| CH-10 | Phân công lịch trực | Lịch trực tuần/tháng, phân ca, thông báo nhắc |
| CH-11 | Tiện ích hỗ trợ | Chuyển đổi hệ điểm 4/10/chữ, tính GPA/CPA nhanh |

### Quản trị viên
| Mã | Tên chức năng | Mô tả |
|:---|:---|:---|
| QTV-01 | Phân quyền ngườ dùng | Tạo vai trò (Role), gán quyền (Permission), RBAC |
| QTV-02 | Quản trị tài khoản toàn hệ thống | Cấp phát tài khoản mới, CRUD, backup, giám sát |

## Quy trình nghiệp vụ tiêu biểu

### Quy trình cập nhật điểm
```
Học viên gửi yêu cầu → Đính kèm minh chứng → Chỉ huy kiểm tra → Phê duyệt
→ Hệ thống tự động:
   1. Cập nhật điểm vào subject_results
   2. Tính lại GPA semester_results
   3. Tính lại CPA yearly_results
   4. Cập nhật current_cpa4/10 trong students
   5. Gửi thông báo cho học viên
```

### Quy trình cắt cơm
```
Cập nhật lịch học → Hệ thống quét điều kiện thờ gian
→ Tự động ghi danh vào danh sách cắt cơm ngày tương ứng
→ Đánh dấu is_auto_generated = true
→ Gửi thông báo cho học viên
```
