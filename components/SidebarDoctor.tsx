import Link from "next/link";

export const SidebarDoctor = ({
  type,
  activeTab,
  handleTabClick,
  getIcon,
  name,
  icon,
  title,
  label,
}: any) => {
  return (
    <Link href={label ? `/${type}?page=${name.trim()}` : ""}>
      <li
        className={`flex items-center space-x-2 cursor-pointer border border-transparent hover:border-white p-2 rounded-md transition ${
          activeTab === name ? "bg-blue-700 font-bold border-white" : ""
        }`}
        onClick={() => handleTabClick(name)}
      >
        {getIcon(icon)}
        <span>{title}</span>
      </li>
    </Link>
  );
};
