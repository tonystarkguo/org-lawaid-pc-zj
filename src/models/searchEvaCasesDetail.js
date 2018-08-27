import { routerRedux } from 'dva/router'
import pathToRegexp from 'path-to-regexp'
import { config } from '../utils'
import { getDataService, postDataService } from '../services/commonService'
import samplePDF from './test.pdf';

const { api } = config

export default {
  namespace: 'searchEvaCasesDetail',
  state: {
    file: samplePDF,
    pageIndex: null,
    pageNumber: null,
    pageRenderCount: 0,
    pageWidth: 700,
    total: null,
  },
  effects: {
    
  },
  reducers: {
    changeTotal(state, action){
      return {
        ...state,
        total: action.payload
      }
    },

    changePage(state, action){
      const { pageIndex, pageNumber } = action.payload
      return {
        ...state,
        pageIndex: pageIndex,
        pageNumber: pageNumber
      }
    },

    changePageCount(state, action){
      return {
        ...state,
        pageRenderCount: action.payload
      }
    },

    handlePrevious(state, action){
      return {
        ...state,
        pageIndex: action.payload
      }
    },

    handleNext(state, action){
      console.log(action.payload)
      return {
        ...state,
        pageIndex: action.payload
      }
    },
  },
  subscriptions: {
    setup({dispatch, history}) {
      history.listen(() => {
        const match = pathToRegexp('/searchEvaCasesDetail/:id').exec(location.pathname)
        if (match) {
          console.log('进来了！！')
        }
      })
    }
  },
}
