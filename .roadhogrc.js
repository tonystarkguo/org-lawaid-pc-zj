const path = require('path')

const svgSpriteDirs = [
  path.resolve(__dirname, 'src/svg/'),
  require.resolve('antd').replace(/index\.js$/, ''),
]

export default {
  entry: 'src/index.js',
  svgSpriteLoaderDirs: svgSpriteDirs,
  "theme": "./theme.config.js",
  "env": {
      "development": {
        "extraBabelPlugins": [
          "dva-hmr",
          "transform-runtime",
  		    ["import", { "libraryName": "antd", "style": true }]
        ]
      },
      "production": {
        "extraBabelPlugins": [
          "transform-runtime",
  		    ["import", { "libraryName": "antd", "style": true}]
        ]
      }
  },
  "proxy": {
    /*"/opm": {
      "target": "https://dev-lawaid-opm-api.fabaogd.com",
      "changeOrigin": true,
      "secure": false
      /*,
      "pathRewrite": { "^/api/v1" : "" }
    },*/

    "/orm": {
      // "target": "https://dev-lawaid-opm-api.fabaogd.com",
      // http://118.178.118.223
      // "target": "http://118.178.118.224:2003",   //测试服务器      
      // "target": "http://192.168.26.201:3003",   //胜斌      
      "target": "http://120.78.71.239:2003",   //阿里云     
      // "target": "http://192.168.26.200:2003",   //李杰
      // "target": "http://192.168.26.161:2003",   //腾腾   
      "changeOrigin": true,
      "secure": false,
      "pathRewrite": { "^/api/v1" : "" }
    },
    "/opm": {
      // "target": "https://dev-lawaid-opm-api.fabaogd.com",
      "target": "http://192.168.26.133:3003",
      // "target": "http://192.168.26.200:2003",   //李杰
      "changeOrigin": true,
      "secure": false,
      "pathRewrite": { "^/api/v1" : "" }
    },
    "/hp": {
      // "target": "https://dev-lawaid-opm-api.fabaogd.com",
      "target": "http://192.168.26.201:4012",
      "changeOrigin": true,
      "secure": false,
      "pathRewrite": { "^/api/v1" : "" }
    },
    //this is to get the oss policy, signature
    "/oss": {
      // "target": "http://192.168.26.201:3003",  //胜斌      
      "target": "http://120.78.71.239:2003",   //阿里云
      // "target": "http://192.168.26.200:2003",   //李杰
      "changeOrigin": true,
      "secure": false,
      "pathRewrite": { "^/oss" : "/orm/zhejiang/oss" }
    },

    "/uploadtopri": {//This is for upload attachments to oss private busket
      "target": "http://bestone-lawaid-zhj.oss-cn-shenzhen.aliyuncs.com",
      // "target": "http://bestone-lawaid-zj.oss-cn-hangzhou.aliyuncs.com",
      "changeOrigin": true,
      "secure": false,
      "pathRewrite": {'^/uploadtopri' : ''}
    },

    "/uploadtopub": {//This is for upload attachments to  to oss public busket
      "target": "http://public-content-zhj.oss-cn-shenzhen.aliyuncs.com",
      // "target": "http://public-content-zj.oss-cn-hangzhou.aliyuncs.com",
      "changeOrigin": true,
      "secure": false,
      "pathRewrite": {'^/uploadtopub' : ''}
    },

    
  }
}
