export const routes = [
    {
        title: "首页",
        icon: "AppstoreOutlined",
        path: "/",
        isExpand: false,
        children: []
    },
    {
        title: "登录页",
        icon: "MenuUnfoldOutlined",
        path: "/login",
        isExpand: false,
        children: []
    },
    {
        title: "Dashboard",
        icon: "MenuFoldOutlined",
        path: "/admin/dashboard",
        isExpand: false,
        children: []
    },
    {
        title: "商品管理",
        icon: "PieChartOutlined",
        isExpand: true,
        children: [
            {
                title: "列表页",
                path: "/admin/products"
            },
            {
                title: "编辑页",
                path: "/admin/products/edit"
            }
        ]
    }
]

