import { Form, Input, InputNumber, Row, Space, Table, Typography } from "antd";
import React, { useEffect, useState } from "react";
import axios from "../../../api/axios";
import { SearchOutlined } from "@ant-design/icons";
import TransactionForm from "./TransactionForm";
import { BookDataType, originalBookData } from "../Book/Book";
import { AuthorDataType, originalAuthorData } from "../Author/Author";
import { MemberDataType, originalMemberData } from "../Member/Member";
import authHeader from "../../../hooks/authHeader";

const TRANSACTION_URL = "bookrental/booktransaction";

export interface TransactionDataType {
  // key: string;
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
    // key: "",
    bookTransactionId: 0,
    code: "code",
    fromDate: new Date().toISOString(),
    toDate: new Date().toISOString(),
    rentType: "rentType",
    status: "status",
    book: originalBookData,
    author: originalAuthorData,
    member: originalMemberData,
    // book: [
    //   {
    //     // key: "",
    //     bookId: 0,
    //     bookName: "bookname",
    //     noOfPages: 0,
    //     isbn: "isbn",
    //     rating: 0,
    //     stockCount: 0,
    //     publishedDate: new Date().toISOString(),
    //     categoryId: 0,
    //     authorId: [0],
    //     bookImage: "bookImage",
    //   },
    // ],
    // author: [
    //   {
    //     // key: "",
    //     authorId: 0,
    //     authorName: "",
    //     authorEmail: "",
    //     authorMobile: "",
    //   },
    // ],
    // member: [
    //   {
    //     // key: "",
    //     memberId: 0,
    //     email: "",
    //     name: "",
    //     mobileNo: "",
    //     address: "",
    //   },
    // ],
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
  const [editingKey, setEditingKey] = useState<any>(null);
  const [loaded, setLoaded] = useState(false);

  const [typedWord, setTypedWord] = useState<any>(null);
  const [tableData, setTableData] = useState<TransactionDataType[]>(originData);

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const isEditing = (record: TransactionDataType) =>
    record.bookTransactionId === editingKey;

  const fetchData = async () => {
    const result = await axios.get(TRANSACTION_URL, { headers: authHeader() });
    console.log(result.data.data);
    const dataObj = result.data.data;
    setData(dataObj);
    setTableData(dataObj);
    setLoaded(true);
    console.log("Book Transactions fetched");
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setTableData(data);
    if (typedWord) {
      const resultArray = data?.filter(
        (item) =>
          item?.bookTransactionId
            ?.toString()
            .toLowerCase()
            .includes(typedWord.toLowerCase()) ||
          item?.code?.toLowerCase().includes(typedWord.toLowerCase()) ||
          item?.rentType.toLowerCase().includes(typedWord.toLowerCase())
      );
      setTableData(resultArray);
    }
  }, [typedWord, data]);

  const cancel = () => {
    setEditingKey(null);
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
      render: (_: any, record: any) => <span>{record.book.bookName}</span>,
    },
    {
      title: "Code",
      dataIndex: "code",
      // width: "10%",
      editable: true,
    },
    {
      title: "Type",
      dataIndex: "rentType",
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
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: TransactionDataType) => ({
        record,
        inputType: col.dataIndex === "bookTransactionId" ? "number" : "text",
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
            <Typography.Title level={5} style={{ zIndex: 2, color: "white" }}>
              TRANSACTION
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
                pageSize: 6,
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
