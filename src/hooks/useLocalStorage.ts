import { useState, useEffect } from 'react';

/**
 * カスタムフック：localStorageとReact stateを同期する
 *
 * @template T - 任意のデータ型
 * @param {string} key - localStorageに保存する際のキー
 * @param {T} initialValue - localStorageにデータが存在しない場合の初期値
 * @returns {[T, (value: T) => void]} 現在の値と更新関数のペア（読み込み専用として `as const` で固定）
 *
 * @example
 * const [tasks, setTasks] = useLocalStorage<Task[]>('todo-tasks', []);
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
    // 状態の初期化：localStorageから読み込む（存在しなければ初期値を使用）
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? (JSON.parse(item) as T) : initialValue;
        } catch (error) {
            console.error(`useLocalStorage: 読み込みエラー (${key})`, error);
            return initialValue;
        }
    });

    // 状態が変わるたびにlocalStorageへ書き込み
    useEffect(() => {
        try {
            window.localStorage.setItem(key, JSON.stringify(storedValue));
        } catch (error) {
            console.error(`useLocalStorage: 保存エラー (${key})`, error);
        }
    }, [key, storedValue]);

    // 状態とその更新関数を返す
    return [storedValue, setStoredValue] as const;
}