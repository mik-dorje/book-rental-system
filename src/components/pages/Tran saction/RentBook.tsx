import { RollbackOutlined, UploadOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Divider,
  Form,
  Input,
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

const BOOK_URL = "/bookrental/book";
const MEMBER_URL = "bookrent/member";
const RENT_URL = "bookrent/booktransaction/rent-book";

export interface RentDataType {
  key: string;
  bookId: number | null;
  memberId: number | null;
  rentType: string;
  fromDate: string;
  toDate: string;
}

export const originalRentData: RentDataType[] = [
  {
    key: "",
    bookId: null,
    fromDate: "",
    toDate: "",
    rentType: "",
    memberId: null,
  },
];

const RentBook = () => {
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
    console.log("Data fetched");
    console.log({ books, members });
  }, []);

  // Form Modal Functions
  const onFinish = async (values: any) => {
    console.log({ values });

    const newRentData = {
      bookId: values.bookId,
      fromDate: new Date().toISOString().slice(0, 10),
      toDate: new Date(Date.now() + values.days * 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 10),
      rentType: "RETURN",
      memberId: values.memberId,
    };
    console.log(newRentData);

    try {
      const response = await axios.post(RENT_URL, JSON.stringify(newRentData), {
        headers: { "Content-Type": "application/json" },
        // withCredentials: true,
      });
      console.log(JSON.stringify(response?.data));

      const oneBook = books.filter((book) => book.bookId === values.bookId)[0]
        .bookName;
      const oneMember = members.filter(
        (member) => member.memberId === values.memberId
      )[0].name;

      message.success(`"${oneBook}" rented to ${oneMember}`);

      form.resetFields();
      //   setModalOpen(false);
      // message.success(`${values?.bookName} added !`);
    } catch (err) {
      console.log(err);
    }
  };

  const handleModalCancel = () => {
    // setModalOpen(false);
  };

  //For Single member select
  // Although this code does nothing to form values
  const handleSingleSelect = (value: string) => {
    // console.log(`selected ${value}`);
  };

  const memberOptions = members.map((member) => {
    return {
      label: member.name,
      value: member.memberId,
    };
  });

  // For multiple books select

  const bookOptions = books.map((book) => {
    return {
      label: book.bookName,
      value: book.bookId,
    };
  });

  const handleMultipleSelect = (value: string[]) => {
    // console.log(`selected ${value}`);
  };

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
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 14 }}
        initialValues={{ remember: false }}
        onFinish={onFinish}
        className="rent-book-form"
      >
        {/* <Form.Item
      label="ID"
      name="categoryId"
      rules={[
        { required: false, message: "Please input category ID!" },
      ]}
    >
      <Input type="number" />
    </Form.Item> */}
        <Divider>
          <Typography.Title level={4} style={{ color: "white" }}>
            RENT BOOK
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
            // style={{ width: "100%" }}
            placeholder="Please select member"
            onChange={handleSingleSelect}
            allowClear
            optionFilterProp="children"
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
            // style={{ width: "100%" }}
            placeholder="Please select member"
            onChange={handleSingleSelect}
            allowClear
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={memberOptions}
          />
        </Form.Item>

        <Form.Item
          label="Days"
          name="days"
          rules={[
            {
              required: false,
              message: "Please input days!",
            },
          ]}
        >
          <Input type="number" />
        </Form.Item>

        <Row>
          <Col xs={{ offset: 9 }}>
            <Space size="middle">
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  // style={{ width: "75px" }}
                >
                  Add
                </Button>
              </Form.Item>
              <Form.Item>
                <Button type="primary" danger onClick={handleModalCancel}>
                  Cancel
                </Button>
              </Form.Item>
            </Space>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default RentBook;
