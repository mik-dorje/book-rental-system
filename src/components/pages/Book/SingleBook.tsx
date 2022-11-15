import { Button, Col, Grid, Row, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../../../api/axios";
import { useNavigate } from "react-router-dom";

import front from "../../../images/memory.png";
import back from "../../../images/back.jpg";
import sineater from "../../../images/sineater.jpg";
import { BoxPlotFilled, RollbackOutlined } from "@ant-design/icons";

const BOOK_URL = "/bookrental/book";

const SingleBook = () => {
  const params = useParams();
  const id = params.id;
  const navigate = useNavigate();
  const [bookDetail, setbookDetail] = useState(null);
  const [pos, setPos] = useState({ x: -45, y: 15, z: 20 });

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios(`${BOOK_URL}/${id}`);
      setbookDetail(response.data.data);
    };
    fetchData();
  }, [id]);

  console.log(bookDetail);

  const moveBook = (e: any) => {
    var x = e.clientX - window.innerWidth / 2;
    var y = e.clientY - window.innerHeight / 2;
    var z = e.clientY - window.innerHeight / 2;
    var q = 0.15;
    setPos({ x: x * q * 1.25, y: -y * q * 1.25, z: z * q * 1.25 });
  };

  return (
    <div className="single-book">
      <Row
        style={
          {
            // backgroundColor: "white",
            // padding: "5px",
            // borderRadius: "6px",
          }
        }
      >
        {/* <Col span={24}> */}

        <Button
          type="primary"
          icon={<RollbackOutlined style={{ fontSize: "18px" }} />}
          onClick={() => {
            navigate(-1);
          }}
        >
          <Typography.Text strong style={{ color: "white" }}>
            Back
          </Typography.Text>
        </Button>
        {/* </Col> */}
      </Row>

      <Row className="main-book-container" justify="space-between">
        <Col className="book-3D" md={{ span: 9 }} xs={{ span: 24 }}>
          <div className="container">
            <div
              onMouseMove={moveBook}
              style={{
                transform: `rotateY(${pos.x}deg) rotateX(${pos.y}deg) rotateZ(${pos.y}deg)`,
              }}
              className="box"
            >
              <div className="left"></div>
              <div className="right"></div>
              <div className="top"></div>
              <div className="bottom"></div>

              <img className="back" alt="back" src={back} />
              <img
                className="front"
                alt="front"
                src={id === "1" ? front : sineater}
              />
            </div>
          </div>
        </Col>

        <Col className="book-details" md={{ span: 14 }} xs={{ span: 24 }}>
          <Typography.Title level={4} style={{ color: "white" }}>
            Details
          </Typography.Title>
        </Col>
      </Row>
    </div>
  );
};

export default SingleBook;
