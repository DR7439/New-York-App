import React, { useEffect, useState } from "react";
import { Button, Modal } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import SearchForm from "./SearchForm";
import { useForm } from "antd/es/form/Form";
import { atom, useRecoilState } from "recoil";
import dayjs from 'dayjs';

const state = atom({
  key: "modalOpen",
  default: false,
});

const initialFormState = atom({
  key: "initialform",
  default: null,
});

export function useSearchModal() {
  const [isModalOpen, setIsModalOpen] = useRecoilState(state);
  const [initialForm, setInitialForm] = useRecoilState(initialFormState);
  return { isModalOpen, setIsModalOpen, setInitialForm };
}

export const SearchModalTrigger = () => {
  const [, setIsModalOpen] = useRecoilState(state);
  const showModal = () => {
    setIsModalOpen(true);
  };
  return (
    <Button onClick={showModal} icon={<PlusOutlined />} type="primary">
      Add New Search
    </Button>
  );
};
function SearchModal() {
  const [isModalOpen, setIsModalOpen] = useRecoilState(state);
  const [initialForm, setInitialForm] = useRecoilState(initialFormState);
  const [form] = useForm();

  const handleOk = () => {
    form.submit();
    // setIsModalOpen(false);
  };
  const handleSuccess = () => {
    setInitialForm(null);
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setInitialForm(null);
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (isModalOpen && initialForm) {
      console.log("9779 form", initialForm);
      form.setFieldsValue({
        name: initialForm.name,
        targetMarkets: initialForm.target_market_interests,
        targetGender: initialForm.gender,
        targetAges: initialForm.target_age,
        dateRange: [
          dayjs(initialForm.start_date),
          dayjs(initialForm.end_date),
        ],
      });
    } else {
      form.resetFields();
    }
  }, [isModalOpen]);

  return (
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
  );
}
export default SearchModal;
