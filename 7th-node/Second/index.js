import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import path from "path";

const app = express();
const __dirname = import.meta.dirname;

dotenv.config();

app.set("port", process.env.PORT); // set은 key, value 형태로 port에 뒤의 값을 저장한 것

app.use(morgan('dev'));

// 아래 미들웨어는 서버에서 정적 파일을 전달해주는 라우터 역할을 합니다.
// 라우터란 해당 경로로 (여기선 '/') 길을 열어준다고 생각해주시면 돼요
app.use('/', express.static(path.join(__dirname, 'public')));

// 아래 두 개의 미들웨어는 클라이언트의 request의 본문을 
// 서버에서 사용할 수 있는 req.body 객체로 바꿔주는 미들웨어 입니다.
app.use(express.json());// json 파싱해주는 방법

app.use(express.urlencoded({ extended: false }));// URL-encoded 데이터를 파싱

app.use((req, res, next) => {
  // 모든 경로에서 middleware가 실행됨
  console.log("이건 모든 요청에서 다 실행됨");
  next();
});

app.get(
  "/",
  // 첫번째 미들웨어에서 next() 매개변수를 사용해 다음으로 넘어가도록 처리
  (req, res, next) => {
    res.send("Hello UMC 7th express");
    next(); // 다음 미들웨어 실행
  },
  // 두번째 미들웨어에서 에러를 발생시킴
  (req, res) => {
    // throw new Error()로 에러 발생시키기
    throw new Error("이 에러를 에러 처리 미들웨어로 감");
  }
);

// 가장 마지막인 에러처리 미들웨어
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send(err.message);
});

app.listen(app.get("port"), () => {
  console.log(app.get("port"), "에서 대기중");
});

// middleware
// 요청과 응답 사이에 위치

/*
morgan은 Node.js와 Express에서 로그를 남기는 미들웨어
morgan의 다양한 로그 포맷
'dev': 개발 환경에서 간단하고 컬러풀한 로그 형식을 제공합니다.
'combined': 일반적인 Apache 로그 형식을 제공합니다. (IP 주소, 요청 경로, 상태 코드 등)
'common': Apache 공통 로그 형식.
'short': 짧은 로그 포맷.
'tiny': 최소한의 로그 정보를 기록합니다.
*/