import "./App.css";

import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./components/Home";
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
import RentBook from "./components/pages/Tran saction/RentBook";
import RetrunBook from "./components/pages/Tran saction/ReturnBook";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/bookrental" element={<Layout />}>
          <Route path="category" element={<Category />} />
          <Route path="category/:id" element={<SingleCategory />} />
          <Route path="book" element={<Book />} />
          <Route path="book/:id" element={<SingleBook />} />
          <Route path="author" element={<Author />} />
          <Route path="author/:id" element={<SingleAuthor />} />
          {/* <Route path="member" element={<Member />} />
          <Route path="transaction" element={<Transaction />} /> */}
        </Route>
        <Route path="/bookrent" element={<Layout />}>
          <Route path="member" element={<Member />} />
          <Route path="member/:id" element={<SingleMember />} />
          <Route path="booktransaction" element={<Transaction />} />
          <Route path="booktransaction/rent-book" element={<RentBook />} />
          <Route path="booktransaction/return-book" element={<RetrunBook />} />
        </Route>

        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
