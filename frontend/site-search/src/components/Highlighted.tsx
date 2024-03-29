import React, { ReactNode } from "react";

interface Props {
    children?: ReactNode;
    highlight?: string;
}



const Highlighter = ({ children, highlight }: Props) => {
    if (!highlight) return children;
    // console.log('CHILDREN', { children })
    const regexp = new RegExp(highlight, 'g');
    const matches = (children as string).match(regexp);
    // var parts = children?.split(new RegExp(`${highlight.replace()}`, 'g'));
    // var parts = (children as string).split(new RegExp(`${highlight.replace('', '')}`, 'g'));
    var parts = (children as string).split(new RegExp(`${highlight.replace('', '')}`, 'g'));

    for (var i = 0; i < parts.length; i++) {
        if (i !== parts.length - 1) {
            let match = matches[i];
            // While the next part is an empty string, merge the corresponding match with the current
            // match into a single <span/> to avoid consequent spans with nothing between them.
            // console.log('PRE match', { match })
            while (parts[i + 1] === '') {
                const newMatch = matches[++i];
                // EPD - Custom fix here, making sure 'undefined' isn't appended after number records occasionally
                if (newMatch !== undefined) match += newMatch;
            }


            (parts[i] as any) = (
                <React.Fragment key={i}>
                    {parts[i]}<span className="highlighted">{match}</span>
                </React.Fragment>
            );
        }
    }
    return <div className="highlighter">{parts}</div>;
};

export default Highlighter