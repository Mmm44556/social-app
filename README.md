# Social Web Application

社群網站應用，實現了基於社群的功能，以及優化的使用者體驗。

### 前端技術

- **Next.js 15.2.3** (React 19)
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

## 已完成功能

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

## 開發中功能 🚧

以下功能正在積極開發中：

### 3. 分享功能

- 貼文分享機制
- 分享統計和追蹤
- 跨平台分享支援

### 4. 即時通知系統

採用 WebSocket 實現即時推送：

- 多類型通知支援（按讚、追蹤等）
- 已讀狀態同步

## 技術實現重點

### 資料庫優化

1. Closure Table 實現

```sql
-- 高效能的樹狀查詢結構
CREATE TABLE comment_closure (
    ancestor_id   UUID,
    descendant_id UUID,
    depth         INT,
    PRIMARY KEY (ancestor_id, descendant_id)
);
```

2. 效能優化措施

- 交易完整性保證
- 軟刪除機制

## 本地開發

### 環境需求

- Node.js >= 18
- PostgreSQL >= 14
- npm >= 9

### 快速開始

1. 安裝依賴

```bash
npm install
```

2. 環境設置

```bash
# .env
DATABASE_URL="postgresql://..."
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
```

3. 啟動開發環境

```bash
npm run dev
```

### 開發工具

```bash
# Prisma 相關命令
npm run prisma:generate    # 生成 Prisma Client
npm run prisma:migrate     # 執行資料庫遷移
npm run prisma:studio     # 啟動 Prisma Studio
```
