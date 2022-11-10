import { Button } from "antd";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../../api/axios";
import { useNavigate } from "react-router-dom";

const CATEGORY_URL = "bookrental/category";

const SingleCategory = () => {
  const params = useParams();
  const id = params.id;
  const navigate = useNavigate();
  const [categoryDetail, setCategoryDetail] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios(`${CATEGORY_URL}/${id}`);
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

export default SingleCategory;
