
import Vuex from 'vuex';

const store = new Vuex.Store({
    state: {
        permissions: [],
    },
    mutations: {
        setPermissions(state, data) {
            state.permissions = data;
        },
    },
    actions: {
        updatePermissions({ commit }, data) {
            commit('setPermissions', data);
        },
    },
    getters: {
        
    }
});

export default store;
