import React, { useState, useEffect } from "react";
import { LoadingOutlined } from "@ant-design/icons";
// TODO: 这一行应该会导致全量导入, 但其实我们这里只是使用了类型, 所以实际使用去单独提取到了一个单独的 d.ts 文件中
import * as AllIcons from "@ant-design/icons";

type PickProps<T> = T extends (props: infer P1) => any
    ? P1
    : T extends React.ComponentClass<infer P2>
    ? P2
    : unknown;

type AllKeys = keyof typeof AllIcons;
//  获取大写开头的导出们, 认为是组件
type PickCapitalizeAsComp<K extends AllKeys> = K extends Capitalize<K>
    ? K
    : never;
// ------------------------------------------------^ typescript 4.1+ --------
type IconNames = PickCapitalizeAsComp<AllKeys>;
// 没有 4.1 的可以手动排除 小写开头的方法们
// type IconNames = Exclude<
//   AllKeys,
//   "createFromIconfontCN" | "default" | "getTwoToneColor" | "setTwoToneColor"
// >;

export type PickIconPropsOf<K extends IconNames> = PickProps<
    typeof AllIcons[K]
>;

// 这里将不再能用 FC 来包裹, 原因的话 也可以再开一篇来讲了
const Icon = <T extends IconNames, P extends Object = PickIconPropsOf<T>>({
    name,
    ...props
}: { name: T } & Omit<P, 'name'>) => {
    const [Comp, setComp] = useState<React.ClassType<any, any, any>>(
        LoadingOutlined
    );
    useEffect(() => {
        import(`@ant-design/icons/${name}.js`).then((mod) => {
            setComp(mod.default);
        });
    }, [name]);
    return <Comp {...props} />;
};

export default Icon;
