import { useRef } from "react";
import CacheContext from './CacheContext';

function withKeepAlive(OldComponent, { cacheId = window.location.pathname }) {
    return function (props) {
        let divRef = useRef(null);

        let { cacheStates, dispatch, mount } = useContext(CacheContext)

        useEffect(() => {
            let cacheState = cacheStates[cacheId];

            if (cacheState && cacheState.doms) {
                //如果已经存在
                let doms = cacheState.doms;
                doms.forEach(dom => divRef.current.appendChild(dom));

            } else {
                //第一次创建
                mount({
                    cacheId, reactElement: <OldComponent {...props} />
                });
            }


        }, [mount, props])

        return (
            <div id={`withKeepAlive-${cacheId}`} ref={divRef}>
            </div>
        )
    }
}

export default withKeepAlive;

/**
 * 本组件核心思路是
 * 我们要通过缓存容器创建OldComponent对应的真实Dom, 并且进行缓存
 * 即使这个OldComponent被销毁了，缓存还可以找回来
 * 以后这个OldComponent再次渲染的时候，可以服用上次的缓存找回来
 */