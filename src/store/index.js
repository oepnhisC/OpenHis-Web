
import Vuex from 'vuex';

const store = new Vuex.Store({
    state: {
        permissions: [],
        shengList:[],
        shiList:[],
        quList:[],
        zhenList:[],
        keshiID:'',
    },
    mutations: {
        setPermissions(state, data) {
            state.permissions = data;
        },
        setAddress(state, data) {
            state.shengList = data.shengList;
            state.shiList = data.shiList;
            state.quList = data.quList;
            state.zhenList = data.zhenList;
        },
        setKeshiID(state, data) {
            state.keshiID = data;
        },
  
    },
    actions: {
        updatePermissions({ commit }, data) {
            commit('setPermissions', data);
        },
        updateAddress({ commit }, data) {
            commit('setAddress', data);
        },
        updateKeshiID({ commit }, data) {
            commit('setKeshiID', data);
        },
    },
    getters: {
        
    }
});

export default store;
