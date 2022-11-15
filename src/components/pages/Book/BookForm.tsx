import { UploadOutlined } from "@ant-design/icons";
import { render } from "@testing-library/react";
import {
  Button,
  Col,
  DatePicker,
  DatePickerProps,
  Form,
  Input,
  message,
  Modal,
  Row,
  Select,
  Space,
  Upload,
  UploadProps,
} from "antd";
import moment from "moment";
import React, { useState } from "react";
import axios from "../../../api/axios";
import { BookDataType } from "./Book";

const BOOK_URL = "/bookrental/book";

interface ModalProps {
  data: BookDataType[];
  modalOpen: boolean;
  setData: React.Dispatch<React.SetStateAction<BookDataType[]>>;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const BookForm = ({ data, setData, modalOpen, setModalOpen }: ModalProps) => {
  const [formModal] = Form.useForm();

  const [base64Code, setBase64Code] = useState("");

  // for published DatePicker in calendar
  // const OnDatePick = (dateString: any) => {
  //   console.log(dateString.toDate());
  //   console.log(moment(dateString).format('YYYY-MM-DD'))
  // };

  // for image to base64

  const props: UploadProps = {
    name: "file",
    action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
    headers: {
      authorization: "authorization-text",
    },
    onChange(info: any) {
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        message.success(`${info.file.name} file uploaded successfully`);
        getbase64(info.file);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

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
      setData([
        ...data,
        {
          key: values.bookId ? values.bookId : data.length + 1,
          bookId: values.bookId,
          bookName: values.bookName,
          noOfPages: values.noOfPages,
          isbn: values.isbn,
          rating: values.rating,
          stockCount: values.stockCount,
          publishedDate: values.publishedDate._d.toISOString().slice(0, 10),
          categoryId: values.categoryId,
          authorId: values.authorId,
          bookImage: values.bookImage,
        },
      ]);

      formModal.resetFields();
      setModalOpen(false);
      // message.success(`${values?.bookName} added !`);
    } catch (err) {
      console.log(err);
    }
  };

  const handleModalCancel = () => {
    setModalOpen(false);
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
    <Modal
      title="Book Entry"
      centered
      open={modalOpen}
      onOk={() => setModalOpen(false)}
      onCancel={() => setModalOpen(false)}
      okButtonProps={{ hidden: true }}
      cancelButtonProps={{ hidden: true }}
      style={{ boxShadow: "0 0 8px 2px #e5e1e0" }}
      width={600}
    >
      <Form
        form={formModal}
        name="basic"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 14 }}
        initialValues={{ remember: false }}
        onFinish={onFinish}
        // style={{ backgroundColor: "green" }}
        // onFinishFailed={onFinishFailed}
        // autoComplete="off"
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

        <Space direction="horizontal">
          <div>
            <Form.Item
              label="Name"
              name="bookName"
              rules={[{ required: false, message: "Please input book name!" }]}
            >
              <Input type="string" />
            </Form.Item>
            <Form.Item
              label="ISBN"
              name="isbn"
              rules={[
                {
                  required: false,
                  message: "Please input ISBN!",
                },
              ]}
            >
              <Input type="string" />
            </Form.Item>
            <Form.Item
              label="Rating"
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
            <Form.Item
              label="Pages"
              name="noOfPages"
              rules={[
                {
                  required: false,
                  message: "Please input number of pages!",
                },
              ]}
            >
              <Input type="number" />
            </Form.Item>
            <Form.Item
              label="Publish Date"
              name="publishedDate"
              rules={[
                {
                  required: false,
                  message: "Please input published date!",
                },
              ]}
            >
              <DatePicker
                placement="topLeft"
                // defaultValue={moment()}
                format="YYYY-MM-DD"
                // onChange={onDatePick}
                // style={{ width: "100%" }}
              />
            </Form.Item>
          </div>
          <div>
            <Form.Item
              label="Stock"
              name="stockCount"
              rules={[
                {
                  required: false,
                  message: "Please input stock count!",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="CategoryId"
              name="categoryId"
              rules={[
                {
                  required: false,
                  message: "Please input category ID!",
                },
              ]}
            >
              <Select
                showSearch
                // style={{ width: "100%" }}
                placeholder="Please select Category"
                onChange={handleSingleSelect}
                allowClear
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={singleSelectOptions}
              />
            </Form.Item>
            <Form.Item
              label="Author ID"
              name="authorId"
              rules={[
                {
                  required: false,
                  message: "Please input author ID!",
                },
              ]}
            >
              <Select
                showSearch
                mode="multiple"
                allowClear
                // style={{ width: "100%" }}
                placeholder="Please select Authors"
                optionFilterProp="children"
                // defaultValue={["a10", "c12"]}
                onChange={handleMultipleSelect}
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={MultiSelectoptions}
              />
            </Form.Item>
            <Form.Item
              label="Book Image"
              name="bookImage"
              rules={[
                {
                  required: false,
                  message: "Please upload book image!",
                },
              ]}
            >
              <Input type="file" onChange={onFileSelect} />
            </Form.Item>
            {/* <Form.Item
          label="Book Image"
          name="bookImage"
          rules={[
            {
              required: false,
              message: "Please upload book image!",
            },
          ]}
          style={{ width: "100%" }}
          >
          <Upload {...props}>
          <Button icon={<UploadOutlined />}>Click to Upload</Button>
          </Upload>
        </Form.Item> */}
          </div>
        </Space>
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
    </Modal>
  );
};

export default BookForm;
