import { Card, Button } from "react-bootstrap";

export default function ProductCard({ prop }) {
  const { _id, imageUrl, price, quantity, productName, description } = prop;

  return (
    <Card className="" style={{}}>
      <div className="img-container">
        <Card.Img variant="top" src={imageUrl} className="" />
      </div>

      <Card.Body className="">
        <Card.Subtitle className="product-name">{productName}</Card.Subtitle>
        <Card.Text className="product-description">{description}</Card.Text>
        <Card.Text className="product-price">
          {price.toLocaleString("en-US", {
            style: "currency",
            currency: "PHP",
          })}
        </Card.Text>
        <Card.Text className=" product-quantity">Product Available: {quantity}</Card.Text>

        {/* <div className="view-btn p-2 text-center w-100">View Product</div> */}
      </Card.Body>
    </Card>
  );
}
