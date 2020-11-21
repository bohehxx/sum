/* global window */
import axios from 'axios'
import Cookie from "js-cookie"

axios.interceptors.response.use(response => {
  return response
}, error => {
  return Promise.reject(error.response)
});


axios.interceptors.request.use(config => {
    if (config.hasUserId) {
      const uid = Cookie.get('tf-user') && JSON.parse(Cookie.get('tf-user')).id || undefined;
      const token = Cookie.get('tf-user') && JSON.parse(Cookie.get('tf-user')).token || undefined;

      //若果headers没东西
      if (!config.headers) {
        config.headers = {}
      }

      //如果有uid并且请求头没有该字段
      if (uid && !config.headers['userId']) {
        Object.assign(config.headers, {
            'userId': uid,
            'token':token
        });
      }

    }
      return config;
})



const fetch = (options) => {
  const {method,data,url,headers,hasUserId} = options;
  switch(method.toLowerCase()) {
    case 'get':
      return axios.get(url,{params: data,hasUserId})
    case 'head':
      return axios.head(url,{data: data,hasUserId})
    case 'post':
      return axios.post(url,data,{headers: headers,hasUserId})
    default:
      return axios(options);
  }
}


export default function request (options) {

  const _options = Object.assign({hasUserId: true},options)

  return fetch(_options).then((response) => {
      //登录超时跳转到登录页
      if(response.data.code=='1'){
        Cookie.remove('tf-user')
        location.href='/admin/login'
      }
    let status = response.status
    let data = response.data

    return Promise.resolve({
      status: status,
      ...data,
    })
  }).catch((error) => {
    if(['http://static.timeface.cn'].indexOf(options.url.match(/[a-zA-z]+:\/\/[^/]*/)[0]) > - 1){
      return Promise.resolve({
        success: false,
        status: error.status,
      })
    }
    handleError(error)
  })
}


function handleError(error) {

  if (error.response && error.response.status) {
    return{
      code: error.response && error.response.status,
      msg: error.response && error.response.body || '网络发生异常'
    };
  } else {
    return{code: 504, data: {code: 'timeout', msg: '请求超时'}};
  }
}
