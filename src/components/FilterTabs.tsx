type Filter = 'all' | 'incomplete' | 'completed';

type FilterTabsProps = {
    currentFilter: Filter;
    onChange: (filter: Filter) => void;
};

/**
 * FilterTabs コンポーネント
 * タスクリストの表示条件（全件／未完了／完了）を切り替えるタブ
 *
 * @param {'all' | 'incomplete' | 'completed'} currentFilter - 現在の選択中フィルター
 * @param {Function} onChange - フィルター変更時に呼ばれる関数
 */
const FilterTabs = ({ currentFilter, onChange }: FilterTabsProps) => {
    const filters: { key: Filter; label: string }[] = [
        { key: 'all', label: 'すべて' },
        { key: 'incomplete', label: '未完了' },
        { key: 'completed', label: '完了' },
    ];

    return (
        <div className="flex justify-center gap-4 py-3">
            {filters.map((f) => (
                <button
                    key={f.key}
                    onClick={() => onChange(f.key)}
                    className={`px-4 py-1 rounded-full transition-colors font-medium
                    ${currentFilter === f.key
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-white'}
                    hover:opacity-80`}
                >
                    {f.label}
                </button>
            ))}
        </div>
    );
};

export default FilterTabs;