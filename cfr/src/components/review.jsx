import { Button } from "@material-ui/core";

export const Review = ({ content, user, me, handleDelete }) => {
  return (
    <div
      style={{
        border: "1px black solid",
        borderRadius: "20px",
        padding: "10px",
        width: "450.69px",
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
      <div style={{ display: "inline-block", width: "300px" }}>{content}</div>
      <div style={{ display: "inline-block" }}>
        <Button disabled={!me} onClick={handleDelete}>
          Delete
        </Button>
      </div>
    </div>
  );
};
