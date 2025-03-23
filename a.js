const fs = require("fs");
const path = require("path");
const { createCanvas, loadImage } = require("canvas");

// 處理圖片的主要函數
async function processImage(inputPath) {
  try {
    // 1. 檢查檔案是否存在
    if (!fs.existsSync(inputPath)) {
      throw new Error(`找不到檔案: ${inputPath}`);
    }

    // 2. 讀取檔案
    const data = await fs.promises.readFile(inputPath);

    // 3. 檢測檔案類型
    const fileType = detectFileType(data);
    if (!fileType) {
      throw new Error("無法識別檔案類型或不支援的圖片格式");
    }

    // 4. 將檔案轉換為 base64
    const base64Data = data.toString("base64");
    const dataUrl = `data:${fileType};base64,${base64Data}`;

    // 5. 載入圖片
    const img = await loadImage(dataUrl);

    // 6. 創建 canvas 並繪製圖片
    const canvas = createCanvas(img.width, img.height);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    // 7. 輸出圖片資訊
    console.log(`成功載入圖片 - 尺寸: ${img.width}x${img.height}`);

    // 8. 儲存處理後的圖片
    const outputPath = path.join(
      path.dirname(inputPath),
      `processed_${path.basename(inputPath)}.png`
    );

    const out = fs.createWriteStream(outputPath);
    const stream = canvas.createPNGStream();

    return new Promise((resolve, reject) => {
      stream.pipe(out);
      out.on("finish", () => {
        console.log(`圖片已儲存至: ${outputPath}`);
        resolve(outputPath);
      });
      out.on("error", reject);
    });
  } catch (error) {
    console.error("處理圖片時發生錯誤:", error.message);
    throw error;
  }
}

// 檢測檔案類型的輔助函數
function detectFileType(buffer) {
  const signatures = {
    "89504e47": "image/png",
    ffd8ff: "image/jpeg",
    47494638: "image/gif",
  };

  // 取得檔案的十六進位標頭
  const hex = buffer.toString("hex", 0, 4);

  // 檢查已知的檔案標頭
  for (const [signature, mimeType] of Object.entries(signatures)) {
    if (hex.startsWith(signature)) {
      return mimeType;
    }
  }

  return null;
}

// 使用範例
const inputPath = process.argv[2] || "./input.png";
processImage(inputPath)
  .then(() => console.log("處理完成"))
  .catch((error) => console.error("處理失敗:", error.message));
