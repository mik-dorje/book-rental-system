import { Button } from "antd";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../../api/axios";
import { useNavigate } from "react-router-dom";

const AUTHOR_URL = "bookrental/author";

const SingleAuthor = () => {
  const params = useParams();
  const id = params.id;
  const navigate = useNavigate();
  const [authorDetail, setauthorDetail] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios(`${AUTHOR_URL}/${id}`);
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
      <h3>CategoryDetail: {id}</h3>
    </div>
  );
};

export default SingleAuthor;
