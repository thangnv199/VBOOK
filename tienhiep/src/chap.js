load("common.js");
function execute(url) {
    try {
        var doc = readDocument(url, ".reading-prose");
        doc.select(".reading-prose h1, .reading-prose script, .reading-prose style, .reading-prose iframe").remove();
        var content = doc.select(".reading-prose");
        if (!String(content.text()).trim()) return Response.error("Chương không có nội dung: " + url);
        return Response.success(content.html());
    } catch (e) { return Response.error(String(e)); }
}
