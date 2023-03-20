export const handleSeoTags = (item: string, toUse: any) => {
    switch (item) {
        case "title":
            return <>
                <title>{toUse}</title>
                <meta name="title" content={toUse} />
                <meta property="og:title" content={toUse} />
                <meta property="og:site_name" content={toUse} />
                <meta property="twitter:title" content={toUse} />
            </>;
        case "description":
            return <>
                <meta name="description" content={toUse} />
                <meta property="og:description" content={toUse} />
                <meta property="twitter:description" content={toUse} />
            </>;
        default:
            break;
    }
}