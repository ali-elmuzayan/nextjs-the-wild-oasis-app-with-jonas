'use client';
import React, {useState} from "react";

export default function TextExpander({children}: {children: String}) {
    const [isExpanded, setIsExpanded] = useState(false);

    if (children.split(' ').length <= 20) return children
    const expandedText : string | String = isExpanded ? children : children.split(' ')
                .slice(0, 20).join(' ') + "...";

    return (
        <span>
            {expandedText} {" "}
            <button className="border-b border-primary-700 text-primary-700 hover:text-primary-900 transition-colors"
                    onClick={() => setIsExpanded(!isExpanded)}>
                {isExpanded ? "Show less" : "show more" }
            </button>
        </span>
    )

}