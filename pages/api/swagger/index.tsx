import { useState } from "react";

const baseUrl = "http://192.168.1.244:31240";
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiYWRtaW4iLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IlZNSHVIT2E3OUU2QVZGUi1rODR1bVEiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL2dyb3Vwc2lkIjoiYW43SDItbmYwRVNmLXBmX282bU1uZyIsInd3dy5pZGNtLmlvOndlYmlzaXRlbmFtZSI6InByZWlkY20iLCJleHAiOjE2NDAwODgwNTAsImlzcyI6IklkY21Jc3N1ZXIiLCJhdWQiOiJJZGNtQXVkaWVuY2UifQ.R_y9jl41OpKvd49HOckIWw67k7nsXEvuq8waPAoTv7k";

const swagger_arr = [
  ["foundation", "http://192.168.1.244:30238/swagger/v1/swagger.json"],
  ["foundationwebsite", "http://192.168.1.244:31240/swagger/v1/swagger.json"],
  ["foundationcms", "http://192.168.1.244:30741/swagger/v1/swagger.json"],
];

async function getAsync(url = "", query = {}) {
  let res = {
    data: {},
    error: {},
  };

  try {
    let arr = Object.keys(query);
    if (arr.length > 0) {
      let query_params = "";

      if (url.indexOf("?") === -1) {
        query_params += "?";
      }

      query_params = arr
        .map((_prop) => {
          return `${_prop}=${query[_prop]}`;
        })
        .join("&");
    }

    const response = await fetch(url, {
      method: "Get",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
    })
      .then((res) => res.json())
      .catch((error) => (res.error = error));

    res.data = response;
  } catch (err) {
    res.error = err;
  }
  return res;
}

async function postAysnc(url = "", data = {}) {
  let res = {
    data: {},
    error: {},
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .catch((error) => (res.error = error));
    res.data = response.json();
  } catch (err) {
    res.error = err;
  }
  return res;
}

export default async function swagggerHandler(req, res) {
  const {
    query: { id, name },
    method,
  } = req;

  const { info, paths, components } = await fetch(
    "http://192.168.1.244:31240/swagger/v1/swagger.json"
  )
    .then((res) => res.json())
    .catch((res) => console.log(res));

  const [swagger_test_result, setResult] = useState([]);
  Object.keys(paths).map((key) => {
    let obj = paths[key];
    let { post, get } = obj;

    if (!!get && Object.keys(get).length > 0) {
      let method_name = key.substring(key.lastIndexOf("/") + 1, key.length);

      if (method_name === "GetList") {
        let request_url = baseUrl + key;

        getAsync(request_url, { pageIndex: 1, pageSize: 20 }).then((res) => {
          let test_obj = {};
          test_obj["title"] = request_url;
          if (!!res.data && !res.data["StatusCode"]) {
            // console.log(res.data);
            test_obj["result"] = res.data;
            test_obj["status"] = 200;
            // console.log("status:success 200 \n");
          } else {
            test_obj["error"] = res.error;
            test_obj["status"] = res.data["StatusCode"];
            // console.log(res.error);
            // console.log('status:failed ${res.data["StatusCode"] \n');
          }

          setResult(oldArray =>[...oldArray , test_obj])
        });
      }
    }
  });

  switch (method) {
    case "GET":
      // Get data from your database
      res.status(200).json({
        data: swagger_test_result,
      });
      break;
    case "PUT":
      // Update or create data in your database
      res.status(200).json({ id, name: name || `User ${id}` });
      break;
    default:
      res.setHeader("Allow", ["GET", "PUT"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
