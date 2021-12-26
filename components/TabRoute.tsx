import { useState } from "react";
import { Tabs } from "antd";
import { useOutlet, useNavigate, useLocation, generatePath, useParams, useRef } from "react-router-dom";
import { usePersistFn, useCreation } from "ahooks";
import memoized from "nano-memoize";

const { TabPane } = Tabs;

const getTabPath = (tab) => {
    return generatePath(tab.location.pathname, tab.params)
}

// tab的select key = location.pathname + , + matchpath 
// matchpath为 config里配置的路由路径
// 以此解决 微端情况下 tab 的 key 相同导致页面可能丢失的问题。
const generTabKey = memoized((location, matchpath) => {
    return `${location.pathname},${matchpath}`;
});

// 从key中返回 ,号后面的字符
const getTabMapKey = memoized((key) => {
    return key.substring(key.indexOf(',') + 1, key.length);
});

const TabRoute = (props) => {
    // routeConfig 为 自定义route的item项信息。
    // matchPath 为当前url 匹配的 config里路由配置路径
    const { routeConfig, matchPath } = props;

    const ele = useOutlet();

    const location = useLocation();

    const params = useParams();

    const navigate = useNavigate();

    const tabList = useRef(new map());

    // 确保location 变化后,tab要计算下
    const updateTabList = useCreation(() => {
        const tab = tabList.current.get(matchPath);
        const newTab = {
            name: routeConfig.name,
            key: generTabKey(location, matchPath),
            page: ele,
            // access:routeConfig.access,
            location,
            params
        };

        if (tab) {
            // 处理微前端情况，如发生路径修改则替换
            // 微端路由更新 如果key把key更新下
            if (tab.location.pathname !== location.pathname) {
                tabList.current.set(matchPath, newTab)
            }
        } else {
            tabList.current.set(matchPath, newTab)
        }

    }, [location]);

    const closeTab = usePersistFn((selectKey) => {
        // 记录原真实路由,微前端可能修改
        if (tabList.current.size >= 2) {
            tabList.current.delete(getTabMapKey(selectKey));
            const nextKey = _.last(Array.from(tabList.current.keys()));
            navigate(getTabPath(tabList.current.get(nextKey)), { replace: true });
        }
    });

    const selectTab = usePersistFn((selectKey) => {
        // 记录原真实路由,微前端可能修改
        navigate(getTabPath(tabList.current.get(getTabMapKey(selectKey))), { replace: true });
    });

    return (
        <Tabs
            // className={styles.tabs}
            activeKey={generTabKey(location, matchPath)}
            onChange={(key) => selectTab(key)}
            // tabBarExtraContent={operations}
            tabBarStyle={{ background: "#fff" }}
            tabPosition="top"
            animated
            tabBarGutter={-1}
            hideAdd
            type="editable-card"
            onEdit={(targetKey) => closeTab(targetKey)}
        >
            {[...tabList.current.values()].map(item => (
                <TabPane tab={item.name} key={item.key} >
                    {item.page}
                </TabPane>
            ))}
        </Tabs>
    )
}

export default TabRoute;