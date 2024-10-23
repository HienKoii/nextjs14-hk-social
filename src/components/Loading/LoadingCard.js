import { Col, Row } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Placeholder from "react-bootstrap/Placeholder";

function LoadingCard() {
  return (
    <Row>
      <Col xl={12}>
        <Card>
          <Card.Body style={{ overflow: "hidden" }}>
            <div className="d-flex">
              <Placeholder as="div" animation="glow" className="me-2">
                <Placeholder className="rounded-circle" style={{ width: "50px", height: "50px" }} />
              </Placeholder>
              <Placeholder animation="glow" className="w-100">
                <Placeholder xs={12} className="h-100" />
              </Placeholder>
            </div>

            <Placeholder as={Card.Text} animation="glow">
              <Placeholder xs={12} style={{ height: "200px" }} className="my-3" />
            </Placeholder>

            <Placeholder as={Card.Text} animation="glow">
              <Placeholder.Button variant="secondary" xs={4} />
              <Placeholder.Button variant="secondary" xs={4} />
              <Placeholder.Button variant="secondary" xs={4} />
            </Placeholder>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}

export default LoadingCard;
