import { IconButton, TextField } from "@material-ui/core";
import Send from "@material-ui/icons/Send";
import { useState } from "react";
import { Review } from "./review";

export const Problem = ({ code }) => {
  const [reviews, setReviews] = useState([
    {
      text: "Great problem must try, would recommend for anyone with rating more than 1400",
      user: "dread",
      me: true,
    },
    { text: "skdiasjdiojsad", user: "notdread", me: false },
  ]);
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
        {code}
      </div>
      <div style={{ height: "400px", overflow: "scroll", margin: "5px" }}>
        {reviews.map((review) => {
          return <Review {...review} />;
        })}
      </div>
      <div>
        <TextField
          style={{ margin: "10px", width: "450px" }}
          value={newReview}
          onChange={(e) => {
            setNewReview(e.target.value);
          }}
        ></TextField>
        <IconButton
          onClick={() => {
            if (newReview) {
              setReviews([...reviews, newReview]);
              setNewReview("");
            }
          }}
        >
          <Send />
        </IconButton>
      </div>
    </div>
  );
};
