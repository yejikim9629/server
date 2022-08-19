const http = require("http"); //요청해서 담아둠
const fs = require("fs").promises;
//const idd=0;누군지 알아보기위한
const users = {}; // 데이터 저장용 //id 초기값을 넣어주는게 좋다
let idid = 0;

http
  .createServer(async (req, res) => {
    //서버만들고 (req:요청 , res : 응답)
    try {
      if (req.method === "GET") {
        //리드함
        //서버를 만들었으면 요청을해야 응답이 와
        if (req.url === "/") {
          const data = await fs.readFile("./restFront.html");
          res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" }); //200why? html content에대한
          return res.end(data);
        } else if (req.url === "/about") {
          const data = await fs.readFile("./about.html");
          res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
          return res.end(data);
        } else if (req.url === "/users") {
          res.writeHead(201, {
            "Content-Type": "application/json; charset=utf-8",
          });
          return res.end(JSON.stringify(users));
        }
        // /도 /about도 /users도 아니면
        try {
          const data = await fs.readFile(`.${req.url}`);
          return res.end(data);
        } catch (err) {
          // 주소에 해당하는 라우트를 못 찾았다는 404 Not Found error 발생
        }
      } else if (req.method === "POST") {
        if (req.url === "/user") {
          let body = "";
          // 요청의 body를 stream 형식으로 받음
          req.on("data", (data) => {
            body += data;
          });
          // 요청의 body를 다 받은 후 실행됨
          return req.on("end", () => {
            console.log("POST 본문(Body):", body);
            const { name } = JSON.parse(body);
            const id = Date.now(); //++idid; //getIP.getClinetIP(req)누군지 알아보기위한 //Date.now(); date now에서 바꿔줌
            users[id] = name;
            res.writeHead(201, { "Content-Type": "text/plain; charset=utf-8" });
            res.end("ok");
          });
        }
      } else if (req.method === "PUT") {
        if (req.url.startsWith("/user/")) {
          const key = req.url.split("/")[2];
          let body = "";
          req.on("data", (data) => {
            body += data;
          });
          return req.on("end", () => {
            console.log("PUT 본문(Body):", body);
            users[key] = JSON.parse(body).name; //제이슨을 반대로 바꿀때 함수
            res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" }); //DB에 있는데이터 수정
            return res.end("ok");
          });
        }
      } else if (req.method === "DELETE") {
        if (req.url.startsWith("/user/")) {
          const key = req.url.split("/")[2]; //쪼갠것 중에서 2번째
          delete users[key];
          res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
          return res.end("ok");
        }
      }
      res.writeHead(404);
      return res.end("NOT FOUND");
    } catch (err) {
      console.error(err);
      res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
      res.end(err.message);
    }
  })
  .listen(8082, () => {
    console.log("8082번 포트에서 서버 대기 중입니다");
  });
