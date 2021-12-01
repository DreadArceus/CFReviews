import { Navbar } from "./components/navbar";
import { Problem } from "./components/problem";
import axios from "axios";
import { useState, useEffect } from "react";

const api = axios.create({
  baseURL: "http://localhost:3333/",
});

const App = () => {
  const [user, setUser] = useState("");
  const logout = () => {
    setUser("");
  };

  const [lInfo, login] = useState({ username: "", password: "" });
  useEffect(() => {
    if (lInfo.username && lInfo.password)
      api
        .post("/login", lInfo)
        .then((res) => {
          if (res.data.error) {
            alert(res.data.error);
          } else {
            setUser(res.data.username);
            login(() => ({ username: "", password: "" }));
            alert(`Logged in as ${res.data.username}`);
          }
        })
        .catch((err) => console.log(err));
  });

  const [rInfo, register] = useState({ username: "", password: "" });
  useEffect(() => {
    if (rInfo.username && rInfo.password)
      api
        .post("/register", rInfo)
        .then((res) => {
          setUser(res.data.username);
          register(() => ({ username: "", password: "" }));
          alert(`Logged in as ${res.data.username}`);
        })
        .catch((err) => console.log(err));
  });

  const [reviews, setReviews] = useState([
    {
      text: "Great problem must try, would recommend for anyone with rating more than 1400",
      user: "dread",
      me: true,
    },
    { text: "skdiasjdiojsad", user: "notdread", me: false },
  ]);

  return (
    <div>
      <Navbar
        loggedIn={user !== ""}
        login={login}
        register={register}
        logout={logout}
      />
      <Problem code="123A" reviews={reviews} setReviews={setReviews} />
    </div>
  );
};

export default App;
