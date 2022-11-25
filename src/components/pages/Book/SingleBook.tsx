import { Button, Col, Divider, Rate, Row, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../../../api/axios";
import { useNavigate } from "react-router-dom";

import back from "../../../images/back.jpg";
import { RollbackOutlined } from "@ant-design/icons";
import { AuthorDataType, originalAuthorData } from "../Author/Author";
import authHeader from "../../../hooks/authHeader";

const BOOK_URL = "/bookrental/book";

interface catDataType {
  categoryId: number | null;
  categoryName: string;
  categoryDescription: string;
}

export interface SingleBookDataType {
  bookId: number | null;
  bookName: string;
  noOfPages: number | null;
  isbn: string;
  rating: number | undefined;
  stockCount: number | null;
  imagePath: string;
  publishedDate: string;
  author: AuthorDataType[];
  category: catDataType;
}

const originalCatData = {
  categoryId: null,
  categoryName: "",
  categoryDescription: "",
};

export const originalSingleBookData: SingleBookDataType = {
  bookId: null,
  bookName: "",
  noOfPages: null,
  isbn: "",
  rating: undefined,
  stockCount: null,
  imagePath: "",
  publishedDate: "",
  author: originalAuthorData,
  category: originalCatData,
};

const SingleBook = () => {
  const params = useParams();
  const id = params.id;
  const navigate = useNavigate();
  const [bookDetail, setbookDetail] = useState<SingleBookDataType>(
    originalSingleBookData
  );
  const [pos, setPos] = useState({ x: -45, y: 15, z: 20 });
  const [isLoaded, setIsLoaded] = useState(false);

  const fetchData = async () => {
    const response = await axios.get(`${BOOK_URL}/${id}`, {
      headers: authHeader(),
    });
    setbookDetail(response.data.data);
    setIsLoaded(true);
  };
  useEffect(() => {
    fetchData();
  });

  const moveBook = (e: any) => {
    var x = e.clientX - window.innerWidth / 2;
    var y = e.clientY - window.innerHeight / 2;
    var z = e.clientY - window.innerHeight / 2;
    var q = 0.15;
    setPos({ x: x * q * 1.25, y: -y * q * 1.25, z: z * q * 1.25 });
  };

  return (
    <div className="single-book">
      <Row>
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
      </Row>
      {isLoaded ? (
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
                  alt="bookimage"
                  src={`data:image/png;base64,${bookDetail.imagePath}`}
                />
              </div>
            </div>
          </Col>

          <Col className="book-details" md={{ span: 14 }} xs={{ span: 24 }}>
            <Divider plain>
              <Typography.Title
                level={1}
                style={{ color: "rgb(219, 214, 214)", fontSize: "40px" }}
              >
                {bookDetail.bookName}
              </Typography.Title>
            </Divider>

            <Typography.Title
              level={2}
              style={{ color: "#272c32", fontFamily: "poppins" }}
            >
              Description: {bookDetail.category.categoryDescription}
            </Typography.Title>

            <div
              className="sub-details"
              style={{
                color: "#272c32",
                fontSize: "24px",
                fontWeight: 600,
                margin: "0 25px",
                display: "flex",
                justifyContent: "space-evenly",
                fontFamily: "poppins",
              }}
            >
              <div style={{ textAlign: "left" }}>
                <p>Category: {bookDetail.category.categoryName}</p>
                <p>ISBN: {bookDetail.isbn}</p>
                <p>Total Pages: {bookDetail.noOfPages}</p>
              </div>
              <div style={{ textAlign: "left" }}>
                <p>Stock Count:{bookDetail.stockCount}</p>
                <p>Published On: {bookDetail.publishedDate}</p>
                <p>
                  Authors:{" "}
                  {bookDetail.author?.map((item) => (
                    <span>{item.authorName}</span>
                  ))}
                </p>
              </div>
            </div>

            <Rate allowHalf disabled value={bookDetail.rating} />
          </Col>
        </Row>
      ) : (
        <div className="loader-box">
          <span className="loader"></span>
        </div>
      )}
    </div>
  );
};

export default SingleBook;
