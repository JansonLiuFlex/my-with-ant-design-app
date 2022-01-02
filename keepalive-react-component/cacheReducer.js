import * as cacheTypes from './cache-type'

/**
 * 
 * @param {*} state 缓存状态
 * @param {*} action 改变状态的方法
 */
function cacheReducer(cacheStates, action) {
    let payload = action.payload;
    let { cacheId, reactElement, doms } = payload

    switch (action.type) {
        case cacheTypes.CREATE:
            return {
                ...cacheStates,
                [cacheId]: {
                    cacheId: cacheId,
                    reactElement: reactElement, //需要渲染的虚拟dom
                    doms: undefined,    //此虚拟dom对应的真实Dom
                    status: cacheTypes.CREATE,          //缓存状态 创建,
                    scrolls:{}  //滚动信息保存对象，默认为是key滚动的dom 值是滚动的位置
                }
            }
        case cacheTypes.CREATED:
            //表示真实DOM已成功创建
            return {
                ...cacheStates,
                [cacheId]: {
                    ...cacheStates[cacheId],
                    doms: doms, //真实DOM
                    status: cacheTypes.CREATED          //缓存状态 创建
                }
            }
        case cacheTypes.DESTROY:
            return {
                ...cacheStates,
                [cacheId]: {
                    ...cacheStates[cacheId],
                    status: cacheTypes.DESTROY          //缓存状态 删除
                }
            }
        default:
            return cacheStates
    }
}

export default cacheReducer