import "./App.css";

import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import ErrorPage from "./components/ErrorPage";
import Category from "./components/pages/Category/Category";
import Book from "./components/pages/Book/Book";
import Author from "./components/pages/Author/Author";
import Member from "./components/pages/Member/Member";
import Transaction from "./components/pages/Tran saction/Transaction";
import SingleCategory from "./components/pages/Category/SingleCategory";
import SingleAuthor from "./components/pages/Author/SingleAuthor";
import SingleMember from "./components/pages/Member/SingleMember";
import SingleBook from "./components/pages/Book/SingleBook";
import Register from "./components/Register";
import Login from "./components/Login";
import RentReturn from "./components/pages/Tran saction/RentReturn";
import ReturnBook from "./components/pages/Tran saction/ReturnBook";

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Register />} />

      <Route path="login" element={<Login />} />

      <Route path="/bookrental" element={<Layout />}>
        <Route path="category" element={<Category />} />
        <Route path="category/:id" element={<SingleCategory />} />
        <Route path="book" element={<Book />} />
        <Route path="book/:id" element={<SingleBook />} />
        <Route path="author" element={<Author />} />
        <Route path="author/:id" element={<SingleAuthor />} />
        <Route path="member" element={<Member />} />
        <Route path="member/:id" element={<SingleMember />} />

        <Route path="booktransaction" element={<Transaction />} />
        <Route
          path="booktransaction/add-book-transaction"
          element={<RentReturn />}
        />
        <Route path="booktransaction/return-book" element={<ReturnBook />} />
      </Route>

      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
};

export default App;
