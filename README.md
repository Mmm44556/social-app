# Social Web Application

## 專案介紹

社群網站應用，實現了基於社群的功能，以及優化的使用者體驗。

Demo : [Nexus](https://social-ds6okaq6h-aas-projects-04d108a8.vercel.app/home)

### 前端技術

- **Next.js 15.2.3** (React 18)
- **TailwindCSS**
- **Shadcn UI**
- **Framer Motion**
- **React Query**
- **Clerk** (OAuth)

### 後端架構

- **Prisma ORM**
- **PostgreSQL**
- **WebSocket**

### 部署服務

- **Vercel**

- **Supabase**

## 實作功能

### 1. 貼文系統

- 完整的 CRUD 操作支持
- 即時互動（按讚）計數更新
- 巢狀留言架構

### 2. 巢狀留言系統

特色：使用 Closure Table 模式實現樹狀結構

- 支持無限層級的留言嵌套
- O(1) 複雜度查詢

### 3. 追蹤系統

- 用戶關係管理
- 重複追蹤防護

### 4. 多媒體功能

- 多圖片上傳和預覽系統
- 圖片優化和壓縮
- 雲端儲存整合

### 5. 即時訊息系統

- WebSocket 即時通訊
- 離線訊息處理
- 訊息發送狀態追蹤

### 6. 通知系統

- 多類型通知支援（按讚、追蹤等）
- 已讀狀態同步
