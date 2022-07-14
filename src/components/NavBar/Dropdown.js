import MenuItems from "./MenuItems";
const Dropdown = ({ children, dropdown, depthLevel }) => {
  depthLevel = depthLevel + 1;
  const dropdownClass = depthLevel > 1 ? "dropdown-submenu" : "";
  return (
    children.length>0?(
    <ul className={`dropdown-menu ${dropdownClass} ${dropdown ? "show" : ""}`}>
      {children.map((children, index) => (
        <MenuItems items={children} key={index} depthLevel={depthLevel} />
      ))}
    </ul>
      ):(<></>)
  );
};

export default Dropdown;