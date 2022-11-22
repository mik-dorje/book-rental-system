import { RollbackOutlined } from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Divider,
  Form,
  message,
  Row,
  Select,
  Space,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import axios from "../../../api/axios";
import { useNavigate } from "react-router-dom";
import { originalBookData } from "../Book/Book";
import { originalMemberData } from "../Member/Member";
import moment from "moment";

const BOOK_URL = "/bookrental/book";
const MEMBER_URL = "bookrental/member";
const RETURN_URL = "bookrent/booktransaction/return-book";

const ReturnBook = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const [books, setBooks] = useState(originalBookData);
  const [members, setMembers] = useState(originalMemberData);

  const fetchBooks = async () => {
    const result = await axios(BOOK_URL);
    setBooks(result.data.data);
  };
  const fetchMembers = async () => {
    const result = await axios(MEMBER_URL);
    setMembers(result.data.data);
  };

  useEffect(() => {
    fetchBooks();
    fetchMembers();
  }, []);

  // Form Modal Functions
  const onFinish = async (values: any) => {
    console.log({ values });

    const newRentData = {
      bookId: values.bookId,
      toDate: values.toDate._d.toISOString().slice(0, 10),
      rentType: "RETURN",
      memberId: values.memberId,
    };
    console.log(newRentData);

    try {
      const response = await axios.post(
        RETURN_URL,
        JSON.stringify(newRentData),
        {
          headers: { "Content-Type": "application/json" },
          // withCredentials: true,
        }
      );
      console.log(JSON.stringify(response?.data));

      // const oneBook = books.filter((book) => book.bookId === values.bookId)[0]
      //   .bookName;
      // const oneMember = members.filter(
      //   (member) => member.memberId === values.memberId
      // )[0].name;
      // message.success(`"${oneBook}" returned by ${oneMember}`);

      if (response.status === 200) {
        message.success(response.data.message);
      }

      form.resetFields();
      //   setModalOpen(false);
      // message.success(`${values?.bookName} added !`);
    } catch (err) {
      console.log(err);
    }
  };

  const memberOptions = members.map((member) => {
    return {
      label: member.name,
      value: member.memberId,
    };
  });

  const bookOptions = books.map((book) => {
    if (book.bookName === "") {
      return {
        label: "",
        value: "",
      };
    }
    return {
      label: book.bookName,
      value: book.bookId,
    };
  });

  function disabledDate(current: any) {
    return current && current < moment().add(-1, "days");
  }

  const handleModalCancel = () => {};

  return (
    <div
      style={{
        boxShadow: "0 0 8px 2px #e5e1e0",
        // zIndex: "50",
      }}
    >
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

      <Form
        form={form}
        name="basic"
        labelCol={{ span: 7 }}
        wrapperCol={{ span: 14 }}
        initialValues={{ remember: false }}
        onFinish={onFinish}
        className="rent-book-form"
      >
        <Divider>
          <Typography.Title level={4} style={{ color: "white" }}>
            RETURN BOOK
          </Typography.Title>
        </Divider>

        <Form.Item
          label="Book"
          name="bookId"
          rules={[
            {
              required: false,
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
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={bookOptions}
          />
        </Form.Item>
        <Form.Item
          label="Member"
          name="memberId"
          rules={[
            {
              required: false,
              message: "Please input member!",
            },
          ]}
        >
          <Select
            showSearch
            style={{ width: "100%", marginLeft: "16px" }}
            placeholder="Please select member"
            allowClear
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={memberOptions}
          />
        </Form.Item>

        {/* <Form.Item
          label="Request"
          name="fromDate"
          rules={[
            {
              required: false,
              message: "Please input request date!",
            },
          ]}
        >
          <DatePicker
            placement="topLeft"
            format="YYYY-MM-DD"
            disabledDate={disabledDate}
            style={{ width: "100%", marginLeft: "16px" }}
          />
        </Form.Item> */}
        <Form.Item
          label="Return Date"
          name="toDate"
          rules={[
            {
              required: false,
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
                // style={{ width: "75px" }}
              >
                Return
              </Button>
            </Form.Item>
            <Form.Item>
              <Button type="primary" danger onClick={handleModalCancel}>
                Cancel
              </Button>
            </Form.Item>
          </Space>
        </Row>
      </Form>
    </div>
  );
};

export default ReturnBook;
