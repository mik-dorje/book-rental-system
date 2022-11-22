import {
  Button,
  Form,
  Input,
  InputNumber,
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
  CheckOutlined,
  RollbackOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import MemberForm from "./MemberForm";
import authHeader from "../../../hooks/authHeader";

const MEMBER_URL = "bookrental/member";

export interface MemberDataType {
  // key: string;
  memberId: number;
  email: string;
  name: string;
  mobileNo: string;
  address: string;
}

export const originalMemberData: MemberDataType[] = [
  {
    // key: "",
    memberId: 0,
    email: "",
    name: "",
    mobileNo: "",
    address: "",
  },
];

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: "number" | "text";
  record: MemberDataType;
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
    dataIndex === "memberId" ? (
      <InputNumber
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
  const [data, setData] = useState<MemberDataType[]>(originalMemberData);
  const [editingKey, setEditingKey] = useState<any>(null);
  const [loaded, setLoaded] = useState(false);

  const [typedWord, setTypedWord] = useState<any>(null);
  const [tableData, setTableData] = useState<any>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const isEditing = (record: MemberDataType) => record.memberId === editingKey;

  const fetchData = async () => {
    const result = await axios(MEMBER_URL);
    console.log(result.data.data);
    const dataObj = result.data.data;
    dataObj.sort((a: MemberDataType, b: MemberDataType) =>
      a.memberId > b.memberId ? 1 : b.memberId > a.memberId ? -1 : 0
    );

    setData(dataObj);
    setTableData(dataObj);
    setLoaded(true);
    console.log("Members fetched");
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setTableData(data);
    if (typedWord) {
      const resultArray = data?.filter(
        (item) =>
          item?.memberId
            ?.toString()
            .toLowerCase()
            .includes(typedWord.toLowerCase()) ||
          item?.name?.toLowerCase().includes(typedWord.toLowerCase()) ||
          item?.email?.toLowerCase().includes(typedWord.toLowerCase()) ||
          item?.mobileNo?.toLowerCase().includes(typedWord.toLowerCase()) ||
          item?.address?.toLowerCase().includes(typedWord.toLowerCase())
      );
      setTableData(resultArray);
    }
  }, [typedWord, data]);

  const edit = (record: Partial<MemberDataType>) => {
    form.setFieldsValue({
      memberId: 0,
      name: "",
      email: "",
      mobileNo: "",
      ...record,
    });
    setEditingKey(record.memberId);
  };

  const handleDelete = (record: Partial<MemberDataType>) => {
    const newData = data.filter((item) => item.memberId !== record.memberId);
    setData(newData);
    console.log(record);

    message.success({
      content: `${record.name} removed !`,
      icon: <DeleteFilled />,
    });
  };

  const update = async (record: Partial<MemberDataType>) => {
    try {
      const row = (await form.validateFields()) as MemberDataType;
      // Patch logic for backend
      await axios.post(
        MEMBER_URL,
        {
          memberId: row.memberId,
          email: row.email,
          name: row.name,
          mobileNo: row.mobileNo,
          address: row.address,
        },
        {
          headers: authHeader(),
        }
      );

      const newData = [...data];
      const index = newData.findIndex(
        (item) => record.memberId === item.memberId
      );
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });

        setData(newData);

        setEditingKey(null);
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey(null);
      }
      message.info(`${row.name} updated !`);
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
      dataIndex: "memberId",
      width: "10%",
      editable: true,
      // fixed: "left",
    },
    {
      title: "Member",
      dataIndex: "name",
      width: "15%",
      editable: true,
      render: (_: any, record: MemberDataType) => (
        <Link to={record.memberId.toString()}>{record.name}</Link>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      width: "10%",
      editable: true,
    },
    {
      title: "Mobile",
      dataIndex: "mobileNo",
      width: "10%",
      editable: true,
    },
    {
      title: "Address",
      dataIndex: "address",
      width: "10%",
      editable: true,
    },
    {
      title: "Action",
      dataIndex: "operation",
      width: "20%",
      render: (_: any, record: MemberDataType) => {
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
      onCell: (record: MemberDataType) => ({
        record,
        inputType: col.dataIndex === "memberId" ? "number" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <div className="App">
      <div className="main-page">
        <MemberForm
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
                <Typography.Text strong style={{ color: "white" }}>
                  Member
                </Typography.Text>
              </Button>
            </Form.Item>
            <Typography.Title level={5} style={{ zIndex: 2, color: "white" }}>
              MEMBERS
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
