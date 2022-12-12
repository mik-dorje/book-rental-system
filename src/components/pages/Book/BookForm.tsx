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
import authHeader from "../../../hooks/authHeader";
import { originalAuthorData } from "../Author/Author";
import { originalCategoryData } from "../Category/Category";
import { BookDataType } from "./Book";

const BOOK_URL = "/bookrental/book";
const CATEGORY_URL = "bookrental/category";
const AUTHOR_URL = "bookrental/author";

interface ModalProps {
  data: BookDataType[];
  modalOpen: boolean;
  fetchData(): void;
  setData: React.Dispatch<React.SetStateAction<BookDataType[]>>;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const BookForm = ({
  data,
  setData,
  fetchData,
  modalOpen,
  setModalOpen,
}: ModalProps) => {
  const [formModal] = Form.useForm();

  const [categories, setCategories] = useState(originalCategoryData);
  const [authors, setAuthors] = useState(originalAuthorData);

  const [imgfile, setImgFile] = useState("");

  const [isSubmit, setIsSubmit] = useState(false);

  const fetchCategories = async () => {
    const result = await axios.get(CATEGORY_URL, {
      headers: authHeader(),
    });
    setCategories(result.data.data);
  };
  const fetchAuthors = async () => {
    const result = await axios.get(AUTHOR_URL, {
      headers: authHeader(),
    });
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
    // console.log(e.target.files[0]);
    if (e.target.files.length !== 0) {
      setImgFile(e.target.files[0]);
    }
  };

  // Form Modal Functions
  const onFinish = async (values: any) => {
    setIsSubmit(true);
    console.log(values);
    // const isEmpty = Object.values(values).every((x) => x === null || x === "");
    // if (!isEmpty) {
    //   message.error("Please fill in all book details!");
    //   setIsSubmit(false);
    //   return;
    // }
    const formdata = new FormData();
    formdata.append("bookImage", imgfile);
    formdata.append("bookName", values.bookName);
    formdata.append("noOfPages", values.noOfPages);
    formdata.append("isbn", values.isbn);
    formdata.append("rating", values.rating);
    formdata.append("stockCount", values.stockCount);
    formdata.append(
      "publishedDate",
      values.publishedDate._d.toISOString().slice(0, 10) || ""
    );
    formdata.append("categoryId", values.categoryId);
    formdata.append("authorId", values.authorId);

    try {
      const localUser = localStorage.getItem("user");
      if (localUser) {
        const oneUser = JSON.parse(localUser);
        if (oneUser.jwt) {
          const response = await axios.post(BOOK_URL, formdata, {
            headers: {
              Authorization: "Bearer " + oneUser.jwt,
              "Content-Type": "multipart/form-data",
            },
          });

          console.log(JSON.stringify(response?.data));

          if (response.status === 200) {
            message.success(response.data.message);
          }
          fetchData();
          formModal.resetFields();
          setModalOpen(false);
        }
      }
    } catch (err: any) {
      message.error(err.message);
    }
    setIsSubmit(false);
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
              rules={[{ required: true, message: "Please input book name!" }]}
            >
              <Input type="string" />
            </Form.Item>
            <Form.Item
              label="ISBN"
              name="isbn"
              rules={[
                {
                  required: true,
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
                  required: true,
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
                  required: true,
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
                  required: true,
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
                  required: true,
                  message: "Please input author ID!",
                },
              ]}
            >
              <Select
                showSearch
                mode="multiple"
                allowClear
                placeholder="Please select Authors"
                optionFilterProp="items"
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
                  required: true,
                  message: "Please input category ID!",
                },
              ]}
            >
              <Select
                showSearch
                placeholder="Please select Category"
                allowClear
                optionFilterProp="items"
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
                  required: true,
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
                  required: true,
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
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ width: "95px" }}
                  loading={isSubmit}
                >
                  Submit
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
