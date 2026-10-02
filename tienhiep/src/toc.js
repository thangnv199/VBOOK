load("common.js");
function execute(url) {
    try {
        var base = bookUrl(url);
        var idMatch = String(url).match(/[?&]vbookId=([^&#]+)/);
        var id = idMatch ? decodeURIComponent(idMatch[1]) : bookInfo(url).id;
        if (!/^[A-Za-z0-9_-]+$/.test(String(id))) return Response.error("Mã truyện không hợp lệ.");
        var pageMatch = String(url).match(/[?&]chaptersPage=(\d+)/);
        var page = pageMatch ? Number(pageMatch[1]) : 0;
        var response = request(BASE_URL + "/api/books/" + encodeURIComponent(id) + "/chapters?page=" + page);
        var payload = JSON.parse(String(response.text()));
        var links = payload.chapters;
        if (!links || !links.length) return Response.error("API không trả về chương cho nhóm " + page + ".");
        var chapters = [], seen = {};
        for (var i = 0; i < links.length; i++) {
            var number = Number(links[i].chapter_number);
            if (!number || number < 1) return Response.error("Số chương không hợp lệ.");
            var title = String(links[i].title || "Chương " + number);
            var target = base + "/chapters/" + number;
            if (seen[target]) continue;
            seen[target] = true;
            chapters.push({ name: title, url: target, host: BASE_URL });
        }
        return Response.success(chapters);
    } catch (e) { return Response.error(String(e)); }
}
