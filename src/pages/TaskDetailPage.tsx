import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Task, Comment } from '../utils/types';
import { addCommentToTask, removeCommentFromTask } from '../utils/taskHelpers';

type TaskDetailPageProps = {
    tasks: Task[];
    onUpdateTask: (task: Task) => void;
    onEditRequest: (task: Task) => void;
};

/**
 * タスク詳細ページ
 * コメントと履歴を表示・管理
 */
const TaskDetailPage = ({ tasks, onUpdateTask, onEditRequest }: TaskDetailPageProps) => {
    const { taskId } = useParams<{ taskId: string }>();
    const navigate = useNavigate();
    const [commentBody, setCommentBody] = useState('');
    const [commentError, setCommentError] = useState('');

    const task = tasks.find((t) => t.id === taskId);

    if (!task) {
        return (
            <div className="min-h-screen bg-[#0F172A] text-[#F8FAFC] antialiased">
                <div className="max-w-4xl mx-auto px-6 py-10">
                    <div className="rounded-2xl border border-white/10 bg-white/5 shadow-sm backdrop-blur-sm p-8">
                        <h1 className="text-2xl font-semibold mb-4">タスクが見つかりません</h1>
                        <button
                            onClick={() => navigate('/')}
                            className="px-4 py-2 rounded-lg bg-[#38BDF8] text-[#0F172A] font-medium hover:opacity-95 transition"
                        >
                            一覧に戻る
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const handleAddComment = () => {
        const trimmed = commentBody.trim();
        if (!trimmed) {
            setCommentError('コメントを入力してください');
            return;
        }
        if (trimmed.length > 500) {
            setCommentError('コメントは500文字以内で入力してください');
            return;
        }

        const updatedTask = addCommentToTask(task, trimmed);
        onUpdateTask(updatedTask);
        setCommentBody('');
        setCommentError('');
    };

    const handleDeleteComment = (commentId: string) => {
        if (!confirm('このコメントを削除しますか？')) return;
        const updatedTask = removeCommentFromTask(task, commentId);
        onUpdateTask(updatedTask);
    };

    const formatDateTime = (isoString?: string) => {
        if (!isoString) return '—';
        const date = new Date(isoString);
        return new Intl.DateTimeFormat('ja-JP', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        }).format(date);
    };

    const formatDate = (isoString?: string) => {
        if (!isoString) return '—';
        const date = new Date(isoString);
        return new Intl.DateTimeFormat('ja-JP', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        }).format(date);
    };

    const statusLabels = {
        todo: '未着手',
        in_progress: '進行中',
        done: '完了',
    };

    const priorityColors = {
        高: 'text-red-400',
        中: 'text-yellow-400',
        低: 'text-green-400',
    };

    const comments = task.comments || [];
    const history = task.history || [];

    return (
        <div className="min-h-screen bg-[#0F172A] text-[#F8FAFC] antialiased">
            <div className="max-w-6xl mx-auto px-6 py-10">
                {/* Header */}
                <header className="mb-8">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => navigate('/')}
                            className="text-sm text-[#38BDF8] hover:underline"
                        >
                            ← 一覧に戻る
                        </button>
                        <button
                            onClick={() => onEditRequest(task)}
                            className="px-4 py-2 rounded-lg bg-white/10 border border-white/10 hover:bg-white/15 transition text-sm font-medium"
                        >
                            編集
                        </button>
                    </div>
                </header>

                {/* Layout: PC=2カラム、Mobile=縦並び */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left: Task Overview (lg:col-span-2) */}
                    <section className="lg:col-span-2 space-y-6">
                        {/* Task Info Card */}
                        <div className="rounded-2xl border border-white/10 bg-white/5 shadow-sm backdrop-blur-sm p-6 sm:p-8">
                            <h1 className="text-3xl font-semibold mb-4">{task.title}</h1>

                            <div className="space-y-4">
                                {/* Status */}
                                <div>
                                    <span className="text-sm text-[#F8FAFC]/70">ステータス:</span>{' '}
                                    <span
                                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                                            task.status === 'done'
                                                ? 'bg-green-500/20 text-green-300'
                                                : task.status === 'in_progress'
                                                  ? 'bg-blue-500/20 text-blue-300'
                                                  : 'bg-gray-500/20 text-gray-300'
                                        }`}
                                    >
                                        {statusLabels[task.status]}
                                    </span>
                                </div>

                                {/* Priority & Tag */}
                                <div className="flex flex-wrap gap-4">
                                    {task.priority && (
                                        <div>
                                            <span className="text-sm text-[#F8FAFC]/70">優先度:</span>{' '}
                                            <span className={`font-medium ${priorityColors[task.priority]}`}>
                                                {task.priority}
                                            </span>
                                        </div>
                                    )}
                                    {task.tag && (
                                        <div>
                                            <span className="text-sm text-[#F8FAFC]/70">タグ:</span>{' '}
                                            <span className="font-medium text-[#38BDF8]">{task.tag}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Dates */}
                                <div>
                                    <span className="text-sm text-[#F8FAFC]/70">期限:</span>{' '}
                                    {task.startDate || task.endDate ? (
                                        <>
                                            {task.startDate && formatDate(task.startDate)}
                                            {task.startDate && task.endDate && ' 〜 '}
                                            {task.endDate && formatDate(task.endDate)}
                                        </>
                                    ) : (
                                        <span className="text-[#F8FAFC]/50">期限なし</span>
                                    )}
                                </div>

                                {/* Description */}
                                {task.description && (
                                    <div>
                                        <div className="text-sm text-[#F8FAFC]/70 mb-2">詳細:</div>
                                        <p className="text-[#F8FAFC]/90 whitespace-pre-wrap">{task.description}</p>
                                    </div>
                                )}

                                {/* Created/Updated */}
                                <div className="text-xs text-[#F8FAFC]/50 space-y-1">
                                    <div>作成: {formatDateTime(task.createdAt)}</div>
                                    <div>更新: {formatDateTime(task.updatedAt)}</div>
                                </div>
                            </div>
                        </div>

                        {/* Comments Section */}
                        <div className="rounded-2xl border border-white/10 bg-white/5 shadow-sm backdrop-blur-sm p-6 sm:p-8">
                            <h2 className="text-xl font-semibold mb-4">コメント ({comments.length})</h2>

                            {/* Add Comment */}
                            <div className="mb-6">
                                <textarea
                                    value={commentBody}
                                    onChange={(e) => {
                                        setCommentBody(e.target.value);
                                        setCommentError('');
                                    }}
                                    placeholder="コメントを入力..."
                                    rows={3}
                                    className={`w-full px-3.5 py-2.5 rounded-lg bg-white/10 text-[#F8FAFC] placeholder:text-[#F8FAFC]/60 border ${
                                        commentError
                                            ? 'border-red-400 focus:ring-red-400'
                                            : 'border-white/10 focus:ring-[#38BDF8]'
                                    } focus:outline-none focus:ring-2`}
                                />
                                {commentError && <p className="mt-1 text-xs text-red-300">{commentError}</p>}
                                <button
                                    onClick={handleAddComment}
                                    className="mt-2 px-4 py-2 rounded-lg bg-[#38BDF8] text-[#0F172A] font-medium hover:opacity-95 transition text-sm"
                                >
                                    コメント追加
                                </button>
                            </div>

                            {/* Comments List */}
                            <div className="space-y-4">
                                {comments.length === 0 ? (
                                    <p className="text-[#F8FAFC]/50 text-sm">コメントはまだありません。</p>
                                ) : (
                                    comments
                                        .slice()
                                        .reverse()
                                        .map((comment: Comment) => (
                                            <div
                                                key={comment.id}
                                                className="p-4 rounded-lg bg-white/5 border border-white/10"
                                            >
                                                <div className="flex items-start justify-between mb-2">
                                                    <div className="text-sm font-medium text-[#38BDF8]">
                                                        {comment.author}
                                                    </div>
                                                    <button
                                                        onClick={() => handleDeleteComment(comment.id)}
                                                        className="text-xs text-red-400 hover:underline"
                                                    >
                                                        削除
                                                    </button>
                                                </div>
                                                <p className="text-[#F8FAFC]/90 whitespace-pre-wrap mb-2">
                                                    {comment.body}
                                                </p>
                                                <div className="text-xs text-[#F8FAFC]/50">
                                                    {formatDateTime(comment.createdAt)}
                                                </div>
                                            </div>
                                        ))
                                )}
                            </div>
                        </div>
                    </section>

                    {/* Right: History Timeline */}
                    <section className="lg:col-span-1">
                        <div className="rounded-2xl border border-white/10 bg-white/5 shadow-sm backdrop-blur-sm p-6">
                            <h2 className="text-xl font-semibold mb-4">履歴</h2>
                            <div className="space-y-3">
                                {history.length === 0 ? (
                                    <p className="text-[#F8FAFC]/50 text-sm">履歴はまだありません。</p>
                                ) : (
                                    history
                                        .slice()
                                        .reverse()
                                        .map((item) => (
                                            <div key={item.id} className="border-l-2 border-[#38BDF8] pl-3">
                                                <div className="text-sm text-[#F8FAFC]/90">{item.message}</div>
                                                <div className="text-xs text-[#F8FAFC]/50 mt-1">
                                                    {formatDateTime(item.at)}
                                                </div>
                                            </div>
                                        ))
                                )}
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default TaskDetailPage;
