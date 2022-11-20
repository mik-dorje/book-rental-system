import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  Row,
  Select,
  Space,
} from "antd";
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

  const [categories, setCategories] = useState(originalCategoryData);
  const [authors, setAuthors] = useState(originalAuthorData);

  const [imgfile, setImgFile] = useState("");

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
  }, []);

  const handleModalCancel = () => {
    setModalOpen(false);
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

  const imgFilehandler = (e: any) => {
    console.log(e.target.files[0]);

    if (e.target.files.length !== 0) {
      setImgFile(e.target.files[0]);
    }
  };

  // Form Modal Functions
  const onFinish = async (values: any) => {
    console.log({ values });
    const formdata = new FormData();
    formdata.append("bookImage", imgfile);
    formdata.append("bookName", values.bookName);
    formdata.append("noOfPages", values.noOfPages);
    formdata.append("isbn", values.isbn);
    formdata.append("rating", values.rating);
    formdata.append("stockCount", values.stockCount);
    formdata.append(
      "publishedDate",
      values.publishedDate._d.toISOString().slice(0, 10)
    );
    formdata.append("categoryId", values.categoryId);
    formdata.append("authorId", values.authorId);

    try {
      const response = await axios.post(BOOK_URL, formdata, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log(JSON.stringify(response?.data));
      setData([
        ...data,
        {
          // key: values.bookId ? values.bookId : data.length + 1,
          bookId: values.bookId ? values.bookId : data.length + 1,
          bookName: values.bookName,
          noOfPages: values.noOfPages,
          isbn: values.isbn,
          rating: values.rating,
          stockCount: values.stockCount,
          publishedDate: values.publishedDate._d.toISOString().slice(0, 10),
          categoryId: values.categoryId,
          authorId: values.authorId,
          bookImage: imgfile,
        },
      ]);

      formModal.resetFields();
      setModalOpen(false);
      if (response.status === 200) {
        message.success(response.data.message);
      }
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
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
        labelCol={{ span: 10 }}
        wrapperCol={{ span: 12 }}
        initialValues={{ remember: false }}
        onFinish={onFinish}
        // style={{ backgroundColor: "green" }}
        // onFinishFailed={onFinishFailed}
        // autoComplete="off"
      >
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
              label="Author"
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
                placeholder="Please select Authors"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={MultiSelectoptions}
              />
            </Form.Item>
            <Form.Item
              label="Category"
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
                placeholder="Please select Category"
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
              label="Published Date"
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
                format="YYYY-MM-DD"
                style={{ width: "100%" }}
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
              style={{ width: "100%" }}
            >
              <Input
                type="file"
                // onChange={onFileSelect}
                onChange={(e) => imgFilehandler(e)}
              />
            </Form.Item>
          </div>
        </Space>

        <Row>
          <Col xs={{ offset: 9 }}>
            <Space size="middle">
              <Form.Item>
                <Button type="primary" htmlType="submit">
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
