var BASE_URL = "https://tienhiep.vercel.app";

function absoluteUrl(path) {
    if (!path) return "";
    if (/^https?:\/\//i.test(path)) return path;
    if (path.indexOf("//") === 0) return "https:" + path;
    return BASE_URL + (path.charAt(0) === "/" ? path : "/" + path);
}

// vBook cung cấp fetch đồng bộ và đối tượng HTML dùng bộ chọn jsoup.
function readDocument(url, selector) {
    var response, doc;
    try {
        response = fetch(url);
        if (response.ok) {
            doc = response.html();
            if (doc.select(selector).size() > 0) return doc;
        }
    } catch (e) {
        Console.log("fetch: " + e);
    }
    // Dự phòng khi HTML cần JavaScript để hiển thị.
    var browser = Engine.newBrowser();
    try {
        doc = browser.launch(url, 30000);
        if (!doc || doc.select(selector).size() === 0) {
            browser.callJs("void 0", 2000);
            doc = browser.html();
        }
        if (!doc || doc.select(selector).size() === 0) {
            throw new Error("Không tìm thấy vùng dữ liệu: " + selector);
        }
        return doc;
    } finally {
        browser.close();
    }
}

function bookList(url) {
    var doc = readDocument(url, "main input[type=search]");
    var links = doc.select("main a[href^=/books/]");
    var result = [];
    for (var i = 0; i < links.size(); i++) {
        var item = links.get(i);
        if (item.select("h3").size() === 0) continue;
        result.push({
            name: item.select("h3").text(),
            link: absoluteUrl(item.attr("href")),
            cover: absoluteUrl(item.select("img").attr("src")),
            description: item.text(),
            host: BASE_URL
        });
    }
    var next = "";
    var nav = doc.select("nav a");
    for (var j = 0; j < nav.size(); j++) {
        if (nav.get(j).text() === "Sau") {
            next = absoluteUrl(nav.get(j).attr("href"));
            break;
        }
    }
    return Response.success(result, next);
}
