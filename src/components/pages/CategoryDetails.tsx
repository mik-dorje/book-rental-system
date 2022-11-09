import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../../api/axios";

const CATEGORY_URL = "bookrental/category";

const CategoryDetails = () => {
  const params = useParams();
  const catId = params.catId;
  const [categoryDetail, setCategoryDetail] = useState(null);

  const fetchData = async () => {
    const response = await axios(`${CATEGORY_URL}/${catId}`);
    console.log(response.data.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <h3>CategoryDetail: {catId}</h3>
      {}
    </div>
  );
};

export default CategoryDetails;
