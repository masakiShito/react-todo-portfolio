# React + TypeScript + Vite で作るモダンなTodoアプリ（ポートフォリオ）

## 概要

ネイビーブラック × スカイブルー × ホワイトグレーの配色で、シンプルかつスタイリッシュなTodoアプリを構築。アクセシビリティ/バリデーション/レイアウトを重視し、ポートフォリオとして拡張性を示す。

## スタック

- React 18
- TypeScript
- Vite
- Tailwind CSS
- ESLint

## 機能

- 追加 / 編集 / 削除 / 完了トグル
- フィルタ（すべて / 未完了 / 完了）
- 属性: 優先度・タグ・期限
- ローカルストレージ永続化（カスタムフック）
- アクセシビリティ対応（aria属性、フォーカスリング）

## UI / レイアウト

- コンテナ: `max-w-6xl`
- グリッド: `md:grid-cols-3`（入力1、一覧2）
- カード: 角丸・半透明ホワイト（`bg-white/5`, `border-white/10`）
- 配色: 背景`#0F172A` / アクセント`#38BDF8` / テキスト`#F8FAFC`

## 主要コンポーネント

- `App.tsx`: レイアウトとタスク状態管理（追加/削除/編集/トグル）
- `TodoInput.tsx`: 入力フォーム + バリデーション（aria対応）
- `FilterTabs.tsx`: フィルタ切り替え（アクティブはアクセント色）
- `TodoList.tsx`: フィルタ済みの一覧
- `TodoItem.tsx`: 単一タスクの表示・編集

## バリデーション

- 仕様は`docs/バリデーション.md`
- 実装は`src/utils/validation.ts`の`validateTask`
- チェック項目
  - タイトル: 必須 / 100文字以内 / 重複禁止
  - 説明: 1000文字以内
  - 優先度: 高/中/低のみ
  - タグ: 開発/レビュー/MTG/その他のみ
  - 期限: 形式妥当性 / 過去日時禁止
- `TodoInput`で送信前検証、エラーメッセージをフィールド直下に表示、`aria-invalid`/`aria-describedby`を付与

## アクセシビリティ

- フォーカスリングはアクセントカラー（`#38BDF8`）で明示
- エラーは`aria-describedby`で紐づけ
- セレクト/日時入力はダーク背景でも見やすいように`bg-white text-[#0F172A]`

## ディレクトリ構成（抜粋）

```text
src/
  components/
    TodoInput.tsx
    FilterTabs.tsx
    TodoList.tsx
    TodoItem.tsx
  hooks/
    useLocalStorage.ts
  utils/
    types.ts
    validation.ts
docs/
  デザイン.md
  バリデーション.md
  追加機能.md
```

## 実装ポイント（抜粋コード）

- `App.tsx`のレイアウト

```tsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  <section className="md:col-span-1">{/* 入力 */}</section>
  <section className="md:col-span-2">{/* 一覧 */}</section>
</div>
```

- バリデーション適用（`TodoInput.tsx`）

```tsx
const { valid, errors } = validateTask(input, tasks);
if (!valid) return; // エラー表示後に中断
```

## 改善点/拡張アイデア（`docs/追加機能.md`）

- 期限優先ソート / 検索 / 一括操作
- 詳細ページ / 編集履歴 / アーカイブ
- 繰り返しタスク / PWA通知 / 共有・エクスポート
- i18n / PWA化 / カレンダー・看板ビュー

## セットアップ

```sh
npm install
npm run dev
```

## まとめ

UI/UX・アクセシビリティ・堅牢なバリデーションを備えたTodoアプリ。シンプルな構成で拡張しやすく、ポートフォリオとして技術選定と設計力を示すことができます。
