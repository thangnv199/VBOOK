load("common.js");
function execute(url) {
    try {
        var doc = readDocument(url, "main h1");
        var status = doc.select("main h1 ~ div > span").text();
        return Response.success({
            name: doc.select("main h1").text(),
            cover: absoluteUrl(doc.select("main img").attr("src")),
            host: BASE_URL,
            author: doc.select("main h1 + p span").text(),
            description: doc.select("meta[name=description]").attr("content"),
            detail: status,
            ongoing: status.indexOf("Đang ra") >= 0
        });
    } catch (e) { return Response.error(String(e)); }
}
