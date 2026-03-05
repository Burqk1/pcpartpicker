interface Tab {
  id: string;
  label: string;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

function Tabs({ tabs, activeTab, onTabChange }: TabsProps) {
  return (
    <div className="border-b border-[var(--border-color)]">
      <div className="flex gap-0">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`px-4 py-3 text-sm font-medium transition-colors relative ${
                isActive
                  ? 'text-[#0066FF]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {tab.label}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0066FF]" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default Tabs;
