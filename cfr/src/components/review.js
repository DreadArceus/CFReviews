import { Card, CardContent } from "@material-ui/core";

export const Review = ({ text }) => {
  return (
    <Card style={{ width: "500px", margin: "5px" }}>
      <CardContent>{text}</CardContent>
    </Card>
  );
};
