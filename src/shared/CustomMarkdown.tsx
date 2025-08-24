import ReactMarkdown from "react-markdown";
import { useLocation, useNavigate } from "react-router-dom"

const CustomMarkdown = ({ markdown }: { markdown: string }) => {

    return (
        <ReactMarkdown
            components={{
                a({ node, href, children, ...props }) {
                    if (href?.startsWith('compendium:')) {
                        const noteId = href.substring('compendium:'.length);
                        return (
                            <button
                                className="text-blue-600 underline cursor-pointer"
                                onClick={() => openNoteModal(noteId)}
                            >
                                {children}
                            </button>);
                    }

                    return <a {...props} href={href}>{children}</a>
                }
            }}
        >
            {markdown}
        </ReactMarkdown>
    )
}

export default CustomMarkdown;
