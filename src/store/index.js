import Vue from 'vue'
import vuex from 'vuex'
import fxdata from './data'
import urldata from './url'

Vue.use(vuex);

export default new vuex.Store({
  modules: {
    fxdata, urldata
  }
})
