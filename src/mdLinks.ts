export function transformWikiLinks(md: string): string {
    // [[Title|id]] or [[id]]
    return md.replace(/\[\[([\w\s\-,'".!?#/]+?)(?:\|([\w\-]+))?\]\]/g, (_m, a, b) => {
        const title = (b ? a : a).trim();
        const id = (b ?? a).trim().replace(/\s+/g, "-"); // simple sanitize
        return `[${title}](compendium:${id})`;
    });
}
