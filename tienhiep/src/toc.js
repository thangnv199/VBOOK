load("common.js");
function execute(url) {
    try {
        var doc = readDocument(url, "main a[href*=/chapters/] span.truncate");
        var links = doc.select("main a[href*=/chapters/]");
        var chapters = [], seen = {};
        for (var i = 0; i < links.size(); i++) {
            var link = links.get(i);
            var title = link.select("span.truncate").text();
            var target = absoluteUrl(link.attr("href"));
            if (!title || seen[target]) continue;
            seen[target] = true;
            chapters.push({ name: title, url: target, host: BASE_URL });
        }
        return Response.success(chapters);
    } catch (e) { return Response.error(String(e)); }
}
