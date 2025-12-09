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
        <div className="flex flex-wrap gap-2">
            {filters.map((f) => (
                <button
                    key={f.key}
                    onClick={() => onChange(f.key)}
                    className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition border ${
                        currentFilter === f.key
                            ? 'bg-[#38BDF8] text-[#0F172A] border-transparent'
                            : 'bg-white/10 text-[#F8FAFC] border-white/10 hover:bg-white/15'
                    }`}
                >
                    {f.label}
                </button>
            ))}
        </div>
    );
};

export default FilterTabs;