import { Button } from "antd";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../../api/axios";
import { useNavigate } from "react-router-dom";

const MEMBER_URL = "bookrent/member";

const SingleMember = () => {
  const params = useParams();
  const id = params.id;
  const navigate = useNavigate();
  const [memberDetail, setmemberDetail] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios(`${MEMBER_URL}/${id}`);
      console.log(response.data.data);
    };
    fetchData();
  }, [id]);

  return (
    <div>
      <Button
        type="primary"
        onClick={() => {
          navigate(-1);
        }}
      >
        Back
      </Button>
      <h3>MemberDetail: {id}</h3>
    </div>
  );
};

export default SingleMember;
