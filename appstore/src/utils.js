const domain = "https://wide-cathode-402602.uc.r.appspot.com"; //记录部署之后的url的domain的地方
//部署之后不写端口号则为默认端口号, 443

//这个是一个功能函数,来处理后端返回的响应
const handleResponseStatus = (response, errMsg) => {
  //传入两个参数,一个是后端返回的response,一个是后端的错误消息
  const { status, ok } = response;

  //这个代码的高级之处就是把401单独拿出来处理
  if (status === 401) {
    //unauthorized,缺少验证身份的, 未登录状态, authToken过期了
    localStorage.removeItem("authToken"); // web local storage去移除了authToken,移除了authToken这个key对应的value
    window.location.reload();
    //window是浏览器最大global object, 去刷新
    return;
  }

  if (!ok) {
    //只要不是200都throw Error, 把后端传过来的errMsg放进throw Error里,未来的UI层会catch住,然后在页面上显示一个错误消息
    throw Error(errMsg);
  }
};

//下面都是对应后端写的API请求
//这个函数叫login, 所以传入的credential是账户和密码
export const login = (credential) => {
  const url = `${domain}/signin`; //先把请求的url写出来, domain是一个会被重复用的,抽出来设为常量
  //这里return的是要返回给UI层,UI会来拿fetch的运行结果
  //fetch是浏览器自带的函数, 能够让浏览器的请求自动对应后端的API
  //fetch这个函数返回是request status, 是请求状态
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json", //前后端在通信的数据格式, 是前端往后端发请求的格式
      //后端往前端回response的type 叫accept-Type
    },
    body: JSON.stringify(credential), //就是把credentials这个javascript object拍平为json string传给后端
  })
    .then((response) => {
      if (!response.ok) {
        throw Error("Fail to log in");
        //如果throw Error, 后面的代码会直接断掉不会再向下执行,这个error会被扔到上一层,谁调用了这个函数谁接
      }

      return response.text(); //如果成功就把response做解析
    }) //然后拿到的解析就是第二个.then的输入, 为什么是.text因为token是string
    .then((token) => {
      localStorage.setItem("authToken", token);
    });
};

export const register = (credential) => {
  const url = `${domain}/signup`;
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credential),
  }).then((response) => {
    handleResponseStatus(response, "Fail to register"); //注册这里不会有401的状态
  });
};

export const uploadApp = (data, file) => {
  const authToken = localStorage.getItem("authToken");
  const url = `${domain}/upload`;

  const { title, description, price } = data;
  const formData = new FormData();
  formData.append("title", title);
  formData.append("description", description);
  formData.append("price", price);
  formData.append("media_file", file);
  //为什么这里需要用form-data的形式,因为要传file

  return fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
    body: formData,
  }).then((response) => {
    handleResponseStatus(response, "Fail to upload app");
  });
};

export const searchApps = (query) => {
  const title = query?.title ?? "";
  const description = query?.description ?? "";
  //这里为什么写成这样?

  const authToken = localStorage.getItem("authToken");
  const url = new URL(`${domain}/search`);
  url.searchParams.append("title", title);
  url.searchParams.append("description", description);

  return fetch(url, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  }).then((response) => {
    handleResponseStatus(response, "Fail to search apps");

    return response.json();
    //.json的作用就是把后端发回来的json string立体化成一个json object
    //也就是把我们搜索得到的结果返回并且立体化成一个json object
  });
};

export const checkout = (appId) => {
  const authToken = localStorage.getItem("authToken");
  const url = `${domain}/checkout?appID=${appId}`;

  return fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${authToken}`,
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      handleResponseStatus(response, "Fail to checkout");

      return response.text();
      //把后端发回来的response变成一个text, 因为是我们checkout成功以后需要跳转的url, url是text类型的
    })
    .then((redirectUrl) => {
      window.location = redirectUrl;
    });
};
