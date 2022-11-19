import { Button, Col, Form, Input, message, Modal, Row, Space } from "antd";
import TextArea from "antd/lib/input/TextArea";
import React from "react";
import axios from "../../../api/axios";
import { CategoryDataType } from "./Category";

const CATEGORY_URL = "bookrental/category";

interface ModalProps {
  data: CategoryDataType[];
  modalOpen: boolean;
  setData: React.Dispatch<React.SetStateAction<CategoryDataType[]>>;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const CategoryForm = ({
  data,
  setData,
  modalOpen,
  setModalOpen,
}: ModalProps) => {
  const [formModal] = Form.useForm();

  const onFinish = async (values: any) => {
    console.log({ values });
    try {
      const response = await axios.post(
        CATEGORY_URL,
        JSON.stringify({
          // categoryId: data.length + 1,
          categoryName: values.categoryName,
          categoryDescription: values.categoryDescription,
        }),
        {
          headers: { "Content-Type": "application/json" },
          // withCredentials: true,
        }
      );
      console.log(JSON.stringify(response?.data));
      setData([
        ...data,
        {
          // key: values.categoryId ? values.categoryId : data.length + 1,
          categoryId: values.categoryId ? values.categoryId : data.length + 1,
          categoryName: values.categoryName,
          categoryDescription: values.categoryDescription,
        },
      ]);

      formModal.resetFields();
      setModalOpen(false);
      if (response.status === 200) {
        message.success(response.data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleModalCancel = () => {
    setModalOpen(false);
  };
  return (
    <Modal
      title="Category Entry"
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
        <Form.Item
          label="Name"
          name="categoryName"
          rules={[{ required: true, message: "Please input category name!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Description"
          name="categoryDescription"
          rules={[
            {
              required: true,
              message: "Please input category description!",
            },
          ]}
        >
          <TextArea style={{ height: "115px" }} />
        </Form.Item>

        <Row>
          <Col xs={{ offset: 9 }}>
            <Space size="middle">
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ width: "75px" }}
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

export default CategoryForm;
