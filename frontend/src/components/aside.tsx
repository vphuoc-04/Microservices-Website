import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { SlArrowRight } from "react-icons/sl";

// Constants
import { sidebarItem } from "../constants/sidebar";

const activeSidebarItem = (isActive: boolean) => ({
    textDecoration: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    margin: "10px 20px -10px 0px",
    padding: "15px 10px",
    gap: "15px",
    borderRadius: "8px",
    border: isActive ? "1px solid rgb(255, 255, 255)" : "1px solid rgb(180, 180, 180)",
    fontSize: "14px",
    color: isActive ? "rgb(255, 255, 255)" : "rgb(180, 180, 180)",
    backgroundColor: isActive ? "rgb(66, 164, 159)" : "transparent",
    transition: "0.3s",
    cursor: "pointer",
});

const activeSubSidebarItem = (isActive: boolean) => ({
    textDecoration: "none",
    display: "flex",
    alignItems: "center",
    padding: "5px 10px",
    fontSize: "14px",
    color: isActive ? "rgb(255, 255, 255)" : "rgb(180, 180, 180)",
    transition: "0.3s",
});

const Aside = () => {
    const location = useLocation();
    const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});

    const toggleMenu = (label: string) => {
        setOpenMenus((prev) => ({ ...prev, [label]: !prev[label] }));
    };

    return (
        <div className="aside">
            <div className="sidebar-logo"></div>
            {sidebarItem.map((group, index) => (
                <div key={index} className="sidebar-group">
                    <div className="sidebar-title">{group.label}</div>
                    {group.items.map((item, itemIndex) => {
                        const isGroupActive = item.links.some((link) =>
                            location.pathname.startsWith(link.to)
                        );
                        const isOpen = openMenus[item.label] ?? false;

                        return (
                            <div key={itemIndex}>
                                <div
                                    className="sidebar-item"
                                    style={activeSidebarItem(isGroupActive)}
                                    onClick={() => toggleMenu(item.label)}
                                >
                                    <div style={{display: "flex", alignItems: "center", gap: "10px",}}>
                                        {item.icons}
                                        <span>{item.label}</span>
                                    </div>
                                    <span
                                        style={{
                                            transition: "transform 0.3s ease-in-out",
                                            display: "inline-block",
                                            transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
                                        }}
                                    >
                                        <SlArrowRight />
                                    </span>
                                </div>

                                <ul className={`sidebar-submenu ${isOpen ? "open" : ""}`}>
                                    {item.links.map((link, linkIndex) => (
                                        <li key={linkIndex}>
                                            <NavLink
                                                to={link.to}
                                                className="sidebar-subitem"
                                                style={({ isActive }) =>
                                                    activeSubSidebarItem(isActive)
                                                }
                                            >
                                                {link.title}
                                            </NavLink>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        );
                    })}
                </div>
            ))}
        </div>
    );
};

export { Aside };
