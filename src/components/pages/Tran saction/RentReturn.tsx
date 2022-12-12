import { LoadingOutlined } from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Divider,
  Form,
  message,
  Row,
  Select,
  Space,
  Spin,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import axios from "../../../api/axios";
import { originalBookData } from "../Book/Book";
import { originalMemberData } from "../Member/Member";
import moment from "moment";
import authHeader from "../../../hooks/authHeader";

const BOOK_URL = "/bookrental/book/get-book-id-name";
const MEMBER_URL = "bookrental/member";
const ADD_TRANSACTION_URL = "bookrental/booktransaction/add-book-transaction";

const RentReturn = () => {
  const [form] = Form.useForm();

  const [books, setBooks] = useState(originalBookData);
  const [members, setMembers] = useState(originalMemberData);

  const [isSubmit, setIsSubmit] = useState(false);

  const fetchBooks = async () => {
    const result = await axios.get(BOOK_URL, { headers: authHeader() });
    setBooks(result.data.data);
    console.log("book fetched");
  };
  const fetchMembers = async () => {
    const result = await axios.get(MEMBER_URL, { headers: authHeader() });
    setMembers(result.data.data);
    console.log("members fetched");
  };

  useEffect(() => {
    fetchBooks();
    fetchMembers();

    // console.log({books, members})
  }, []);

  // Form Modal Functions
  const onFinish = async (values: any) => {
    setIsSubmit(true);
    try {
      const newRentData = {
        bookId: values.bookId,
        toDate: values.toDate._d.toISOString().slice(0, 10),
        rentType: values.rentType,
        memberId: values.memberId,
      };
      const response = await axios.post(ADD_TRANSACTION_URL, newRentData, {
        headers: authHeader(),
      });

      // console.log(JSON.stringify(response?.data));
      // const oneBook = books.filter((book) => book.bookId === values.bookId)[0]
      //   .bookName;
      // const oneMember = members.filter(
      //   (member) => member.memberId === values.memberId
      // )[0].name;
      // message.success(`"${oneBook}" rented to ${oneMember}`);

      if (response.status === 200) {
        message.success(response.data.message);
      }

      form.resetFields();
    } catch (err) {
      console.log(err);
    }
    setIsSubmit(false);
  };

  const handleReset = (values: any) => {
    form.resetFields();
    // setModalOpen(false);
  };
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

  const memberOptions = members.map((member) => {
    if (member.name === "") {
      return {
        label: <Spin indicator={antIcon} />,
        value: "",
      };
    }
    return {
      label: member.name,
      value: member.memberId,
    };
  });

  // For multiple books select
  const bookOptions = books.map((book) => {
    if (book.bookName === "") {
      return {
        label: <Spin indicator={antIcon} />,
        value: "",
      };
    }
    return {
      label: book?.bookName,
      value: book?.bookId,
    };
  });

  function disabledDate(current: any) {
    return current && current < moment().add(-1, "days");
  }

  return (
    <div
      style={{
        boxShadow: "0 0 8px 2px #e5e1e0",
      }}
    >
      {/* <Row justify="center">
        <Button
          type="default"
        >
          <Typography.Text strong style={{ color: "black" }}>
            New Book Transaction
          </Typography.Text>
        </Button>
      </Row> */}

      <Form
        form={form}
        name="basic"
        labelCol={{ xs: { span: 9 }, md: { span: 5 } }}
        wrapperCol={{ xs: { span: 13 }, md: { span: 16 } }}
        initialValues={{ remember: false }}
        onFinish={onFinish}
        className="rent-book-form"
      >
        <Divider>
          <Typography.Title level={4} style={{ color: "white" }}>
            RENT/RETURN BOOK
          </Typography.Title>
        </Divider>

        <Form.Item
          label="Member"
          name="memberId"
          rules={[
            {
              required: true,
              message: "Please input member!",
            },
          ]}
        >
          <Select
            showSearch
            style={{ width: "100%", marginLeft: "16px" }}
            placeholder="Please select member"
            allowClear
            optionFilterProp="items"
            filterOption={(input, option: any) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={memberOptions}
          />
        </Form.Item>
        <Form.Item
          label="Book"
          name="bookId"
          rules={[
            {
              required: true,
              message: "Please input book!",
            },
          ]}
        >
          <Select
            showSearch
            style={{ width: "100%", marginLeft: "16px" }}
            placeholder="Please select book"
            allowClear
            optionFilterProp="items"
            filterOption={(input, option: any) =>
              (option?.label ?? "")?.toLowerCase().includes(input.toLowerCase())
            }
            options={bookOptions}
          />
        </Form.Item>
        <Form.Item
          label="Transaction Type"
          name="rentType"
          rules={[
            {
              required: true,
              message: "Please input member!",
            },
          ]}
        >
          <Select
            placeholder="Select a transaction type"
            style={{ width: "100%", marginLeft: "16px" }}
            // onChange={onUserTypeChange}
            options={[
              {
                label: "Rent",
                value: "RENT",
              },
              {
                label: "Return",
                value: "RETURN",
              },
            ]}
          />
        </Form.Item>

        <Form.Item
          label="Return Date"
          name="toDate"
          rules={[
            {
              required: true,
              message: "Please input return date!",
            },
          ]}
        >
          <DatePicker
            placement="topLeft"
            format="YYYY-MM-DD"
            disabledDate={disabledDate}
            style={{ width: "100%", marginLeft: "16px" }}
          />
        </Form.Item>

        <Row justify="center">
          <Space size="middle">
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                style={{ width: "95px" }}
                loading={isSubmit}
              >
                submit
              </Button>
            </Form.Item>
            <Form.Item>
              <Button type="primary" danger onClick={handleReset}>
                Reset
              </Button>
            </Form.Item>
          </Space>
        </Row>
      </Form>
    </div>
  );
};

export default RentReturn;
