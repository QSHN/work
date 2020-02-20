import Vue from "vue"

// Vue继承
import _g from './global.js'
copyFuns()
/**
 * @name 复制对象到Vue的原型上
 */
function copyFuns(){
	let keys = Object.keys(_g)
	keys.forEach(ele=>{
		Vue.prototype[ele]=_g[ele]
	})
}
