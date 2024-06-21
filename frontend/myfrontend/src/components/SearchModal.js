import React, { useState } from "react";
import { Button, Modal } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import SearchForm from "./SearchForm";
const SearchModalTrigger = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <>
      <Button onClick={showModal} icon={<PlusOutlined />} type="primary">
        Add New Search
      </Button>
      <Modal
        title="Add New Search"
        open={isModalOpen}
        onOk={handleOk}
        okText="Search"
        onCancel={handleCancel}
      >
        <SearchForm showSubmitButton={false} />
      </Modal>
    </>
  );
};
export default SearchModalTrigger;
