import { Button, Col, Form, Input, message, Modal, Row, Space } from "antd";
import React, { useState } from "react";
import axios from "../../../api/axios";
import authHeader from "../../../hooks/authHeader";
import { AuthorDataType } from "./Author";

const AUTHOR_URL = "bookrental/author";

interface ModalProps {
  data: AuthorDataType[];
  modalOpen: boolean;
  fetchData(): void;
  setData: React.Dispatch<React.SetStateAction<AuthorDataType[]>>;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const AuthorForm = ({
  data,
  setData,
  fetchData,
  modalOpen,
  setModalOpen,
}: ModalProps) => {
  const [formModal] = Form.useForm();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [isSubmit, setIsSubmit] = useState(false);

  const onFinish = async (values: any) => {
    setIsSubmit(true);

    try {
      const response = await axios.post(
        AUTHOR_URL,
        JSON.stringify({
          // authorId: data.length + 1,
          authorName: values.authorName,
          authorEmail: values.authorEmail,
          authorMobile: values.authorMobile,
        }),
        { headers: authHeader() }
      );

      if (response.data.status === 1) {
        message.success(`${values.authorName} added !`);
      }
      fetchData();
      formModal.resetFields();
      setModalOpen(false);
    } catch (err) {
      console.log(err);
    }
    setIsSubmit(false);
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
        <Form.Item label="Name" name="authorName">
          <Input onChange={(e) => setName(e.target.value)} />
        </Form.Item>
        <Form.Item label="Email" name="authorEmail">
          <Input onChange={(e) => setEmail(e.target.value)} />
        </Form.Item>
        <Form.Item label="Mobile" name="authorMobile">
          <Input onChange={(e) => setMobile(e.target.value)} />
        </Form.Item>

        <Row>
          <Col xs={{ offset: 9 }}>
            <Space size="middle">
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ width: "95px" }}
                  disabled={!name || !email || !mobile ? true : false}
                >
                  {isSubmit ? "Submitting" : "Submit"}
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
