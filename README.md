# 社群網站 Schema 設計

## User Model:

- 基本資料：id, email, name, password
- 個人資料：bio (簡介), avatar (頭像)
- 時間追蹤：createdAt (註冊時間), lastLogin (最後登入時間)
- 關聯：posts, shares, messages, notifications, followers/following

Post Model:

- 基本內容：content (文字內容), images (圖片 URLs)
- 時間追蹤：createdAt, updatedAt
- 關聯：author, shares, likes

Share Model:

- 用於追蹤貼文分享
- 關聯：post (被分享的貼文), user (分享的用戶)

Message Model (用於聊天功能):

- 內容：content, read (是否已讀)
- 關聯：sender, receiver
- 適合配合 WebSocket 使用

Notification Model:

- 類型：type (like, share, follow, message)
- 狀態：read (是否已讀)
- 關聯：user (接收通知的用戶)

Follow Model:

- 追蹤關係：follower (追蹤者), following (被追蹤者)
- 使用 unique constraint 避免重複追蹤

Like Model:

- 用於追蹤貼文按讚
- 使用 unique constraint 避免重複按讚

特別設計考量：

- 效能優化:
  - 所有重要查詢欄位都加上了 @@index
  - 使用 unique constraints 避免資料重複
  - 適當的關聯設計，避免過度複雜的查詢
- 擴展性:
  - 模型設計保持簡單但完整
  - 預留了擴展空間（如可以輕易添加新的通知類型）
- 實用功能:
  - 貼文支援多圖片
  - 訊息和通知都有已讀狀態追蹤
  - 完整的時間戳記追蹤

建議的後續擴展（視需求添加）：

- 可以添加 Comment model 來支援貼文評論
- 可以添加 HashTag model 來支援標籤功能
- 可以添加 UserSettings model 來管理用戶偏好設定
- 可以添加 PostPrivacy 欄位來控制貼文可見性

這個 schema 設計適合用來展示你的技術能力，因為它：
展示了資料庫關聯的理解
包含了效能優化的考量
涵蓋了現代社群網站的基本功能
程式碼組織清晰，易於理解和維護
