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
            app.get('/api/goods/allGoods', (req, res) => {
                // 获取的是前端地址栏上的查询参数
                const page = parseInt(req.query.page);
                const size = parseInt(req.query.size);
                const sort = parseInt(req.query.sort);
                const gt = parseInt(req.query.priceGt);
                const lte = parseInt(req.query.priceLte);
                const cid = req.query.cid;
                let newData = []
                fs.readFile('./server/db/allGoods.json', 'utf8', (err, data) => {
                    let { result } = JSON.parse(data);
                    let allData = result.data;
                    // 分页显示
                    newData = pagination(size, page, allData);
                    if (cid === '1184') { //品牌周边
                        newData = allData.filter((item) => item.productName.match(RegExp(/Smartisan/)))
                        if (sort === 1) { //价格由低到高
                            newData = newData.sort(sortBy('salePrice', true))
                        } else if (sort === -1) { //价格由高到低
                            newData = newData.sort(sortBy('salePrice', false))
                        }
                    } else {
                        if (sort === 1) { //价格由低到高
                            newData = newData.sort(sortBy('salePrice', true))
                        } else if (sort === -1) { //价格由高到低
                            newData = newData.sort(sortBy('salePrice', false))
                        }
                        if (gt && lte) {
                            // 过滤 10~1000
                            newData = range(newData, gt, lte)
                        }
                        // 32 
            
                    }
                    if (newData.length < size) {
                        res.json({
                            data: newData,
                            total: newData.length
                        })
                    } else {
                        res.json({
                            data: newData,
                            total: allData.length
                        })
                    }
                })
            })
        }
    }
}