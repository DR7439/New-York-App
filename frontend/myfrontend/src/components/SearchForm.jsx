import { ExclamationCircleOutlined } from "@ant-design/icons";
import {
  Alert,
  Button,
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  Select,
} from "antd";
import { useForm } from "antd/es/form/Form";
import dayjs from "dayjs";
import React, { useState } from "react";
import axiosInstance from "../axiosInstance";
import { AGES_RANGES } from "../constant";
import useCredits from "../hooks/useCredits";
import useInterests from "../hooks/useInterests";
import useSearches from "../hooks/useSearches";

const { Option } = Select;
const { confirm } = Modal;

export default function SearchForm({
  formInstance,
  onSuccess,
  showSubmitButton = true,
  formRef,
  isFreeSearch = false,
}) {
  const interests = useInterests();
  const { fetchSearches } = useSearches();
  const { fetchCreditData, isInsufficientCredits } = useCredits();
  const [form] = useForm(formInstance);
  const [submitting, setSubmitting] = useState(false);
  let alertMessage = isFreeSearch
    ? "Your first search is free. Subsequent searches cost 10 credits per day for each selected target date."
    : "A rate of 10 credits per day applies for your selected target date.";

  let onFinish = async (values) => {
    let data = new FormData();
    data.append("name", values.name);
    data.append("start_date", values.dateRange[0].format("YYYY-MM-DD"));
    data.append("end_date", values.dateRange[1].format("YYYY-MM-DD"));
    data.append("date_search_made_on", new Date().toISOString().split("T")[0]);
    values.targetMarkets.forEach((market) => {
      data.append("target_market_interests", market);
    });
    values.targetAges.forEach((age) => {
      data.append("target_age", age);
    });
    data.append("gender", values.targetGender);

    // cors allow origin
    try {
      setSubmitting(true);
      const res = await axiosInstance.post("/api/search/", data);
      onSuccess && onSuccess();
      fetchSearches();
      fetchCreditData();
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  let handleConfirm = (values) => {
    let startDate = values.dateRange[0];
    let endDate = values.dateRange[1];
    let selectedDateNumber = Math.abs(startDate.diff(endDate, "day")) + 1;
    let creditCost = selectedDateNumber * 10;
    if (isInsufficientCredits(creditCost)) {
      message.error("You don't have enough credits to make this search.");
      return;
    }
    if (isFreeSearch) {
      onFinish(values);
      return;
    }
    confirm({
      title: `Are you sure that you want to use ${creditCost} credits for this search?`,
      icon: <ExclamationCircleOutlined />,
      content: `You will be charged ${creditCost} credits per day for the selected date range.`,
      okText: "Yes",
      cancelText: "No",
      centered: true,
      onOk() {
        // cors allow origin
        onFinish(values);
      },
    });
  };
  const disabledDate = (current, info) => {
    let isDisabled = current && current < dayjs().endOf("day");
    if (!isDisabled && info && info.from) {
      let next = dayjs(info.from).add(14, "day");
      let before = dayjs(info.from).subtract(14, "day");
      isDisabled = current > next || current < before;
    }
    return isDisabled;
  };

  return (
    <Form
      ref={formRef}
      name="basic"
      form={form}
      layout="vertical"
      style={{
        maxWidth: 600,
      }}
      onFinish={handleConfirm}
      initialValues={{
        remember: true,
      }}
      autoComplete="off"
    >
      <div id="field-name">
        <Form.Item
          label="Search Name"
          name="name"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input placeholder="Search Name" />
        </Form.Item>
      </div>
      <div id="field-target-markets">
        <Form.Item
          name="targetMarkets"
          label="Target Market Interest"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select mode="tags" placeholder="Select Target Market Interest">
            {interests.map((interest, index) => (
              <Option key={index} value={interest.name}>
                {interest.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </div>
      <div id="field-target-gender">
        <Form.Item
          name="targetGender"
          label="Target Gender"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select placeholder="Select Gender">
            <Option value="M">Male</Option>
            <Option value="F">Female</Option>
            <Option value="B">Both Genders</Option>
          </Select>
        </Form.Item>
      </div>
      <div id="field-target-ages">
        <Form.Item
          name="targetAges"
          label="Target Age"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select mode="tags" placeholder="Select age group">
            {AGES_RANGES.map((age_range, index) => (
              <Option key={index} value={index + 1}>
                {age_range}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </div>
      <div id="field-date-range">
        <Form.Item
          name="dateRange"
          label="Target Date"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <DatePicker.RangePicker
            className="w-full"
            disabledDate={disabledDate}
          />
        </Form.Item>
      </div>
      <Alert message={alertMessage} type="info" showIcon />
      {showSubmitButton && (
        <Form.Item className="mt-4">
          <Button type="primary" htmlType="submit" id="submit-button" loading={submitting}>
            Start my free search
          </Button>
        </Form.Item>
      )}
    </Form>
  );
}
