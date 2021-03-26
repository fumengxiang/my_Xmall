const fs = require('fs')
module.exports={
	lintOnSave: false,
    // 在配置文件中生成服务器，此服务器就运行在项目的接口中
    devServer: {
        // 
        before(app, serve) {
            app.get('/api/goods/home', (req, res) => {
                fs.readFile('./server/db/home.json','utf-8', (err, data) => {
                    if (!err) {
                        res.json(JSON.parse(data))
                    }
                })
            })
        }
    }
}