load("common.js");
function execute(url, page) {
    try { return bookList(page || url); }
    catch (e) { return Response.error(String(e)); }
}
