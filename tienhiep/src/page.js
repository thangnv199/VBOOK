load("common.js");
function execute(url) {
    try {
        var info = bookInfo(url);
        var pages = [];
        for (var i = 0; i < Math.ceil(info.count / 100); i++) {
            pages.push(info.url + "?chaptersPage=" + i + "&vbookId=" + encodeURIComponent(info.id));
        }
        if (!pages.length) return Response.error("Truyện chưa có chương.");
        return Response.success(pages);
    } catch (e) { return Response.error(String(e)); }
}
