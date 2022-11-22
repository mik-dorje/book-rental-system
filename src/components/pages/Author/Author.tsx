import {
  Button,
  Form,
  Input,
  message,
  Popconfirm,
  Row,
  Space,
  Table,
  Tooltip,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import axios from "../../../api/axios";
import {
  SearchOutlined,
  PlusCircleFilled,
  DeleteFilled,
  DeleteOutlined,
  EditOutlined,
  RollbackOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import AuthorForm from "./AuthorForm";
import authHeader from "../../../hooks/authHeader";

const AUTHOR_URL = "bookrental/author";

export interface AuthorDataType {
  // key: string;
  authorId: number;
  authorName: string;
  authorEmail: string;
  authorMobile: string;
}


export const originalAuthorData: AuthorDataType[] = [
  {
    // key: "",
    authorId: 0,
    authorName: "",
    authorEmail: "",
    authorMobile: "",
  },
];

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: "number" | "text";
  record: AuthorDataType;
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
    dataIndex === "authorId" ? (
      <Input
        disabled
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
  const [data, setData] = useState<AuthorDataType[]>(originalAuthorData);
  const [editingKey, setEditingKey] = useState<any>(null);
  const [loaded, setLoaded] = useState(false);

  const [typedWord, setTypedWord] = useState<any>(null);
  const [tableData, setTableData] =
    useState<AuthorDataType[]>(originalAuthorData);

  const [modalOpen, setModalOpen] = useState(false);
  const isEditing = (record: AuthorDataType) => record.authorId === editingKey;

  const fetchData = async () => {
    const result = await axios(AUTHOR_URL);
    console.log(result.data.data);
    const dataObj = result.data.data;

    dataObj.sort((a: AuthorDataType, b: AuthorDataType) =>
      a?.authorId > b?.authorId ? 1 : b?.authorId > a?.authorId ? -1 : 0
    );

    setData(dataObj);
    setTableData(dataObj);
    setLoaded(true);
    console.log("Authors fetched");
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setTableData(data);
    if (typedWord) {
      const resultArray = data?.filter(
        (item) =>
          item?.authorId
            ?.toString()
            .toLowerCase()
            .includes(typedWord.toLowerCase()) ||
          item?.authorName?.toLowerCase().includes(typedWord.toLowerCase()) ||
          item?.authorEmail?.toLowerCase().includes(typedWord.toLowerCase()) ||
          item?.authorMobile?.toLowerCase().includes(typedWord.toLowerCase())
      );
      setTableData(resultArray);
    }
  }, [typedWord, data]);

  const edit = (record: Partial<AuthorDataType>) => {
    form.setFieldsValue({
      authorId: null,
      authorName: "",
      authorEmail: "",
      authorMobile: "",
      ...record,
    });
    setEditingKey(record.authorId);
  };

  const handleDelete = (record: Partial<AuthorDataType>) => {
    const newData = data.filter((item) => item.authorId !== record.authorId);
    setData(newData);
    console.log(record);
    message.success({
      content: `${record.authorName} removed !`,
      icon: <DeleteFilled />,
    });
    // no delete api yet
  };

  const update = async (record: Partial<AuthorDataType>) => {
    try {
      const row = (await form.validateFields()) as AuthorDataType;
      // Patch logic for backend

      await axios.post(
        AUTHOR_URL,
        {
          authorId: row.authorId,
          authorName: row.authorName,
          authorEmail: row.authorEmail,
          authorMobile: row.authorMobile,
        },
        {
          headers: authHeader(),
        }
      );

      const newData = [...data];
      const index = newData.findIndex(
        (item) => record.authorId === item.authorId
      );
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });

        setData(newData);
        message.info(`${row.authorName} updated !`);
        setEditingKey(null);
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey(null);
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const cancel = () => {
    setEditingKey(null);
  };

  const columns = [
    {
      title: "S.N",
      dataIndex: "authorId",
      width: "15%",
      editable: true,
    },
    {
      title: "Author",
      dataIndex: "authorName",
      width: "20%",
      editable: true,
      render: (_: any, record: AuthorDataType) => (
        <Link to={record.authorId?.toString()}>{record.authorName}</Link>
      ),
    },
    {
      title: "Email",
      dataIndex: "authorEmail",
      width: "20%",
      editable: true,
    },
    {
      title: "Mobile",
      dataIndex: "authorMobile",
      width: "20%",
      editable: true,
    },
    {
      title: "Action",
      dataIndex: "operation",
      width: "20%",
      render: (_: any, record: AuthorDataType) => {
        const editable = isEditing(record);
        return editable ? (
          <Space size="middle">
            <Tooltip title="Update">
              <Button
                shape="circle"
                icon={<CheckOutlined />}
                onClick={() => update(record)}
              />
            </Tooltip>

            <Tooltip title="Back">
              <Button
                shape="circle"
                icon={<RollbackOutlined />}
                onClick={cancel}
              />
            </Tooltip>
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
              <Tooltip title="Delete">
                <Button
                  shape="circle"
                  icon={<DeleteOutlined />}
                  disabled={editingKey !== null}
                />
              </Tooltip>
            </Popconfirm>
            <Tooltip title="Edit">
              <Button
                shape="circle"
                icon={<EditOutlined />}
                disabled={editingKey !== null}
                onClick={() => edit(record)}
              />
            </Tooltip>
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
      onCell: (record: AuthorDataType) => ({
        record,
        inputType: col.dataIndex === "authorId" ? "number" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <div className="App">
      <div className="main-page">
        <AuthorForm
          data={data}
          setData={setData}
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
        />

        <Form form={form} component={false} initialValues={{ remember: false }}>
          <Row justify="space-between">
            <Form.Item>
              <Button
                type="primary"
                icon={<PlusCircleFilled style={{ fontSize: "18px" }} />}
                onClick={() => setModalOpen(true)}
              >
                <Typography.Text strong style={{ zIndex: 2, color: "white" }}>
                  Author
                </Typography.Text>
              </Button>
            </Form.Item>
            <Typography.Title level={5} style={{ zIndex: 2, color: "white" }}>
              AUTHORS
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
              scroll={{ x: "40%" }}
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
