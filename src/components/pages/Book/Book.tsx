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
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import BookForm from "./BookForm";
import { Link } from "react-router-dom";
import authHeader from "../../../hooks/authHeader";

const BOOK_URL = "/bookrental/book";

export interface BookDataType {
  // key: string;
  bookId: number;
  bookName: string;
  noOfPages: number;
  isbn: string;
  rating: number;
  stockCount: number;
  publishedDate: string;
  categoryId: number | null;
  authorId: number[] | null[];
  bookImage: string;
}

export const originalBookData: BookDataType[] = [
  {
    // key: "",
    bookId: 0,
    bookName: "",
    noOfPages: 0,
    isbn: "",
    rating: 0,
    stockCount: 0,
    publishedDate: new Date().toISOString(),
    categoryId: null,
    authorId: [null],
    bookImage: "bookImage",
  },
];

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: "number" | "text";
  record: BookDataType;
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
    dataIndex === "bookId" ? (
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
  const [data, setData] = useState<BookDataType[]>(originalBookData);
  const [editingKey, setEditingKey] = useState<any>(null);
  const [loaded, setLoaded] = useState(false);

  const [typedWord, setTypedWord] = useState<any>(null);
  const [tableData, setTableData] = useState<BookDataType[]>(originalBookData);

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const isEditing = (record: BookDataType) => record.bookId === editingKey;

  const fetchData = async () => {
    const result = await axios(BOOK_URL, {
      headers: authHeader(),
    });
    console.log(result.data.data);
    const dataObj = result.data.data;

    dataObj.sort((a: BookDataType, b: BookDataType) =>
      a.bookId > b.bookId ? 1 : b.bookId > a.bookId ? -1 : 0
    );

    setData(dataObj);
    setTableData(dataObj);
    setLoaded(true);
    console.log("Books fetched");
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setTableData(data);
    // if (typedWord) {
    //   const resultArray = data?.filter(
    //     (item) =>
    //       item?.categoryId
    //         ?.toString()
    //         .toLowerCase()
    //         .includes(typedWord.toLowerCase()) ||
    //       item?.categoryName?.toLowerCase().includes(typedWord.toLowerCase()) ||
    //       item?.categoryDescription
    //         ?.toLowerCase()
    //         .includes(typedWord.toLowerCase())
    //   );
    //   setTableData(resultArray);
    // }
  }, [typedWord, data]);

  const edit = (record: Partial<BookDataType>) => {
    form.setFieldsValue({
      // categoryId: "",
      // CategoryName: "",
      // CategoryDescription: "",
      ...record,
    });
    setEditingKey(record.bookId);
  };

  const handleDelete = (record: Partial<BookDataType>) => {
    const newData = data.filter((item) => item.bookId !== record.bookId);
    setData(newData);
    message.success({
      content: `${record.bookName} removed !`,
      icon: <DeleteFilled />,
    });
  };

  const update = async (record: Partial<BookDataType>) => {
    try {
      const row = (await form.validateFields()) as BookDataType;
      const newData = [...data];
      const index = newData.findIndex((item) => record.bookId === item.bookId);
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
      message.info("Data updated !");
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
      dataIndex: "bookId",
      // width: "5%",
      editable: true,
    },
    {
      title: "Name",
      dataIndex: "bookName",
      // width: "10%",
      editable: true,
      render: (_: any, record: BookDataType) => (
        <Link to={record?.bookId?.toString()}>{record.bookName}</Link>
      ),
    },
    {
      title: "ISBN",
      dataIndex: "isbn",
      // width: "10%",
      editable: true,
    },
    {
      title: "Rating",
      dataIndex: "rating",
      // width: "5%",
      editable: true,
    },

    {
      title: "Action",
      dataIndex: "operation",
      width: "10%",
      render: (_: any, record: BookDataType) => {
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
      onCell: (record: BookDataType) => ({
        record,
        inputType: col.dataIndex === "bookId" ? "number" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <div className="App">
      <div className="main-page">
        {/* Book Entry Form Modal */}
        <BookForm
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
                  Book
                </Typography.Text>
              </Button>
            </Form.Item>
            <Typography.Title level={5} style={{ zIndex: 2, color: "white" }}>
              BOOKS
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
