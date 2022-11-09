import "./App.css";

import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./components/Home";
import ErrorPage from "./components/ErrorPage";
import Category from "./components/pages/Category";
import Book from "./components/pages/Book";
import Author from "./components/pages/Author";
import Member from "./components/pages/Member";
import Transaction from "./components/pages/Transaction";
import CategoryDetails from "./components/pages/CategoryDetails";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/bookrental" element={<Layout />}>
          <Route path="category" element={<Category />} />
          <Route path="category/:catId" element={<CategoryDetails />} />
          <Route path="book" element={<Book />} />
          <Route path="author" element={<Author />} />
          {/* <Route path="member" element={<Member />} />
          <Route path="transaction" element={<Transaction />} /> */}
        </Route>
        <Route path="/bookrent" element={<Layout />}>
          <Route path="member" element={<Member />} />
          <Route path="booktransaction" element={<Transaction />} />
        </Route>

        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
