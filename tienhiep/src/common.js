var BASE_URL = "https://tienhiep.vercel.app";

function absoluteUrl(path) {
    if (!path) return "";
    if (/^https?:\/\//i.test(path)) return path;
    if (path.indexOf("//") === 0) return "https:" + path;
    return BASE_URL + (path.charAt(0) === "/" ? path : "/" + path);
}

function request(url) {
    var response = fetch(url, {
        headers: {
            "User-Agent": "Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 Chrome/120.0.0.0 Mobile Safari/537.36",
            "Referer": BASE_URL + "/"
        }
    });
    if (!response.ok) throw new Error("Không tải được dữ liệu: HTTP " + response.status + " — " + url);
    return response;
}

function readDocument(url, selector) {
    var doc = request(url).html();
    if (doc.select(selector).size() === 0) {
        throw new Error("Trang nguồn không có vùng dữ liệu " + selector + " — " + url);
    }
    return doc;
}

function bookUrl(url) {
    var match = String(url).match(/\/books\/([^/?#]+)/);
    if (!match) throw new Error("Link truyện không hợp lệ: " + url);
    return BASE_URL + "/books/" + match[1];
}

// Thông tin mục lục có trong dữ liệu Next.js của trang truyện.
function bookInfo(url) {
    var base = bookUrl(url);
    var html = String(request(base).text()).replace(/\\"/g, '"');
    var idMatch = html.match(/"bookId"\s*:\s*(?:"([A-Za-z0-9_-]+)"|(\d+))/);
    var countMatch = html.match(/"chapterCount"\s*:\s*(\d+)/);
    if (!idMatch || !countMatch) throw new Error("Không tìm thấy mã truyện hoặc tổng số chương.");
    return { url: base, id: idMatch[1] || idMatch[2], count: Number(countMatch[1]) };
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
