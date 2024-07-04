import React, { useState } from "react";
import { Button, Modal } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import SearchForm from "./SearchForm";
import { useForm } from "antd/es/form/Form";
const SearchModalTrigger = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form] = useForm();
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    form.submit();
    // setIsModalOpen(false);
  };
  const handleSuccess = () => {
    setIsModalOpen(false)
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
        <SearchForm
          formInstance={form}
          showSubmitButton={false}
          onSubmit={handleOk}
          onSuccess={handleSuccess}
        />
      </Modal>
    </>
  );
};
export default SearchModalTrigger;
