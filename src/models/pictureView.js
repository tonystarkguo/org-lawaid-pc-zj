import { routerRedux } from 'dva/router'
import pathToRegexp from 'path-to-regexp'
import { config } from '../utils'
import { getDataService, postDataService } from '../services/commonService'

const { api } = config

export default {
  namespace: 'pictureView',
  state: {
    current: 0,
    picArr: [{
      url: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1504090988003&di=6cf409830e6368d3d66f29de27239a1d&imgtype=0&src=http%3A%2F%2Fbizhi.zhuoku.com%2F2009%2F08%2F30%2Fjingxuan%2Fzhuoku019.jpg'
    },{
      url: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1504090988003&di=350f443ddd8ed1d7d3acbf457f6710c9&imgtype=0&src=http%3A%2F%2Fimg2.niutuku.com%2Fdesk%2F1208%2F2037%2Fntk-2037-2910.jpg'
    },{
      url: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1504090988002&di=25c8d6b981fa9b240540b3940b54ae31&imgtype=0&src=http%3A%2F%2Fbizhi.zhuoku.com%2Fbizhi2008%2F1223%2Fjingxuan%2FZhuoku148.jpg'
    }]
  },
  effects: {
    
  },
  reducers: {
    handlePrevious(state, action){
      return {
        ...state,
        current: action.payload
      }
    },

    handleNext(state, action){
      return {
        ...state,
        current: action.payload
      }
    },
  },
  subscriptions: {
    setup({dispatch, history}) {
      history.listen(() => {
        const match = pathToRegexp('/pictureView/:id').exec(location.pathname)
        if (match) {
          console.log('进来了！！')
        }
      })
    }
  },
}
