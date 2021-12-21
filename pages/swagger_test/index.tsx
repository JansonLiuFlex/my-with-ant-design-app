import { useRouter } from "next/router";
import useSwr from "swr";
import { List, Avatar, Typography } from "antd";

const { Text } = Typography;
const fetcher = (url) => fetch(url).then((res) => res.json());

export default function Swagger_Test() {
  const router = useRouter();
  console.log(router);
  const { data, error } = useSwr("/api/swagger", fetcher);

  console.log(data);
  if (error) return <div>Failed to load user</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <List
      itemLayout="horizontal"
      dataSource={data.data}
      renderItem={(item) => (
        <List.Item>
          <List.Item.Meta
            avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
            title={<a href="https://ant.design">{item.title}</a>}
            description={<Text type="danger">{item.error}</Text>}
          />
          <Text>{item.status}</Text>
        </List.Item>
      )}
    />
  );
}
