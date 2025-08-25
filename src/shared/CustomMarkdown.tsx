import ReactMarkdown, { defaultUrlTransform } from "react-markdown";
import remarkGfm from "remark-gfm";
import { useAppStore } from "../app/AppStore";

const CustomMarkdown = ({ markdown }: { markdown: string }) => {
    const openNote = useAppStore((s) => s.openCompendiumNote);

    return (
        <ReactMarkdown
            urlTransform={(url) => {
                if (url.startsWith('compendium:'))
                    return url;
                return defaultUrlTransform(url);
            }}
            remarkPlugins={[remarkGfm]}
            components={{
                a: ({ href, children, ...props }) => {
                    if (href?.startsWith('compendium:')) {
                        const noteId = href.replace('compendium:', '');
                        return (
                            <button
                                className="text-blue-600 underline cursor-pointer"
                                onClick={() => openNote(noteId)}
                            >
                                {children}
                            </button>
                        );
                    }
                    return <a href={href} {...props} > {children}</a>
                }

            }}
        >
            {markdown}
        </ReactMarkdown >
    )
}

export default CustomMarkdown;
