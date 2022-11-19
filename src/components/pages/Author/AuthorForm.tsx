import { Button, Col, Form, Input, message, Modal, Row, Space } from "antd";
import React from "react";
import axios from "../../../api/axios";
import { AuthorDataType } from "./Author";

const AUTHOR_URL = "bookrental/author";

interface ModalProps {
  data: AuthorDataType[];
  modalOpen: boolean;
  setData: React.Dispatch<React.SetStateAction<AuthorDataType[]>>;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const AuthorForm = ({ data, setData, modalOpen, setModalOpen }: ModalProps) => {
  const [formModal] = Form.useForm();

  const onFinish = async (values: any) => {
    console.log({ values });

    try {
      const response = await axios.post(
        AUTHOR_URL,
        JSON.stringify({
          // authorId: data.length + 1,
          authorName: values.authorName,
          authorEmail: values.authorEmail,
          authorMobile: values.authorMobile,
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
          // key: values.authorId ? values.authorId : data.length + 1,
          authorId: values.authorId ? values.authorId : data.length + 1,
          authorName: values.authorName,
          authorEmail: values.authorEmail,
          authorMobile: values.authorMobile,
        },
      ]);

      formModal.resetFields();
      setModalOpen(false);
      message.success(`${values.authorName} added !`);
    } catch (err) {
      console.log(err);
    }
  };

  const handleModalCancel = () => {
    setModalOpen(false);
  };

  return (
    <Modal
      title="Author Entry"
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
              name="authorId"
              rules={[
                { required: false, message: "Please input category ID!" },
              ]}
            >
              <Input type="number" />
            </Form.Item> */}
        <Form.Item
          label="Name"
          name="authorName"
          rules={[{ required: true, message: "Please input author name!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Email"
          name="authorEmail"
          rules={[
            {
              required: true,
              message: "Please input author email!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Mobile"
          name="authorMobile"
          rules={[
            {
              required: true,
              message: "Please input author mobile!",
            },
          ]}
        >
          <Input />
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

export default AuthorForm;
