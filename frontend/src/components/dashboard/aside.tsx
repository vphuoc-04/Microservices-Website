import { Link, useLocation } from "react-router-dom";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

// Constants
import { sidebarItem } from "../../constants/sidebar";

const Aside = () => {
    const location = useLocation();
    const segment = location.pathname.split('/')[2]
    console.log(segment)

    return (
        <div className="w-70 h-screen bg-teal-600 text-white p-5 flex flex-col">
            <div className="text-lg font-bold mb-5">
                Logo
            </div>
            <div className="main-sidebar">
                {sidebarItem.map((group, index) => (
                    <div key={index}>
                        <span className="text-[13px]">{group.label}</span>
                        <div className="menu-category my-3">
                            <Accordion type="single" collapsible className="sidebar-accordion">
                                {group.items.map((item, itemIndex) => (
                                    <AccordionItem key={itemIndex} value={`item-${index}-${itemIndex}`}>
                                        <AccordionTrigger 
                                            className={`${item.active.includes(segment) ? 'text-[#a3aed1] bg-[rgba(255, 0, 0, 0.05)] !important': ''}`}
                                        >
                                            <div className="menu-label flex items-center text-black gap-3">
                                                {item.icons}
                                                <span>{item.label}</span>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent className="mt-3">
                                            <ul className="flex flex-col gap-2 ml-2 text-[15px]">
                                                {item.links.map((link, linkIndex) => (
                                                    <li key={linkIndex}>
                                                        <Link to={link.to}>
                                                            <p className="text-white p-1 pl-3 hover:bg-teal-500 w-full rounded-[5px]">{ link.title }</p>
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </AccordionContent>
                                    </AccordionItem>                   
                                ))}
                            </Accordion>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export { Aside };
