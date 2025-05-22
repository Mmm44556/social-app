# Nexus - Social Web Application

- <a href="#system-architecture">系統架構 (System Design)</a>
- <a href="#development-tools">開發工具 (Development Tools)</a>
- <a href="#features">系統特色 (Features)</a>

## 專案介紹 (Project Introduction)

社群網站應用，實現了基於社群的功能，以及優化的使用者體驗。

Demo : [Nexus](https://social-ds6okaq6h-aas-projects-04d108a8.vercel.app/home)

![image](/public/previews/preview.png)

<h2 id="system-architecture"> 系統架構 (System Design) </h2>

![image](/public/previews/system-design.jpg)

<h2 id="development-tools"> 開發工具 (Development Tools) </h2>

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

<h2 id="features"> 系統特色 (Features) </h2>

- <a href="#post-system">貼文系統</a>
- <a href="#comment-system">留言系統</a>
- <a href="#follow-system">追蹤系統</a>
- <a href="#media-system">媒體功能</a>
- <a href="#message-system">即時訊息系統</a>
- <a href="#notification-system">通知系統</a>
- <a href="#rwd-design">RWD 排版設計</a>

<h3 id="post-system"> 貼文系統 </h3>

- 完整的 CRUD 操作支持
- 即時互動（按讚）計數更新
- 巢狀留言架構

![image](/public/previews/01.gif)

![image](/public/previews/03.gif)

<h3 id="comment-system"> 巢狀留言系統 </h3>

特色：使用 Closure Table 模式實現樹狀結構

- 支持無限層級的留言嵌套

![image](/public/previews/04.gif)

<h3 id="follow-system"> 追蹤系統 </h3>

- 用戶關係管理
- 重複追蹤防護

<h3 id="media-system"> 多媒體功能 </h3>

- 多圖片上傳和預覽系統
- 圖片優化和壓縮
- 雲端儲存整合

![image](/public/previews/02.gif)

<h3 id="message-system"> 即時訊息系統 </h3>

- WebSocket 即時通訊
- 離線訊息處理
- 訊息發送狀態追蹤

![image](/public/previews/05.gif)

<h3 id="notification-system"> 通知系統 </h3>

- 多類型通知支援（按讚、追蹤等）
- 已讀狀態同步

![image](/public/previews/notifications.png)

<h3 id="rwd-design"> RWD 排版設計 </h3>

![image](/public/previews/mobile-03.gif)

|                                                  |                                                      |
| ------------------------------------------------ | ---------------------------------------------------- |
| ![](/public/previews/mobile-01.png "plain text") | ![](/public/previews/mobile-02.png "Formatted text") |
