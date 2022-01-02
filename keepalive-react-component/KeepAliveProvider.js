
import React, { useCallback, useReducer } from 'react'
import cacheReducer from './cacheReducer';
import CacheContext from './CacheContext';
import * as cacheTypes from './cache-type'


function KeepAliveProvider(props) {
    //cacheStates存放所有缓存信息，dispatch派发动作方法，可以通过派发动作修改缓存信息
    let [cacheStates, dispatch] = useReducer(cacheReducer, {});

    const mount = useCallback((cacheId, reactElement) => {
        if (!cacheStates[cacheId]) {
            dispatch({ type: cacheTypes.CREATE, payload: { cacheId, reactElement } });
        } else {
            let cacheState = cacheStates[cacheId];
            if (cacheState.status === cacheTypes.DESTROY) {
                let doms = cacheState.doms; //获取 到老的真实doms
                doms.forEach(dom => dom.parentNode.removeChild(dom));
            }
            dispatch({ type: cacheTypes.CREATE, payload: { cacheId, reactElement } });
        }

    }, [cacheStates]);

    let handleScroll = useCallback(
        (cacheId, event) => {
            if (cacheStates[cacheId]) {
                let target = event.target;
                let scrolls = cacheStates[cacheId].scrolls;
                scrolls[target] = target.scrollTop;
            }
        },
        [cacheStates]
    )



    return (
        <CacheContext.Provider value={{ cacheStates, dispatch, mount, handleScroll }}>
            {props.children}
            {
                Object.values(cacheStates).filter(cacheState => cacheState.status !== cacheTypes.DESTROY).map(
                    ({ cacheId, reactElement }) => (
                        <div id={`cache-${cacheId}`} key={cacheId} ref={
                            //如果给原生组件添加了ref，那么当此真实DOM渲染到页面之后会执行回调函数
                            (divDOM) => {
                                let cacheState = cacheStates[cacheId];
                                if (cacheState && (!cacheState.doms || cacheState.status === cacheTypes.DESTROY)) {
                                    let doms = Array.from(divDOM.childNodes);
                                    dispatch({ type: cacheTypes.CREATED, payload: { cacheId, doms } })
                                }
                            }
                        }>{reactElement}</div>//divDom儿子们就是这个reactElement渲染出来的真实DOM
                    )
                )
            }
        </CacheContext.Provider>
    )
}

export default KeepAliveProvider;
