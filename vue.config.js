const fs = require('fs')
/**
 * 
 * @param {*当前页的数量} pageSize
 * @param {*当前页} currentPage 
 * @param {*当前数组} arr 
 * 
 * 总32条
 * 8
 * 1 2
 */
 function pagination(pageSize, currentPage, arr) {
    //  通过给定的每页数据的个数以及需要访问的页数，返回相应的数据
    let skipNum = (currentPage - 1) * pageSize; // 此时的 skipNum 是除去当前页，以前数据的条数
    // 判断当前页能否把数据展示完，如果能的话就展示，否则就截取数据一页数据
    let newArr = (skipNum + pageSize >= arr.length) ? arr.slice(skipNum, arr.length) : arr.slice(skipNum, skipNum + pageSize);
    return newArr;
}

// 升序还是降序
/**
 * 
 * @param {*排序的属性} attr 
 * @param {*true表示升序排序 false表示降序排序} rev 
 */

 function sortBy(attr, rev) {
    if (rev === undefined) {
        rev = 1;
    } else {
        rev = rev ? 1 : -1;
    }
    return function (a, b) { // 对sort方法传入的排序函数，如果返回值为正则表示传入的两个数应该调换位置，返回值为负，两个数的位置不需要改变
        a = a[attr];
        b = b[attr];
        if (a < b) {
            return rev * -1;
        }
        if (a > b) {
            return rev * 1;
        }
        return 0;
    }
}
// 获取相应价格的数据
function range(arr, gt, lte) {
    return arr.filter(item => item.salePrice >= gt && item.salePrice <= lte)
}

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
                    // 分页显示，此时的newDate就是当前页要展示的数据
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
                    // 此时的判断语句并不能正确的展示过滤后的数据的数量，应该先将所需要的数据过滤出来，
                    // 再将这些数据分页展示
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
            // 商品详情的数据
            app.get('/api/goods/productDet', (req, res) => {
                const productId = req.query.productId;
                // console.log(productId);
                fs.readFile('./server/db/goodsDetail.json', 'utf8', (err, data) => {
                    if (!err) {
                        let { result } = JSON.parse(data);
                        let newData = result.find(item => item.productId == productId)
                        res.json(newData)
                    }
                })
            })
        }
    }
}