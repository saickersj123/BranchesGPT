import React from 'react';

function LectureOne() {
  // 사용자 정보 배열
  const users = [{ name: "JeongJin" }];
  // 학생 정보 객체
  const student = {
    ID: '1234',
    name: "JeongJin",
    GPA: '4.5'
  }

  // step 1: 객체의 각 속성을 개별 변수에 할당합니다.
  const ID_step1 = student.ID;
  const name_step1 = student.name;
  const GPA_step1 = student.GPA;
  console.log("Step_1");
  console.log("ID : ", ID_step1, ", name : ", name_step1, ", GPA : ", GPA_step1);

  // step 2: 구조 분해 할당을 사용하여 객체의 각 속성을 변수에 바로 할당합니다.
  const {ID, name, GPA} = student;
  console.log("\n\nStep_2");
  console.log("ID : ", ID, ", name : ", name, ", GPA : ", GPA);
  console.log(student);
  
  // step3: 구조 분해 할당과 함께 속성에 새로운 변수명을 부여합니다.
  const { ID : ID_step3, name : name_step3, GPA : GPA_step3} = student;
  console.log("\n\nStep_3");
  console.log("ID : ", ID_step3, ", name : ", name_step3, ", GPA : ", GPA_step3);

  // 사용자를 보여줄지 여부를 결정하는 변수
  const showUser = true; 
  return (
    <div>
        <h1>Lecture1</h1>
        <p> 삼항연산자의 사용 방법</p>
      {/* 조건부 렌더링: showUser가 true이면 사용자 정보를 표시 */}
      {
      showUser ? (
        <ul>
          {users.map(user => <li>{user.name}</li>)}
        </ul>
      ) : (
        // showUser가 false이면 아무것도 표시하지 않음
        null
      )
    }
    <h1> lecture2 </h1>
    <p> 구조분해할당 </p>
    <h2> My name is {name_step3} </h2>
    </div>
  );
}

export default LectureOne;
