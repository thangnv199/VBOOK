load("common.js");
function execute(key, page) {
    try {
        return bookList(page || BASE_URL + "/?q=" + encodeURIComponent(key));
    } catch (e) { return Response.error(String(e)); }
}
