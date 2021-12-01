import { IconButton, TextField } from "@material-ui/core";
import Send from "@material-ui/icons/Send";
import { useState } from "react";
import { Review } from "./review";

export const Problem = ({ user, code, reviews, setCurrentReview, handleDelete, loggedIn }) => {
  const [newReview, setNewReview] = useState("");
  return (
    <div style={{ display: "block", margin: "auto", width: "fit-content" }}>
      <div
        style={{
          display: "block",
          margin: "auto",
          textAlign: "center",
          fontSize: "42.0px",
        }}
      >
        {code || "Enter a problem code above to get started"}
      </div>
      <div style={{ display:"block", margin: "auto", height: "500px", overflow: "auto" }}>
        {reviews.map(({ id, ...review }) => {
          return (
            <Review
              handleDelete={() => handleDelete(id)}
              key={id}
              {...review}
              me={review.user === user}
            />
          );
        })}
      </div>
      <div style={{width: "fit-content", display: "block", margin: "auto"}}>
        <TextField
          style={{ margin: "10px", width: "450px" }}
          value={newReview}
          onChange={(e) => {
            setNewReview(e.target.value);
          }}
          disabled={!loggedIn}
        ></TextField>
        <IconButton
          onClick={() => {
            if (newReview) {
              setCurrentReview(newReview);
              setNewReview("");
            }
          }}
          disabled={!loggedIn}
        >
          <Send />
        </IconButton>
      </div>
    </div>
  );
};
