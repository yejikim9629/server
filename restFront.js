async function getUser() {
  // 로딩 시 사용자 가져오는 함수
  try {
    const res = await axios.get("/users");
    const users = res.data;
    const list = document.getElementById("list");
    list.innerHTML = ""; //글자를 넣어줌//div
    // 사용자마다 반복적으로 화면 표시 및 이벤트 연결
    Object.keys(users).map(function (key) {
      const userDiv = document.createElement("div"); //div에 넣어줌
      const span = document.createElement("span");
      span.textContent = users[key]; //user id를 text에 넣어줌
      const edit = document.createElement("button");
      edit.textContent = "수정";
      edit.addEventListener("click", async () => {
        // 수정 버튼 클릭
        const name = prompt("바꿀 이름을 입력하세요");
        if (!name) {
          //불리언타입에는 폴스
          return alert("이름을 반드시 입력하셔야 합니다");
        }
        try {
          await axios.put("/user/" + key, { name }); //업데이트니깐 put 데이터를 바꾼다
          getUser(); //새로고침
        } catch (err) {
          console.error(err);
        }
      });
      const remove = document.createElement("button");
      remove.textContent = "삭제";
      remove.addEventListener("click", async () => {
        // 삭제 버튼 클릭
        try {
          await axios.delete("/user/" + key); //name이 필요 없으므로
          getUser();
        } catch (err) {
          console.error(err);
        }
      });
      userDiv.appendChild(span);
      userDiv.appendChild(edit);
      userDiv.appendChild(remove);
      list.appendChild(userDiv);
      console.log(res.data);
    });
  } catch (err) {
    console.error(err);
  }
}

window.onload = getUser; // 화면 로딩 시 getUser 호출
// 폼 제출(submit) 시 실행
document.getElementById("form").addEventListener("submit", async (e) => {
  //(get elements by name ,get elements by class)
  e.preventDefault();
  const name = e.target.username.value;
  if (!name) {
    //004가 담김
    return alert("이름을 입력하세요");
  }
  try {
    await axios.post("/user", { name }); //local.host:8082
    getUser();
  } catch (err) {
    console.error(err);
  }
  e.target.username.value = "";
});
