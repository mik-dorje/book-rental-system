import { Button } from "antd";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../../../api/axios";
import { useNavigate } from "react-router-dom";

const TRANSACTION_URL = "bookrental/booktransaction";

const SingleTransaction = () => {
  const params = useParams();
  const id = params.id;
  const navigate = useNavigate();
  const [transactionDetail, setTransactionDetail] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios(`${TRANSACTION_URL}/${id}`);
      setTransactionDetail(response.data.data);
    };
    fetchData();
  }, [id]);

  console.log(transactionDetail);

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
      <h3>TransactionDetail: {id}</h3>
    </div>
  );
};

export default SingleTransaction;
