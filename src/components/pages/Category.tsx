import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Popconfirm,
  Row,
  Space,
  Table,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import {
  SearchOutlined,
  PlusCircleFilled,
  DeleteFilled,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

const CATEGORY_URL = "bookrental/category";

interface DataType {
  key: string;
  categoryId: number | null;
  categoryName: string;
  categoryDescription: any;
}

const originData: DataType[] = [
  {
    key: "",
    categoryId: null,
    categoryName: "",
    categoryDescription: "",
  },
];

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: "number" | "text";
  record: DataType;
  index: number;
  children: React.ReactNode;
}

const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode =
    inputType === "number" ? (
      <InputNumber
        style={{
          width: "90%",
          backgroundColor: "#fff",
          border: " 1px dotted #8b8a8b",
          borderRadius: "6px",
        }}
      />
    ) : (
      <Input
        style={{
          width: "90%",
          backgroundColor: "#fff",
          border: " 1px dotted #8b8a8b",
          borderRadius: "6px",
        }}
      />
    );

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const App: React.FC = () => {
  const [form] = Form.useForm();
  const [formModal] = Form.useForm();
  const [data, setData] = useState<DataType[]>(originData);
  const [editingKey, setEditingKey] = useState("");
  const [loaded, setLoaded] = useState(false);

  const [typedWord, setTypedWord] = useState<any>(null);
  const [tableData, setTableData] = useState<any>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const isEditing = (record: DataType) => record.key === editingKey;

  const fetchData = async () => {
    const result = await axios(CATEGORY_URL);
    console.log(result.data.data);
    // const data = result.data.map(({ username, email, phone, website, company, ...rest }) => rest);
    const dataObj = result.data.data.map((object: DataType) => {
      return {
        key: object?.categoryId?.toString(),
        categoryId: object.categoryId,
        categoryName: object.categoryName,
        categoryDescription: object.categoryDescription,
      };
    });
    setData(dataObj);
    setTableData(dataObj);
    setLoaded(true);
  };

  useEffect(() => {
    fetchData();
    console.log("First data fetch");
  }, []);

  useEffect(() => {
    setTableData(data);
    if (typedWord) {
      const resultArray = data?.filter(
        (item) =>
          item?.categoryId
            ?.toString()
            .toLowerCase()
            .includes(typedWord.toLowerCase()) ||
          item?.categoryName?.toLowerCase().includes(typedWord.toLowerCase()) ||
          item?.categoryDescription
            ?.toLowerCase()
            .includes(typedWord.toLowerCase())
      );
      setTableData(resultArray);
    }
  }, [typedWord, data]);

  const edit = (record: Partial<DataType> & { key: React.Key }) => {
    form.setFieldsValue({
      categoryId: "",
      CategoryName: "",
      CategoryDescription: "",
      ...record,
    });
    setEditingKey(record.key);
  };

  const handleDelete = (record: Partial<DataType> & { key: React.Key }) => {
    const newData = data.filter((item) => item.key !== record.key);
    setData(newData);
    console.log(record);

    message.success({
      content: `${record.categoryName} removed !`,
      icon: <DeleteFilled />,
    });
  };

  const update = async (key: React.Key) => {
    try {
      const row = (await form.validateFields()) as DataType;
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        // Patch logic for backend
        setData(newData);
        setEditingKey("");
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey("");
      }
      message.info("Data updated !");
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const cancel = () => {
    setEditingKey("");
  };

  const onFinish = async (values: any) => {
    console.log({ values });

    try {
      const response = await axios.post(
        CATEGORY_URL,
        JSON.stringify({
          categoryId: values.categoryId ? values.categoryId : data.length + 1,
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
          key: values.categoryId ? values.categoryId : data.length + 1,
          categoryId: values.categoryId ? values.categoryId : data.length + 1,
          categoryName: values.categoryName,
          categoryDescription: values.categoryDescription,
        },
      ]);

      formModal.resetFields();
      setModalOpen(false);
      message.success(`${values.categoryName} added !`);
    } catch (err) {
      console.log(err);
    }
  };

  const handleModalCancel = () => {
    setModalOpen(false);
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "categoryId",
      width: "15%",
      editable: true,
      render: (_: any, record: DataType) => (
        <Link to={record.key}>{record.key}</Link>
      ),
    },
    {
      title: "Category",
      dataIndex: "categoryName",
      width: "20%",
      editable: true,
      render: (_: any, record: DataType) => (
        <Link to={record.key}>{record.categoryName}</Link>
      ),
    },
    {
      title: "Description",
      dataIndex: "categoryDescription",
      width: "20%",
      editable: true,
    },
    {
      title: "Action",
      dataIndex: "operation",
      width: "20%",
      render: (_: any, record: DataType) => {
        const editable = isEditing(record);
        return editable ? (
          <Space size="middle">
            <Button
              type="primary"
              onClick={() => update(record.key)}
              style={{
                backgroundColor: " #38375f",
                border: "none",
                width: "75px",
              }}
              className="btns"
            >
              Update
            </Button>

            <Button
              type="primary"
              onClick={cancel}
              style={{
                backgroundColor: "#2c5a73",
                border: "none",
                width: "75px",
              }}
              className="btns"
            >
              Back
            </Button>
          </Space>
        ) : (
          <Space size="middle">
            <Popconfirm
              title="Are you sure to delete this record ?"
              icon={<DeleteFilled style={{ color: "red" }} />}
              onConfirm={() => handleDelete(record)}
              okText="Delete"
              cancelText="Cancel"
            >
              <Button
                type="primary"
                danger
                style={{ width: "75px" }}
                disabled={editingKey !== ""}
              >
                Delete
              </Button>
            </Popconfirm>
            <Button
              type="primary"
              disabled={editingKey !== ""}
              onClick={() => edit(record)}
              style={{ width: "75px" }}
            >
              Edit
            </Button>
          </Space>
        );
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: DataType) => ({
        record,
        inputType: col.dataIndex === "id" ? "number" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <div className="App">
      <div className="main-page">
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
            <Form.Item
              label="ID"
              name="categoryId"
              rules={[
                { required: false, message: "Please input category ID!" },
              ]}
            >
              <Input type="number" />
            </Form.Item>
            <Form.Item
              label="Name"
              name="categoryName"
              rules={[
                { required: true, message: "Please input category name!" },
              ]}
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

        <Form form={form} component={false} initialValues={{ remember: false }}>
          <Row justify="space-between">
            <Form.Item>
              <Button
                type="primary"
                icon={<PlusCircleFilled style={{ fontSize: "18px" }} />}
                onClick={() => setModalOpen(true)}
              >
                <Typography.Text strong style={{ color: "white" }}>
                  Category
                </Typography.Text>
              </Button>
            </Form.Item>
            <Typography.Title level={5} style={{ color: "black" }}>
              CATEGORIES
            </Typography.Title>
            <Space size="small" direction="horizontal">
              <Form.Item name="search">
                <Input
                  prefix={<SearchOutlined className="site-form-item-icon" />}
                  placeholder="Search"
                  autoCapitalize="off"
                  onChange={(e) => setTypedWord(e.target.value)}
                />
              </Form.Item>
            </Space>
          </Row>

          {loaded ? (
            <Table
              className="main-table"
              components={{
                body: {
                  cell: EditableCell,
                },
              }}
              bordered
              dataSource={tableData}
              columns={mergedColumns}
              rowClassName="editable-row"
              pagination={{
                onChange: cancel,
                pageSize: 5,
              }}
            />
          ) : (
            <div className="loader-box">
              <span className="loader"></span>
            </div>
          )}
        </Form>
      </div>
    </div>
  );
};

export default App;
