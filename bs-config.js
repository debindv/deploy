module.exports = {
    port: process.env.PORT,
    files: ["./front-end.{html,css,png}","./routes.{js}","./views.{ejs}"],
    server: {
        baseDir: ["./"]
    }
}