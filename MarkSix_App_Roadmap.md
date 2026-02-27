# 香港六合彩 App 開發與上架全攻略 (React Native 版)

這份指南將帶領你從零開始構建一個具備隨機抽號、實時數據抓取及廣告收入功能的跨平台手機 App。

## 1. 環境準備 (Pre-requisites)
由於你希望兼顧找工作和上架兩大平台，我們選用 **React Native (Expo)** 作為開發工具。

### A. 基礎開發環境
- **Node.js**: 前端開發的核心環境。
- **Git**: 版本控制。
- **VS Code**: 推薦的編程編輯器。

### B. 平台相關 (上架必備)
- **Windows 用戶**: 主要開發 Android 版。若要編譯 iOS 版，最終需要一部 Mac 或使用雲端編譯服務 (如 Expo Application Services)。
- **Mac 用戶**: 可以同時開發 iOS 和 Android。
- **手機**: 下載 **Expo Go** App (用於實機即時預覽)。

---

## 2. 建立項目 (Project Initialization)
在終端機執行以下命令：

```bash
# 建立一個新的 React Native (Expo) 項目
npx create-expo-app MarkSixApp --template blank

# 進入文件夾
cd MarkSixApp

# 安裝必要的 UI 組件庫
npx expo install react-native-paper lucide-react-native
```

---

## 3. 核心功能開發 (Development Steps)

### Step 1: UI 介面設計 (User-friendly UI)
- 使用 `react-native-paper` 提供的卡片 (Card) 和按鈕 (Button)。
- 設計一個大圓圈顯示開獎號碼，增加視覺吸引力。

### Step 2: 隨機抽號邏輯 (Random Generator)
- 撰寫一個 Function 從 1-49 中隨機抽取 6 個不重複的數字並排序。

### Step 3: 數據抓取 (Data Fetching) & $0 成本後端
- **策略**: 使用 **Vercel Serverless Functions** 託管後端，達成 $0 成本。
- **防止流量爆掉**:
    - 使用 **Edge Caching (CDN)**：設定 Cache-Control Header，讓數據在 Vercel 節點緩存 30 分鐘，避免重複執行代碼。
    - 降低額度消耗，即便有萬人訪問，實際執行 API 的次數也很少。
- **目標網址**: `https://bet.hkjc.com/ch/marksix/home`
- **抓取內容**: 最新一期結果、下期攪珠日期、金多寶金額。

---

## 4. 廣告盈利 (Monetization)
接入 **Google AdMob** 是最直接的賺錢方式。

1. **註冊帳號**: 到 [Google AdMob](https://admob.google.com/) 註冊。
2. **安裝插件**: `npx expo install react-native-google-mobile-ads`
3. **廣告類型**:
   - **Banner (橫幅廣告)**: 放在 App 底部。
   - **Interstitial (插屏廣告)**: 在用戶生成號碼後彈出（注意不要太頻繁，以免影響體驗）。

---

## 5. 上架流程 (Deployment)

### Apple App Store (iOS)
1. **付費**: 加入 Apple Developer Program (US$99/年)。
2. **Xcode**: 在 Mac 上使用 Xcode 進行打包。
3. **審核**: 提交 App Store Connect，需準備截圖、Icon 和隱私政策聲明。

### Google Play Store (Android)
1. **付費**: 註冊 Google Play Console (US$25 一次性)。
2. **打包**: 生成 AAB 文件。
3. **測試**: 目前個人帳號需找 20 人進行 14 天測試（這是現在最難的一步，建議找朋友或社交媒體群組幫忙）。

---

## 6. 職場建議 (Career Advice)
- **TypeScript**: 在開發過程中使用 TypeScript 而非純 JavaScript，這在找工作時是極大的加分項。
- **State Management**: 學習使用 **Zustand** 或 **Redux Toolkit** 管理 App 數據。
- **Portfolio**: 將這個 App 的源代碼上傳到 GitHub，並在 Resume 中展示 App Store 的下載連結，這是實力的最強證明。

---

## 8. 開發技能與代碼規範 (Developer Skills & Standards)
為了確保代碼易於維護、高效且符合職場標準，我們將遵循以下原則：

### A. Clean Code (整潔代碼)
- **單一職責 (Single Responsibility)**：一個 Component 只做一件事（例如：`Ball.tsx` 只負責顯示號碼球，`LotterySection.tsx` 負責邏輯）。
- **命名規範**：變量名需具描述性（例如：用 `generateRandomNumbers` 而非 `getNums`）。

### B. Efficient (高效性能)
- **Memoization**：使用 `useMemo` 和 `useCallback` 避免不必要的重複計算與渲染。
- **API 性能**：如前所述，在後端使用 Edge Caching，前端則緩存已讀取的開獎結果，減少網絡請求。

### C. Readable (易讀性)
- **TypeScript 強類型**：為所有數據結構定義 `interface`（例如：`MarkSixResult`），減少 Bug 並讓其他開發者易於理解。
- **一致性格式**：使用 ESLint 和 Prettier 保持代碼風格統一。
- **註釋**：只在複雜邏輯處添加註釋，代碼本身應儘量做到「自解釋 (Self-documenting)」。

https://code.claude.com/docs/en/skills
---

## 9. 下一步行動
1. 運行 `npx create-expo-app` 建立項目。
2. 嘗試在 `App.js` 中寫出隨機抽取 6 個數字的 logic。
3. 如果需要，我可以幫你寫出第一個版本的代碼框架。
