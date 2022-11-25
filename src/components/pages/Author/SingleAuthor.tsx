import { Button, Row, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../../../api/axios";
import { useNavigate } from "react-router-dom";
import { RollbackOutlined } from "@ant-design/icons";
import authHeader from "../../../hooks/authHeader";

const AUTHOR_URL = "bookrental/author";

const SingleAuthor = () => {
  const params = useParams();
  const id = params.id;
  const navigate = useNavigate();
  const [authorDetail, setauthorDetail] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(`${AUTHOR_URL}/${id}`, {
        headers: authHeader(),
      });
      setauthorDetail(response.data.data);
    };
    fetchData();
  }, [id]);

  console.log(authorDetail);

  return (
    <div>
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

      <h3>CategoryDetail: {id}</h3>
    </div>
  );
};

export default SingleAuthor;
