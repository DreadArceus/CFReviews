import { IconButton, TextField } from "@material-ui/core";
import Send from "@material-ui/icons/Send";
import { useState } from "react";
import { Review } from "./review";

export const Problem = ({ code }) => {
  const [reviews, setReviews] = useState([
    "Great problem must try, would recommend for anyone with rating more than 1400",
    "skdiasjdiojsad",
    "asdojaosijdoiasd",
    "soidjoiasjdioaj",
  ]);
  const [newReview, setNewReview] = useState("");
  return (
    <div style={{ display: "block", margin: "auto", width: "fit-content" }}>
      <div style={{ display: "block", margin: "auto", textAlign: "center" }}>
        {code}
      </div>
      <div class="reviews">
        {reviews.map((review) => {
          return <Review text={review} />;
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
            setReviews([...reviews, newReview]);
            setNewReview("");
          }}
        >
          <Send />
        </IconButton>
      </div>
    </div>
  );
};
