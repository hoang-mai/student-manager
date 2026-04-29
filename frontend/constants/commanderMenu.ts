import { 
  HiOutlineUserGroup, 
  HiOutlineOfficeBuilding, 
  HiOutlineIdentification, 
  HiOutlineCheckCircle, 
  HiOutlineStop, 
  HiOutlineCalendar, 
  HiOutlineCash, 
  HiOutlineAcademicCap, 
  HiOutlineChartBar, 
  HiOutlineClipboardList, 
  HiOutlineViewGrid,
  HiOutlineHome
} from 'react-icons/hi';

export type MenuItem = {
  title: string;
  path: string;
  icon: any;
  code: string;
};

export const COMMANDER_MENU: MenuItem[] = [
  {
    title: 'Tổng quan',
    path: '/commander',
    icon: HiOutlineHome,
    code: 'DASHBOARD',
  },
  {
    title: 'Tài khoản học viên',
    path: '/commander/accounts',
    icon: HiOutlineUserGroup,
    code: 'CH-01',
  },
  {
    title: 'Cơ sở đào tạo',
    path: '/commander/training-units',
    icon: HiOutlineOfficeBuilding,
    code: 'CH-02',
  },
  {
    title: 'Hồ sơ học viên',
    path: '/commander/profiles',
    icon: HiOutlineIdentification,
    code: 'CH-03',
  },
  {
    title: 'Phê duyệt đề xuất',
    path: '/commander/approvals',
    icon: HiOutlineCheckCircle,
    code: 'CH-04',
  },
  {
    title: 'Quản lý thành tích',
    path: '/commander/achievements',
    icon: HiOutlineStop,
    code: 'CH-05',
  },
  {
    title: 'Lịch học & Cắt cơm',
    path: '/commander/schedules',
    icon: HiOutlineCalendar,
    code: 'CH-06',
  },
  {
    title: 'Quản lý học phí',
    path: '/commander/tuition',
    icon: HiOutlineCash,
    code: 'CH-07',
  },
  {
    title: 'Quản lý học kỳ',
    path: '/commander/semesters',
    icon: HiOutlineAcademicCap,
    code: 'CH-08',
  },
  {
    title: 'Thống kê & Báo cáo',
    path: '/commander/statistics',
    icon: HiOutlineChartBar,
    code: 'CH-09',
  },
  {
    title: 'Phân công lịch trực',
    path: '/commander/duty-roster',
    icon: HiOutlineClipboardList,
    code: 'CH-10',
  },
  {
    title: 'Tiện ích hỗ trợ',
    path: '/commander/utilities',
    icon: HiOutlineViewGrid,
    code: 'CH-11',
  },
];
