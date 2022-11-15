import { RollbackOutlined, UploadOutlined } from "@ant-design/icons";
import { render } from "@testing-library/react";
import {
  Button,
  Col,
  DatePicker,
  DatePickerProps,
  Divider,
  Form,
  Input,
  message,
  Modal,
  Row,
  Select,
  Space,
  Typography,
  Upload,
  UploadProps,
} from "antd";
import React, { useState } from "react";
import axios from "../../../api/axios";
import { useNavigate } from "react-router-dom";

const BOOK_URL = "/bookrental/book";

// interface ModalProps {
//   data: BookDataType[];
//   modalOpen: boolean;
//   setData: React.Dispatch<React.SetStateAction<BookDataType[]>>;
//   setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
// }

const ReturnBook = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [base64Code, setBase64Code] = useState("");
  // for published DatePicker in calendar
  // const OnDatePick = (dateString: any) => {
  //   console.log(dateString.toDate());
  //   console.log(moment(dateString).format('YYYY-MM-DD'))
  // };

  // while not using ant design upload component
  const onFileSelect = (e: any) => {
    const files = e.target.files;
    const file = files[0];
    getbase64(file);
  };
  const getbase64 = (file: any) => {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      onload(reader.result);
    };
  };
  const onload = (fileString: any) => {
    setBase64Code(fileString);
    console.log(base64Code);
  };

  // Form Modal Functions
  const onFinish = async (values: any) => {
    console.log({ values });

    const newBookData = {
      bookName: values.bookName,
      rating: values.rating,
      isbn: values.isbn,
      noOfPages: values.noOfPages,
      stockCount: values.stockCount,
      photo: values.photo,
      // publishedDate: new Date().toISOString().slice(0, 10),
      publishedDate: values.publishedDate._d.toISOString().slice(0, 10),
      bookImage: base64Code,
      // bookImage: values.bookgImage,
      categoryId: 1,
      authorId: values.authorId,
    };
    console.log(newBookData);

    try {
      const response = await axios.post(BOOK_URL, JSON.stringify(newBookData), {
        headers: { "Content-Type": "application/json" },
        // withCredentials: true,
      });
      console.log(JSON.stringify(response?.data));
      //   setData([
      //     ...data,
      //     {
      //       key: values.bookId ? values.bookId : data.length + 1,
      //       bookId: values.bookId,
      //       bookName: values.bookName,
      //       noOfPages: values.noOfPages,
      //       isbn: values.isbn,
      //       rating: values.rating,
      //       stockCount: values.stockCount,
      //       publishedDate: values.publishedDate._d.toISOString().slice(0, 10),
      //       photo: values.photo,
      //       categoryId: values.categoryId,
      //       authorId: values.authorId,
      //       bookImage: values.bookImage,
      //     },
      //   ]);

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

  //For Single Category ID select
  // Although this code does nothing to form values
  const handleSingleSelect = (value: string) => {
    // console.log(`selected ${value}`);
  };

  // For multiple Author ID select
  const singleSelectOptions = [
    {
      label: "one",
      value: 1,
    },
  ];

  const MultiSelectoptions = [
    {
      label: "one",
      value: 1,
    },
    {
      label: "two",
      value: 2,
    },
    {
      label: "three",
      value: 3,
    },
  ];

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
            RETURN BOOK
          </Typography.Title>
        </Divider>

        <Form.Item
          label="Book"
          name="book"
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
            placeholder="Please select book"
            onChange={handleSingleSelect}
            allowClear
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={singleSelectOptions}
          />
        </Form.Item>
        <Form.Item
          label="Member"
          name="member"
          rules={[
            {
              required: false,
              message: "Please input member!",
            },
          ]}
        >
          <Select
            showSearch
            mode="multiple"
            allowClear
            // style={{ width: "100%" }}
            placeholder="Please select member"
            optionFilterProp="children"
            // defaultValue={["a10", "c12"]}
            onChange={handleMultipleSelect}
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={MultiSelectoptions}
          />
        </Form.Item>
        <Form.Item
          label="Code"
          name="code"
          rules={[{ required: false, message: "Please input code!" }]}
          style={{ width: "100%" }}
        >
          <Input type="string" />
        </Form.Item>

        <Form.Item
          label="Days"
          name="rating"
          rules={[
            {
              required: false,
              message: "Please input rating!",
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

export default ReturnBook;
