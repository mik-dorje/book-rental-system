import { Button, Col, Form, Input, message, Modal, Row, Space } from "antd";
import React, { useState } from "react";
import axios from "../../../api/axios";
import authHeader from "../../../hooks/authHeader";
import { MemberDataType } from "./Member";

const MEMBER_URL = "bookrental/member";

interface ModalProps {
  data: MemberDataType[];
  modalOpen: boolean;
  fetchData(): void;
  setData: React.Dispatch<React.SetStateAction<MemberDataType[]>>;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const MemberForm = ({
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
  const [address, setAddress] = useState("");
  const [isSubmit, setIsSubmit] = useState(false);

  const onFinish = async (values: any) => {
    setIsSubmit(true);

    try {
      const response = await axios.post(
        MEMBER_URL,
        JSON.stringify({
          // memberId: data.length + 1,
          name: values.name,
          email: values.email,
          mobileNo: values.mobileNo,
          address: values.address,
        }),
        { headers: authHeader() }
      );

      if (response.status === 200) {
        message.success(response.data.message);
      }
      formModal.resetFields();
      setModalOpen(false);
      fetchData();
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
      title="Member Entry"
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
        <Form.Item label="Name" name="name">
          <Input onChange={(e) => setName(e.target.value)} />
        </Form.Item>
        <Form.Item label="Email" name="email">
          <Input onChange={(e) => setEmail(e.target.value)} />
        </Form.Item>
        <Form.Item label="Mobile" name="mobileNo">
          <Input onChange={(e) => setMobile(e.target.value)} />
        </Form.Item>
        <Form.Item label="Address" name="address">
          <Input onChange={(e) => setAddress(e.target.value)} />
        </Form.Item>

        <Row>
          <Col xs={{ offset: 9 }}>
            <Space size="middle">
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ width: "95px" }}
                  disabled={
                    !name || !email || !mobile || !address ? true : false
                  }
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

export default MemberForm;
