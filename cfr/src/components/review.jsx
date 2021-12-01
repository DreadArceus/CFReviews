import { Button } from "@material-ui/core";

export const Review = ({ text, user, me }) => {
  return (
    <div
      style={{
        border: "1px black solid",
        borderRadius: "20px",
        padding: "10px",
        width: "500px",
        margin: "5px",
      }}
    >
      <div
        style={{
          display: "block",
          borderBottom: "2px black dotted",
          marginBottom: "5px",
        }}
      >
        {user}
      </div>
      <div style={{ display: "inline-block", maxWidth: "350px" }}>{text}</div>
      <div style={{ display: "inline-block" }}>
        <Button disabled={!me}>Edit</Button>
        <Button disabled={!me}>Delete</Button>
      </div>
    </div>
  );
};
