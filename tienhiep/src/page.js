load("common.js");
function execute(url) {
    try {
        var base = url.split("?")[0].split("#")[0].replace(/\/$/, "");
        var doc = readDocument(base, "main a[href*=/chapters/]");
        var options = doc.select("select option");
        var pages = [];
        for (var i = 0; i < options.size(); i++) {
            var option = options.get(i);
            if (/^Chương\s+\d+/.test(option.text())) {
                pages.push(base + "?chaptersPage=" + encodeURIComponent(option.attr("value")));
            }
        }
        return Response.success(pages.length ? pages : [base]);
    } catch (e) { return Response.error(String(e)); }
}
