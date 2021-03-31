const fs = require('fs')
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');
const cartListJSON = require('./server/db/cartList.json');
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
            // 处理跨域
            app.use(cors())
            // 处理post请求
            app.use(bodyParser.json())
            app.use(bodyParser.urlencoded({extended: false}))
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
            // 模拟一个登陆的接口
            app.post('/api/login', (req, res) => {
                // 登录成功获取用户名
                let username = req.body.user
                //一系列的操作
                res.json({
                    // 进行加密的方法
                    // sign 参数一：加密的对象 参数二：加密的规则 参数三：对象
                    token: jwt.sign({ username: username }, 'abcd', {
                        // 过期时间
                        expiresIn: "3000s"
                    }),
                    username,
                    state: 1,
                    file: '/static/images/1570600179870.png',
                    code: 200,
                    address: null,
                    balance: null,
                    description: null,
                    email: null,
                    message: null,
                    phone: null,
                    points: null,
                    sex: null,
                    id: 62
                })
            })
            // 登录持久化验证接口 访问这个接口的时候 一定要访问token（前端页面每切换一次，就访问一下这个接口，问一下我有没有登录/登陆过期）
            // 先访问登录接口，得到token，在访问这个，看是否成功
            app.post('/api/validate', function (req, res) {
                // 获取请求头中的authorization字段
                let token = req.headers.authorization;
                console.log(token);

                // 验证token合法性 对token进行解码
                jwt.verify(token, 'abcd', function (err, decode) {
                    if (err) {
                        res.json({
                            msg: '当前用户未登录'
                        })
                    } else {
                        // 证明用户已经登录
                        res.json({
                            token: jwt.sign({ username: decode.username }, 'abcd', {
                                // 过期时间
                                expiresIn: "3000s"
                            }),
                            username: decode.username,
                            msg: '已登录',
                            address: null,
                            balance: null,
                            description: null,
                            email: null,
                            file: "/static/images/1570600179870.png",
                            id: 62,
                            message: null,
                            phone: null,
                            points: null,
                            sex: null,
                            state: 1,
                        })
                    }
                })
            })
            app.post('/api/addCart', (req, res) => {
                let { userId, productId, productNum } = req.body;
                fs.readFile('./server/db/allGoods.json', (err, data) => {
                    let { result } = JSON.parse(data);
                    if (productId && userId) {
                        let { cartList } = cartListJSON.result.find(item => item.id == userId)
                        // 找到对应的商品
                        let newData = result.data.find(item => item.productId == productId);
                        newData.limitNum = 100;
                        // 表示购物车中不存在此商品
                        let falg = true;
                        if (cartList && cartList.length) {
                            cartList.forEach(item => {
                                if (item.productId == productId) {
                                    if (item.productNum >= 1) {
                                        falg = false;
                                        item.productNum += parseInt(productNum);
                                    }
                                }
                            })
                        }
                        // 当购物车中没有商品时，执行词语
                        if (!cartList.length || falg) {  //购物车为空
                            newData.productNum = parseInt(productNum)
                            cartList.push(newData);
                        }
            
                        // 序列化
            
                        fs.writeFile('./server/db/cartList.json', JSON.stringify(cartListJSON), (err) => {
                            if (!err) {
                                res.json({
                                    code: 200,
                                    message: "success",
                                    result: 1,
                                    success: true,
                                    timestamp: 1571296313981,
                                })
                            }
                        })
                    }
            
                })
            
            })
        }
    }
}