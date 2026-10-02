load("common.js");
function execute(url) {
    try {
        var doc = readDocument(url, "main h1");
        var heading = doc.select("main h1").first();
        var info = heading.parent();
        return Response.success({
            name: heading.text(),
            cover: absoluteUrl(doc.select("main img").attr("src")),
            host: BASE_URL,
            author: info.select("p span").text(),
            description: info.select("p").last().text(),
            detail: info.select("div").first().text(),
            ongoing: info.text().indexOf("Hoàn thành") === -1
        });
    } catch (e) { return Response.error(String(e)); }
}
