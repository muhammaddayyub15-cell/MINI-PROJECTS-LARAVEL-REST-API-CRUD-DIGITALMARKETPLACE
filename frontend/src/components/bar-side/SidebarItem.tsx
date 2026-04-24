type Props = {
  item: { label: string };
  active?: boolean;
  onClick?: () => void;
};

function SidebarItem({ item, active, onClick }: Props) {
  return (
    <div
      onClick={onClick}
      className={`
        px-5 py-3 cursor-pointer transition-all duration-200
        border-l-4
        ${active 
          ? "bg-[#222] text-white border-red-600" 
          : "text-gray-400 border-transparent hover:bg-[#1a1a1a] hover:text-white"}
      `}
    >
      {item.label}
    </div>
  );
}

export default SidebarItem;