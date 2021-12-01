import { Navbar } from "./components/navbar";
import { Problem } from "./components/problem";
import axios from "axios";
import { useState, useEffect } from "react";

const api = axios.create({
  baseURL: "http://localhost:3333/",
});

const App = () => {
  const [uid, setUid] = useState(0);
  const [pid, setPid] = useState(0);
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
            setUid(res.data.id);
            login(() => ({ username: "", password: "" }));
            alert(`Logged in as ${res.data.username}`);
          }
        })
        .catch((err) => console.log(err));
  }, [lInfo]);

  const [rInfo, register] = useState({ username: "", password: "" });
  useEffect(() => {
    if (rInfo.username && rInfo.password)
      api
        .post("/register", rInfo)
        .then((res) => {
          register(() => ({ username: "", password: "" }));
          login(rInfo);
        })
        .catch((err) => console.log(err));
  }, [rInfo]);

  const [currentProblem, getProblem] = useState("");
  const [reviews, setReviews] = useState([]);
  useEffect(() => {
    if (currentProblem)
      api
        .post(`/problemReviews`, { code: currentProblem })
        .then((res) => {
          setPid(res.data.id);
          setReviews(res.data.reviews);
        })
        .catch((err) => console.log(err));
  }, [currentProblem]);

  const [currentReview, setCurrentReview] = useState("");
  useEffect(() => {
    if (currentReview) {
      api
        .post("/newReview", { content: currentReview, pid: pid, uid: uid })
        .then((res) => {
          setReviews([
            ...reviews,
            {
              id: res.data.id,
              content: currentReview,
              user: user,
            },
          ]);
        });
    }
  }, [currentReview]);

  const [toDelete, setToDelete] = useState(0);
  useEffect(() => {
    if (toDelete) {
      api.post("/deleteReview", { id: toDelete }).then(() => {
        setReviews(reviews.filter((r) => r.id !== toDelete));
      });
      setToDelete(0);
    }
  }, [reviews, toDelete]);

  return (
    <div>
      <Navbar
        loggedIn={user !== ""}
        login={login}
        register={register}
        logout={logout}
        getProblem={getProblem}
      />
      <Problem
        loggedIn={user !== ""}
        user={user}
        code={currentProblem}
        reviews={reviews}
        setCurrentReview={setCurrentReview}
        handleDelete={setToDelete}
      />
    </div>
  );
};

export default App;
