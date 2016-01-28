/**
 * Cache Module
 * Created by Homkai on 2015/8/8.
 */
define(function(require, exports, module){

    module.exports = {
        getItem: getItem,
        setItem: setItem,
        removeItem: removeItem,
        isSupported: isSupported
    };

    // 有个铭牌，表示缓存是自家的数据，不要跟别人的缓存混淆了
    let BRAND = 'hy-cache';

    function isSupported(){
        try{
            let ls = window.localStorage,
                j = JSON;
            return (ls && ls.getItem && ls.setItem && ls.removeItem && j && j.parse && j.stringify);
        }catch(e){
            return false;
        }
    }

    /**
     * 写cache，支持链式写法
     * @param key
     * @param value
     * @param cacheTime
     * @param version
     * @returns {boolean}
     */
    function setItem(key, value, cacheTime, version){
        if(!isSupported() || !cacheTime){
            return false;
        }
        cacheTime = cacheTime + Time.now();
        let save = {
            value: value,
            cacheTime: cacheTime,
            version: version || 0,
            brand: BRAND
        };
        window.localStorage.setItem(BRAND + '_' + key, JSON.stringify(save));
    }

    /**
     * 读cache 如果读不到返回null
     * @param key
     * @param version
     * @returns {*}
     */
    function getItem(key, version){
        if(!isSupported()){
            return false;
        }
        let save = JSON.parse(window.localStorage.getItem(BRAND + '_' + key));
        if(!save || !save.brand || (save.brand !== BRAND)) return null;
        if(save.cacheTime < Time.now()){
            removeItem(key);
            return null;
        }
        return save.value;
    }

    /**
     * 删cache，支持链式写法
     * @param key
     * @returns {removeItem}
     */
    function removeItem(key){
        if(!isSupported()){
            return false;
        }
        window.localStorage.removeItem(BRAND + '_' + key);
    }

});