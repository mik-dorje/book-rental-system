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
import React, { useEffect, useState } from "react";
import axios from "../../../api/axios";
import { originalAuthorData } from "../Author/Author";
import { originalCategoryData } from "../Category/Category";
import { BookDataType } from "./Book";

const BOOK_URL = "/bookrental/book";
const CATEGORY_URL = "bookrental/category";
const AUTHOR_URL = "bookrental/author";

interface ModalProps {
  data: BookDataType[];
  modalOpen: boolean;
  setData: React.Dispatch<React.SetStateAction<BookDataType[]>>;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const BookForm = ({ data, setData, modalOpen, setModalOpen }: ModalProps) => {
  const [formModal] = Form.useForm();
  const [base64Code, setBase64Code] = useState("");

  const [categories, setCategories] = useState(originalCategoryData);
  const [authors, setAuthors] = useState(originalAuthorData);

  const fetchCategories = async () => {
    const result = await axios(CATEGORY_URL);
    setCategories(result.data.data);
  };
  const fetchAuthors = async () => {
    const result = await axios(AUTHOR_URL);
    setAuthors(result.data.data);
  };

  useEffect(() => {
    fetchCategories();
    fetchAuthors();
    console.log("Data fetched");
  }, []);

  // for published DatePicker in calendar
  // const OnDatePick = (dateString: any) => {
  //   console.log(dateString.toDate());
  //   console.log(moment(dateString).format('YYYY-MM-DD'))
  // };

  // for image to base64

  const imgData =
    "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";

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
      // bookId: values.bookId,
      bookName: values.bookName,
      noOfPages: values.noOfPages,
      isbn: values.isbn,
      rating: values.rating,
      stockCount: values.stockCount,
      // publishedDate: new Date().toISOString().slice(0, 10),
      publishedDate: values.publishedDate._d.toISOString().slice(0, 10),
      categoryId: values.categoryId,
      authorId: values.authorId,
      bookImage: imgData,
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
  const singleSelectOptions = categories.map((category) => {
    return {
      label: category.categoryName,
      value: category.categoryId,
    };
  });

  // For multiple books select

  const MultiSelectoptions = authors.map((author) => {
    return {
      label: author.authorName,
      value: author.authorId,
    };
  });

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
        <Form.Item
          label="ID"
          name="bookId"
          rules={[{ required: false, message: "Please input category ID!" }]}
        >
          <Input type="number" />
        </Form.Item>

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
