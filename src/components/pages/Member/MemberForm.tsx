import { Button, Col, Form, Input, message, Modal, Row, Space } from "antd";
import React from "react";
import axios from "../../../api/axios";
import { MemberDataType } from "./Member";

const MEMBER_URL = "bookrent/member";

interface ModalProps {
  data: MemberDataType[];
  modalOpen: boolean;
  setData: React.Dispatch<React.SetStateAction<MemberDataType[]>>;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const MemberForm = ({ data, setData, modalOpen, setModalOpen }: ModalProps) => {
  const [formModal] = Form.useForm();

  const onFinish = async (values: any) => {
    console.log({ values });

    try {
      const response = await axios.post(
        MEMBER_URL,
        JSON.stringify({
          memberId: data.length + 1,
          name: values.name,
          email: values.email,
          mobileNo: values.mobileNo,
          address: values.address,
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
          key: values.memberId ? values.memberId : data.length + 1,
          memberId: values.memberId ? values.memberId : data.length + 1,
          name: values.name,
          email: values.email,
          mobileNo: values.mobileNo,
          address: values.address,
        },
      ]);

      formModal.resetFields();
      setModalOpen(false);
      message.success(`${values.name} added !`);
    } catch (err) {
      console.log(err);
    }
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
        {/* <Form.Item
        label="ID"
        name="memberId"
        rules={[
          { required: false, message: "Please input member ID!" },
        ]}
      >
        <Input type="number" />
      </Form.Item> */}
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please input name!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              message: "Please input email!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Mobile"
          name="mobileNo"
          rules={[
            {
              required: true,
              message: "Please input mobile!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Address"
          name="address"
          rules={[
            {
              required: true,
              message: "Please input address!",
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

export default MemberForm;
