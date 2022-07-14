// import { menuItems } from "../../menuItem";
import MenuItems from "./MenuItems";
import '../../navadmin.css'
const Navbar = (props) => {
  // console.log(props.menus)
  return (
    <nav>
      <ul className="menus">
        {props.menus.map((menu, index) => {
          const depthLevel = 0;
          return <MenuItems items={menu} key={index} depthLevel={depthLevel} />;
        })}
      </ul>
    </nav>
  );
};

export default Navbar;