function execute() {
    return Response.success([{
        title: "Danh sách truyện",
        input: "https://tienhiep.vercel.app/",
        script: "list.js"
    }]);
}
