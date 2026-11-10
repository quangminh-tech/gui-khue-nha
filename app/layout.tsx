import type { Metadata } from 'next';
import './globals.css';
export const metadata:Metadata={title:'Gửi Khuê Nhã · Sổ tay cá nhân',description:'Todo, checklist, lịch, Pomodoro và trợ lý tùy chọn. Một món quà cho những ngày thật nhẹ.',icons:{icon:'/brand/favicon.png',apple:'/brand/apple-touch-icon.png'},manifest:'/manifest.webmanifest'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="vi"><body>{children}</body></html>}
