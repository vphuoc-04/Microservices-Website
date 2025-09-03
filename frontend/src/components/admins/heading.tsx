import React from "react"
import {
  Breadcrumb,
  BreadcrumbItem as UIBreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

type Crumb = { title: string; route: string }

interface PageHeadingProps {
  breadcrumb: Crumb | Crumb[]   
}

const PageHeading: React.FC<PageHeadingProps> = ({ breadcrumb }) => {
    const crumbs: Crumb[] = Array.isArray(breadcrumb) ? breadcrumb : [breadcrumb]
    const last = crumbs[crumbs.length - 1]

    return (
        <div className="page-heading py-[20px] bg-white mb-3 shadow-sm">
            <div className="px-[15px]">
                <h2 className="text-[24px] mb-[5px]">{last?.title ?? ""}</h2>
                <Breadcrumb>
                    <BreadcrumbList>
                        {crumbs.map((item, index) => (
                            <React.Fragment key={`${item.route}-${index}`}>
                                {index > 0 && <BreadcrumbSeparator />}
                                <UIBreadcrumbItem>
                                {/* <Link to={item.route}>{item.title}</Link> */}
                                <span>{item.title}</span>
                                </UIBreadcrumbItem>
                            </React.Fragment>
                        ))}
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
        </div>
    )
}

export default PageHeading
