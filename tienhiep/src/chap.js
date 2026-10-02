load("common.js");
function execute(url) {
    try {
        var doc = readDocument(url, ".reading-prose");
        var content = doc.select(".reading-prose").first();
        content.select("h1, script, style, iframe").remove();
        if (!content.text().trim()) return Response.error("Chương không có nội dung.");
        return Response.success(content.html());
    } catch (e) { return Response.error(String(e)); }
}
