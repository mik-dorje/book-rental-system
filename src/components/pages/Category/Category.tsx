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
  EditOutlined,
  DeleteOutlined,
  CheckOutlined,
  RollbackOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import CategoryForm from "./CategoryForm";
import authHeader from "../../../hooks/authHeader";

const CATEGORY_URL = "bookrental/category";

export interface CategoryDataType {
  // key: string;
  categoryId: number;
  categoryName: string;
  categoryDescription: string;
}

export const originalCategoryData: CategoryDataType[] = [
  {
    // key: "",
    categoryId: 0,
    categoryName: "",
    categoryDescription: "",
  },
];

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: "number" | "text";
  record: CategoryDataType;
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
    dataIndex === "categoryId" ? (
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
              required: false,
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
  const [data, setData] = useState<CategoryDataType[]>(originalCategoryData);
  const [editingKey, setEditingKey] = useState<any>(null);
  const [loaded, setLoaded] = useState(false);

  const [isUpdate, setIsUpdate] = useState(false);

  const [typedWord, setTypedWord] = useState<any>(null);
  const [tableData, setTableData] =
    useState<CategoryDataType[]>(originalCategoryData);

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const isEditing = (record: CategoryDataType) =>
    record.categoryId === editingKey;

  const fetchData = async () => {
    try {
      const result = await axios.get(CATEGORY_URL, {
        headers: authHeader(),
        // headers: {
        //   Authorization: `Bearer ${user.jwt}`,
        // },
      });
      console.log(result.data.data);
      const dataObj = result.data.data;

      dataObj.sort((a: CategoryDataType, b: CategoryDataType) =>
        a.categoryId > b.categoryId ? 1 : b.categoryId > a.categoryId ? -1 : 0
      );

      setData(dataObj);
      setTableData(dataObj);
      setLoaded(true);
      console.log("Categories fetched");
    } catch (err: any) {
      console.log(err);
      message.error(err.message);
    }
  };

  useEffect(() => {
    fetchData();
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

  const edit = (record: Partial<CategoryDataType>) => {
    form.setFieldsValue({
      categoryId: 0,
      CategoryName: "",
      CategoryDescription: "",
      ...record,
    });
    setEditingKey(record?.categoryId);
  };

  const handleDelete = async (record: Partial<CategoryDataType>) => {
    try {
      const response = await axios.delete(
        `${CATEGORY_URL}/${record.categoryId}`,
        { headers: authHeader() }
      );
      const newData = data.filter(
        (item) => item.categoryId !== record.categoryId
      );
      setData(newData);

      if (response.status === 200) {
        message.success({
          content: response.data.message,
          icon: <DeleteFilled />,
        });
      }
    } catch (err: any) {
      message.error(err.message);
    }
  };

  const update = async (record: Partial<CategoryDataType>) => {
    setIsUpdate(true);
    // if (record.categoryName === "" || record.categoryDescription === "") {
    //   message.info("Edit field cannot be empty");
    //   setIsUpdate(false);
    //   return;
    // }
    try {
      const row = (await form.validateFields()) as CategoryDataType;
      const response = await axios.post(
        CATEGORY_URL,
        {
          categoryId: row.categoryId,
          categoryName: row.categoryName,
          categoryDescription: row.categoryDescription,
        },
        { headers: authHeader() }
      );
      const newData = [...data];

      const index = newData.findIndex(
        (item) => record.categoryId === item.categoryId
      );
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        // Patch logic for backend

        setData(newData);
        setEditingKey(null);
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey(null);
      }
      if (response.data.status === 1) {
        message.info(`${row.categoryName} updated !`);
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
    setIsUpdate(false);
  };

  const cancel = () => {
    setEditingKey(null);
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "categoryId",
      width: "15%",
      editable: true,
    },
    {
      title: "Category",
      dataIndex: "categoryName",
      width: "20%",
      editable: true,
      // render: (_: any, record: CategoryDataType) => (
      //   <Link to={record?.categoryId?.toString()}>{record.categoryName}</Link>
      // ),
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
      render: (_: any, record: CategoryDataType) => {
        const editable = isEditing(record);
        return editable ? (
          <Space size="middle">
            <Tooltip title="Update">
              <Button
                shape="circle"
                icon={
                  isUpdate ? (
                    <LoadingOutlined style={{ color: "#057499" }} />
                  ) : (
                    <CheckOutlined style={{ color: "#057499" }} />
                  )
                }
                onClick={() => update(record)}
              />
            </Tooltip>

            <Tooltip title="Back">
              <Button
                shape="circle"
                icon={<RollbackOutlined style={{ color: "#057499" }} />}
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
                  icon={<DeleteOutlined style={{ color: "#057499" }} />}
                  disabled={editingKey !== null}
                />
              </Tooltip>
            </Popconfirm>
            <Tooltip title="Edit">
              <Button
                shape="circle"
                icon={<EditOutlined style={{ color: "#057499" }} />}
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
      onCell: (record: CategoryDataType) => ({
        record,
        inputType: col.dataIndex === "categoryId" ? "number" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <div className="App">
      <div className="main-page">
        <CategoryForm
          data={data}
          setData={setData}
          fetchData={fetchData}
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
                  Category
                </Typography.Text>
              </Button>
            </Form.Item>

            <Typography.Title level={5} style={{ zIndex: 2, color: "white" }}>
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
              scroll={{ x: "40" }}
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
