/*
 * @Author: Pluto
 * @Date: 2021-11-27 19:08
 * @Description: 
 */
module.exports = {
    devServer: {
        proxy: {
            '/server': {
                target: "http://localhost:8000", // 访问的后台地址
                changeOrigin: true,
                pathRewrite: {
                    '^/server': ''
                }
            }
        }
    }
};
