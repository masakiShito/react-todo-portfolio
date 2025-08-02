import { useState } from 'react';
import type { Task, Priority, Tag } from '../utils/types';

const TodoInput = ({ onAddTask }: { onAddTask: (task: Task) => void }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState<Priority>('中');
    const [tag, setTag] = useState<Tag>('開発');
    const [dueDate, setDueDate] = useState('');

    const handleSubmit = () => {
        if (title.trim() === '') return;

        const newTask: Task = {
            id: crypto.randomUUID(),
            title,
            description,
            completed: false,
            priority,
            tag,
            dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
        };

        onAddTask(newTask);

        // 初期化
        setTitle('');
        setDescription('');
        setPriority('中');
        setTag('開発');
        setDueDate('');
    };

    return (
        <div className="bg-white p-4 rounded shadow space-y-4">
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="タスクのタイトル"
                className="w-full p-2 border rounded"
            />
            <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="詳細（任意）"
                className="w-full p-2 border rounded"
            />
            <div className="flex gap-4 flex-wrap">
                <div>
                    <label className="block text-sm font-semibold">優先度</label>
                    <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value as Priority)}
                        className="border p-2 rounded"
                    >
                        <option value="高">高</option>
                        <option value="中">中</option>
                        <option value="低">低</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-semibold">タグ</label>
                    <select
                        value={tag}
                        onChange={(e) => setTag(e.target.value as Tag)}
                        className="border p-2 rounded"
                    >
                        <option value="開発">開発</option>
                        <option value="レビュー">レビュー</option>
                        <option value="MTG">MTG</option>
                        <option value="その他">その他</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-semibold">期限</label>
                    <input
                        type="datetime-local"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className="border p-2 rounded"
                    />
                </div>
            </div>
            <button
                onClick={handleSubmit}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full"
            >
                タスクを追加
            </button>
        </div>
    );
};

export default TodoInput;