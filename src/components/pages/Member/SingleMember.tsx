import { Button, Row, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../../../api/axios";
import { useNavigate } from "react-router-dom";
import { RollbackOutlined } from "@ant-design/icons";

const MEMBER_URL = "bookrent/member";

const SingleMember = () => {
  const params = useParams();
  const id = params.id;
  const navigate = useNavigate();
  const [memberDetail, setmemberDetail] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios(`${MEMBER_URL}/${id}`);
      setmemberDetail(response.data.data);
    };
    fetchData();
  }, [id]);

  console.log(memberDetail);

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

      <h3>MemmberDetail: {id}</h3>
    </div>
  );
};

export default SingleMember;
