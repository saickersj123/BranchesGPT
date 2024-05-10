import './App.css';

function App() {

  const users = [
    { name: "JeongJin" },
    { name: "branches"},
  ]

  const showUser = true;
    
  return (
    <div className="App">
      {
        showUser ? (
          //만약 showUser이 참이라면 실행
          <ul>
            {users.map(user => <li> {user.name} </li>)}
          </ul>
        ) : (
          //만약 showUser가 거짓이라면 실행
          null
        )
      }
    </div>
  );
}

export default App;
