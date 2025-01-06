
import Vuex from 'vuex';

const store = new Vuex.Store({
    state: {
        permissions: [],
        shengList:[],
        shiList:[],
        quList:[],
        zhenList:[],
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
    },
    actions: {
        updatePermissions({ commit }, data) {
            commit('setPermissions', data);
        },
        updateAddress({ commit }, data) {
            commit('setAddress', data);
        },
    },
    getters: {
        
    }
});

export default store;
