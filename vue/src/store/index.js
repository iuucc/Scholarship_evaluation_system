import Vue from "vue"
import Vuex from "vuex"
import router from "@/router";
Vue.use(Vuex)

const store=new Vuex.Store({
    state:{
        currentPathName:''
    },
    mutations:{
        setPath(state){
            state.currentPathName=localStorage.getItem("currentPathName")
        },
        logout(){
            localStorage.removeItem("user")
            localStorage.removeItem("menus")
            localStorage.removeItem("files")
            localStorage.removeItem("file")
            localStorage.removeItem("userAll")
            localStorage.removeItem("user")
            router.push("/login").then(r => {
                console.log("success")
            })
        }
    }
})
export default store