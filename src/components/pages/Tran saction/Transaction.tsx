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
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import axios from "../../../api/axios";
import {
  SearchOutlined,
  PlusCircleFilled,
  DeleteFilled,
  FullscreenExitOutlined,
  FullscreenOutlined,
  RiseOutlined,
  FallOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import TransactionForm from "./TransactionForm";
import { BookDataType } from "../Book/Book";
import { AuthorDataType } from "../Author/Author";
import { MemberDataType } from "../Member/Member";

const TRANSACTION_URL = "bookrent/booktransaction";

export interface TransactionDataType {
  key: string;
  bookTransactionId: number;
  code: string;
  fromDate: string;
  toDate: string;
  rentType: string;
  status: string;
  book: BookDataType[];
  author: AuthorDataType[];
  member: MemberDataType[];
}

const originData: TransactionDataType[] = [
  {
    key: "",
    bookTransactionId: 0,
    code: "code",
    fromDate: new Date().toISOString(),
    toDate: new Date().toISOString(),
    rentType: "rentType",
    status: "status",
    book: [
      {
        key: "",
        bookId: 0,
        bookName: "bookname",
        noOfPages: 0,
        isbn: "isbn",
        rating: 0,
        stockCount: 0,
        publishedDate: new Date().toISOString(),
        categoryId: 0,
        authorId: [0],
        bookImage: "bookImage",
      },
    ],
    author: [
      {
        key: "",
        authorId: null,
        authorName: "",
        authorEmail: "",
        authorMobile: "",
      },
    ],
    member: [
      {
        key: "",
        memberId: null,
        email: "",
        name: "",
        mobileNo: "",
        address: "",
      },
    ],
  },
];

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: "number" | "text";
  record: TransactionDataType;
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

const Transaction: React.FC = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState<TransactionDataType[]>(originData);
  const [editingKey, setEditingKey] = useState("");
  const [loaded, setLoaded] = useState(false);

  const [typedWord, setTypedWord] = useState<any>(null);
  const [tableData, setTableData] = useState<TransactionDataType[]>(originData);

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const isEditing = (record: TransactionDataType) => record.key === editingKey;

  const fetchData = async () => {
    const result = await axios(TRANSACTION_URL);
    console.log(result.data.data);
    // const data = result.data.map(({ username, email, phone, website, company, ...rest }) => rest);
    const dataObj = result.data.data.map((object: TransactionDataType) => {
      return {
        ...object,
        key: object?.bookTransactionId?.toString(),
      };
    });
    setData(dataObj);
    setTableData(dataObj);
    setLoaded(true);
  };

  useEffect(() => {
    fetchData();
    console.log("Book Transactions fetched");
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

  const edit = (record: Partial<TransactionDataType> & { key: React.Key }) => {
    form.setFieldsValue({
      ...record,
    });
    setEditingKey(record.key);
  };

  const handleDelete = (
    record: Partial<TransactionDataType> & { key: React.Key }
  ) => {
    const newData = data.filter((item) => item.key !== record.key);
    setData(newData);
    message.success({
      content: `${record.bookTransactionId} removed !`,
      icon: <DeleteFilled />,
    });
  };

  const update = async (key: React.Key) => {
    try {
      const row = (await form.validateFields()) as TransactionDataType;
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

  const columns = [
    {
      title: "ID",
      dataIndex: "bookTransactionId",
      // width: "5%",
      editable: true,
    },
    {
      title: "Book",
      dataIndex: "book",
      // width: "10%",
      editable: true,
      render: (_: any, record: any) => <span>{record.book.bookName},</span>,
    },
    {
      title: "Code",
      dataIndex: "code",
      // width: "10%",
      editable: true,
    },
    {
      title: "Rent Type",
      dataIndex: "rentType",
      // width: "10%",
      editable: true,
    },
    {
      title: "Status",
      dataIndex: "status",
      // width: "10%",
      editable: true,
    },
    {
      title: "Taken by",
      dataIndex: "member",
      // width: "10%",
      editable: true,
      render: (_: any, record: any) => <span>{record.member.name}</span>,
    },
    {
      title: "From",
      dataIndex: "fromDate",
      // width: "10%",
      editable: true,
    },
    {
      title: "To",
      dataIndex: "toDate",
      // width: "5%",
      editable: true,
    },
    // {
    //   title: "Action",
    //   dataIndex: "operation",
    //   width: "10%",
    //   render: (_: any, record: TransactionDataType) => {
    //     const editable = isEditing(record);
    //     return editable ? (
    //       <Space size="middle">
    //         <Button
    //           type="primary"
    //           onClick={() => update(record.key)}
    //           style={{
    //             backgroundColor: " #38375f",
    //             border: "none",
    //             width: "75px",
    //           }}
    //           className="btns"
    //         >
    //           Update
    //         </Button>

    //         <Button
    //           type="primary"
    //           onClick={cancel}
    //           style={{
    //             backgroundColor: "#2c5a73",
    //             border: "none",
    //             width: "75px",
    //           }}
    //           className="btns"
    //         >
    //           Back
    //         </Button>
    //       </Space>
    //     ) : (
    //       <Space size="middle">
    //         <Popconfirm
    //           title="Are you sure to delete this record ?"
    //           icon={<DeleteFilled style={{ color: "red" }} />}
    //           onConfirm={() => handleDelete(record)}
    //           okText="Delete"
    //           cancelText="Cancel"
    //         >
    //           <Button
    //             type="primary"
    //             danger
    //             style={{ width: "75px" }}
    //             disabled={editingKey !== ""}
    //           >
    //             Delete
    //           </Button>
    //         </Popconfirm>
    //         <Button
    //           type="primary"
    //           disabled={editingKey !== ""}
    //           onClick={() => edit(record)}
    //           style={{ width: "75px" }}
    //         >
    //           Edit
    //         </Button>
    //       </Space>
    //     );
    //   },
    // },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: TransactionDataType) => ({
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
        {/* Book Entry Form Modal */}
        <TransactionForm
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
                  Transaction
                </Typography.Text>
              </Button>
            </Form.Item>
            <Typography.Title level={5} style={{ zIndex: 2, color: "white" }}>
              TRANSACTIONS
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

export default Transaction;
